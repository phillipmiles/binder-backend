const userController = require('./../controllers/user.ctrl')
const isAuthenticated = require('./../middleware/isAuthenticated.js')
const isUserActivated = require('./../middleware/isUserActivated.js')



const passport = require('passport');
var User  = require('../models').User;


module.exports = (router) => {
    // router
    //     .route('/users')
    //     .get(userController.getAllUsers);

    // router
    //     .route('/user/:id')
    //     .get(userController.getUser);

    // router
    //     .route('/user')
    //     .post(userController.addUser);

    // router
    //     .route('/user/node')
    //     .post(userController.addNode);

    // use this guide on API URI naming... https://restfulapi.net/resource-naming/
    router
        .route('/user/test')
        .get(userController.test);

    router
        .route('/user')
        .post(userController.registerUser);

    router
        .route('/user/login')
        .post(userController.loginUser);

    router
        .route('/user/logout')
        .get(userController.logoutUser);

    router
        .route('/user/activate/:token')
        .get(userController.activateUser);

    // router
    //     .route('/user/:user_id/nodes')
    //     .get(userController.getNodes);

    router
        .route('/user/share')
        .get(isAuthenticated, userController.websocketConnect);

    router
        .route('/users/:userId/workspaces')
        .get(isAuthenticated, isUserActivated, userController.getWorkspaces);

    router
        .route('/users/:userId/nodes')
        .get(isAuthenticated, isUserActivated, userController.getNodes);

    router
        .route('/users/:userId/bin')
        .get(isAuthenticated, isUserActivated, userController.getBinnedNodes);
        

        

    // router
    //     .post('/user/login', passport.authenticate('local', {failureRedirect: '/loginOut', failureFlash: false}), (req, res, next) => {
    //         console.log('hi 2');
    //     });

    router
        .post('/user/register', (req, res, next) => {
            User.register(new User({ email: 'test@test.com'}), 'password', (err, user) => {
                if(err) {
                    return res.send('derp');
                }
                
                console.log('woo');
            });
        });
        // .post()
}