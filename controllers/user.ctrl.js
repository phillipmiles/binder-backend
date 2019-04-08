/** server/controllers/article.ctrl.js*/
var models  = require('../models');
var tokenStore  = require('../services/token_store.js');
const mailer  = require('../services/mailer.js');

const passport = require('passport');
const argon2 = require('argon2');
// const bcrypt = require('bcrypt');

// TODO: Check to see i we even need this is multiple spots or if
// it running from app.js is enough.
const dotenv = require("dotenv");
const { dotenvError } = dotenv.config({ path: ".env.local" });


module.exports = {

    test: (req, res, next) => {
        models.User.findAll({
            // include: [ models.Task ]
        }).then(function(users) {
            res.send(users);
            // res.render('index', {
            //     title: 'Sequelize: Express Example',
            //     users: users
            // });
        });
    },

    activateUser: async (req, res, next) => {
        try {
            const token = req.params.token;
            
            const storedToken = await models.User_activation.find({
                where: {
                    token: token
                }
            });
            
            // TODO: Update all API codes for this route.
            // TODO: Move validation to Model.
            if (!storedToken)
                throwError(400, 'Cannot find token.')();

            // Has token expired?
            if(storedToken.expires < new Date) {
                storedToken.destroy();
                // TODO: Front-end needs to prompt for a new activation token to be sent.
                // will need a new route to create new tokens without registering a whole new account.
                throwError(400, 'Token has expired.')();
            }

            const user = await models.User.findById(storedToken.user_id);
            
            if(!user) {
                storedToken.destroy();
                throwError(400, 'User attached to token does not exist')();
            }

            if(user.active) {
                storedToken.destroy();
                throwError(400, 'User has already been activated.')();
            }

            // Activate user.
            user.active = true;
            await user.save();

            // Destroy token.
            storedToken.destroy();

            // TODO: Redirect user to login here or from react????

            return res.status(200).json({
                status: 'ok',
                code: res.statusCode,
                message: 'User successfully activated.',
                result: {
                    user: user
                }
            });
        } catch (err) {
            next(err);
        } 
    },


    // Create a new user 
    // TODO: A create user route for a premium account.
    registerUser: async (req, res, next) => {
        try {
            const password = req.body.password;

            const user = await models.User.build({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                type: 'basic',
                active: false
            });

            console.log('USER:', user);
            await user.validate({skip: ['password']});
            
            // max 32 characters to prevent chewing too much CPU power on the hashing alogirthm.
            var passwordRegex = /^((?=.*?[a-zA-Z])((?=.*\d)|(?=.*[!@#\$%\^&]))).{8,32}$/

            if(!password)
                throwError(400, 'No password provided.')();

            if(!password.match(passwordRegex)) 
                throwError(400, 'Password does not meet minimum requirements.')();

            // Look for existing user with email.
            const existingUser = await models.User.find({
                where: { email: user.email },
            });

            if(existingUser)
                throwError(403, 'An account with this email already exists.')();
            
            const passwordHash = await argon2.hash(password);
            
            // const passwordHash = bcrypt.hashSync(password, 10);
            
            // Start DB transaction
            models.sequelize.transaction( async function a(t) {
                
                user.password = passwordHash;

                await user.save({transaction: t});

                const userActivation = await models.User_activation.create({ 
                    user_id: user.uuid, 
                    expires: new Date(Date.now() + 60 * 60 * 24 * 1000) // 1 Day
                }, {transaction: t})

                const nodeRoot = await models.Workspace_node.create({
                    type: 'root'
                }, {transaction: t});

                const nodeBin = await models.Workspace_node.create({
                    type: 'bin'
                }, {transaction: t});

                const nodeRootClosure = await models.Workspace_node_closure.bulkCreate([
                    {
                        ancestor: nodeRoot.uuid,
                        descendant: nodeRoot.uuid,
                        length: 0
                    },
                    {
                        ancestor: nodeBin.uuid,
                        descendant: nodeBin.uuid,
                        length: 0
                    }
                ], {transaction: t});

                const nodeRootAccess = await models.Workspace_node_access.bulkCreate([
                    {
                        user_id: user.uuid,
                        node_id: nodeRoot.uuid,
                        type: 'write',
                        status: 'active'
                    },
                    {
                        user_id: user.uuid,
                        node_id: nodeBin.uuid,
                        type: 'write',
                        status: 'active'
                    }
                ], {transaction: t});

                var activationUrl;
                // TODO: Should this move somewhere else, like into a config file?
                if(process.env.NODE_ENV === 'production') {
                    activationUrl = 'https://' + process.env.ORIGIN + '/api/user/activate/' + userActivation.token
                } else if(process.env.NODE_ENV === 'development') {
                    activationUrl = 'http://' + process.env.ORIGIN_DEV + ':5000/api/user/activate/' + userActivation.token
                }
                // TODO: Fix up these other details. Do the text/html values be used if the template fails?
                const msg = {
                    to: user.email,
                    from: 'test@example.com',
                    subject: 'Sending with SendGrid is Fun',
                    text: 'and easy to do anywhere, even with Node.js',
                    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                    templateId: mailer.templateIds.userActivation,
                    dynamic_template_data: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        activationUrl: activationUrl
                    },
                };
                
                mailer.send(msg);

                return user;

            }).then(function (result) {
                // Transaction committed
                return res.status(200).json({
                    status: 'ok',
                    code: res.statusCode,
                    message: 'User successfully created.',
                    result: {
                        user: result
                    }
                });
            }).catch(function (err) {
                // Transaction rolled back
                next(err);
            });           
        } catch (err) {
            next(err);
        }   
    },

    loginUser: (req, res, next) => {
        try {
            if(!req.body.username)
                throwError(500, 'No username provided.')();

            if(!req.body.password)
                throwError(500, 'No password provided.')();
            
            passport.authenticate('local', function(err, user, info) {
            
            // TODO: Redirect if account still requires activation to a 'send new activation email'
            // screen like the same on the register account route. OR consider if the user
            // should have some sort of limited access with an unactive account. Google
            // what restrictions should be placed on an unauthenticated account.

            // TODO: Rewrite the below.
                if(err) {
                    console.log('error', err);
                    return next(err);
                }
                if(info) {
                    console.log(info);
                    return next(info);
                }
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    // user.password = req.session.cookie._expires;
                    // user.expires = req.session.cookie._expires;
                    console.log('dont look...', req.session.cookie._expires);
                    return res.status(200).json({
                        status: 'ok',
                        code: res.statusCode,
                        message: 'Login successful.',
                        result: {
                            // user: user
                            user: {
                                uuid: user.uuid,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                active: user.active,
                                type: user.type,
                                expires: req.session.cookie._expires,
                                createdAt: user.createdAt,
                                updatedAt: user.updatedAt
                            }
                        }
                    });
                });
            })(req, res, next);
            
        } catch (err) {
            next(err);
        }  
    },

    logoutUser: (req, res, next) => {
        try {
            // app.get('/logout', function(req, res){
                req.logout();
                
                return res.status(200).json({
                    status: 'ok',
                    code: res.statusCode,
                    message: 'Logout successful.',
                    result: {}
                });
            // }); 
        } catch (err) {
            next(err);
        }
    },

    // TODO: Add isAuthenticated to this route.
    websocketConnect: async (req, res, next) => {
        const user = await models.User.findById(req.user.uuid); 

        const token = tokenStore.signAuth({userId: req.user.uuid});
        const refreshToken = tokenStore.signRefresh({userId: req.user.uuid});
        // const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        // const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
        const response = {
            "status": "Logged in",
            "token": token,
            "refreshToken": refreshToken,
        }
        
        // TODO: Not using a store yet.
        // tokenStore.tokens[refreshToken] = response
        
        // TODO: Should this move somewhere else, like into a config file?
        var url = '';
        url = 'ws://' + process.env.ORIGIN + ':' + process.env.PORT_WS;
        // TODO: BRING BACK SECURE WEBSOCKETS!!!
        // if(process.env.NODE_ENV === 'production') {
        //     url = 'wss://' + process.env.ORIGIN + ':5000'
        // } else if(process.env.NODE_ENV === 'development') {
            // url = 'ws://' + process.env.ORIGIN_DEV + ':5000'
        // }

        res.status(200).json({
            status: 'ok',
            code: res.statusCode,
            message: 'Your token has been set.',
            result: {
                url: url,
                status: "Logged in",
                token: token,
                refreshToken: refreshToken,
                
            },
        });


    },

    getWorkspaces: async (req, res, next) => {
        try {
            if(req.user.uuid !== req.params.userId)
                throwError(400, 'Permission denied.')();

            // Fetch parent node.
            const rootNode = await models.Workspace_node.getUserRootNode(req.user.uuid);
            
            if(!rootNode)
                throwError(400, 'Could not locate the user\'s root node.')();

            const workspaces = await models.Workspace_node.getChildrenOfType(rootNode[0].dataValues.id, 'workspace');

            res.status(200).json({
                status: 'ok',
                code: res.statusCode,
                message: 'Found nodes.',
                result: {
                    nodes: workspaces
                },
            });


        } catch (err) {
            next(err);
        }
    },


    getBinnedNodes: async (req, res, next) => {
        try {
            if(req.user.uuid !== req.params.userId)
                throwError(400, 'Permission denied.')();

            // Fetch parent node.
            const binNode = await models.Workspace_node.getUserNodesOfType(req.user.uuid, 'bin');

            if(!binNode)
                throwError(400, 'Could not locate the user\'s bin node.')();

            const nodes = await models.Workspace_node.getChildren(binNode[0].dataValues.id);

            res.status(200).json({
                status: 'ok',
                code: res.statusCode,
                message: 'Found nodes.',
                result: {
                    nodes: nodes
                },
            });


        } catch (err) {
            next(err);
        }
    },


    getNodes: async (req, res, next) => {
        try {
            if(req.user.uuid !== req.params.userId)
                throwError(400, 'Permission denied.')();

            // Fetch parent node.
            const rootNode = await models.Workspace_node.getUserRootNode(req.user.uuid);
            
            if(!rootNode)
                throwError(400, 'Could not locate the user\'s root node.')();

            const nodes = await models.Workspace_node.getChildren(rootNode[0].dataValues.id);

            res.status(200).json({
                status: 'ok',
                code: res.statusCode,
                message: 'Found nodes.',
                result: {
                    nodes: nodes
                },
            });


        } catch (err) {
            next(err);
        }
    }

}

