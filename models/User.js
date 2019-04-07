'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'A first name is missing.'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'A last name is missing.'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'The email you entered is invalid.'
                }
            }
        },  
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('basic', 'premium', 'admin'),
            defaultValue: 'basic'
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {});

    User.associate = function(models) {
        models.User.hasOne(models.User_activation, {
            foreignKey: 'user_id'
        });

        models.User.hasMany(models.Workspace_node_access, {
            as: 'Accesses',
            foreignKey: 'user_id'
        });
    };

    // Provided model functions
    // User.findById = function (uuid);

    User.findByEmail = function( email ) {
        console.log('email', email)

        // var query = `SELECT email
        //     FROM Users U
        //     WHERE U.email = :email`;

        // return sequelize.query(query, { 
        //     replacements: { email: email }, 
        //     type: sequelize.QueryTypes.SELECT
        // });
        const result = User.findOne({
                where: { email: email }
            });

            // console.log('result', result.then);
            return result;

        // return User.findOne({
        //     where: { email: email }
        // });
    };

    User.getUserNodesOfType = function(userId, type) {

        // return sequelize.query(
        //     `SELECT N.*
        //     FROM users U
        //     LEFT JOIN workspace_node_accesses A ON A.user_id = U.uuid
        //     LEFT JOIN workspace_nodes N ON N.uuid = A.node_id
        //     WHERE U.uuid = :userId AND N.type = :type`,
        // { 
        //     replacements: { 
        //         userId: userId,
        //         type: type
        //     }, 
        //     type: sequelize.QueryTypes.SELECT 
        // }); 
    };

    User.getUserNodes = function(userId) {

        // return sequelize.query(
        //     `SELECT C.ancestor,
        //     C.descendant as id,
        //     C.length as depth,
        //     O.order, 
        //     c2.ancestor as parent_id,
        //     CONCAT( COALESCE(WS.title,''), '', COALESCE(SS.title,''), '', COALESCE(DOC.title,'') ) AS title
        //     FROM users U
        //     LEFT JOIN workspace_node_accesses A ON A.user_id = U.uuid
        //     LEFT JOIN workspace_nodes N ON N.uuid = A.node_id
        //     LEFT JOIN workspace_node_closures C ON C.descendant = N.uuid
        //     LEFT JOIN 
        //     ( SELECT workspace_node_closures.* 
        //         FROM workspace_node_closures 
        //         WHERE workspace_node_closures.length = 1 AND workspace_node_closures.ancestor IN (SELECT descendant FROM workspace_node_closures WHERE ancestor = :parentNodeId)
        //         ) C2 ON C2.descendant = C.descendant
        //     LEFT JOIN workspaces WS ON WS.node_id = N.uuid
        //     LEFT JOIN subspaces SS ON SS.node_id = N.uuid
        //     LEFT JOIN documents DOC ON DOC.node_id = N.uuid
        //     LEFT JOIN workspace_node_orders O ON O.ancestor = C2.ancestor AND O.node_id = C.descendant
        //     WHERE U.uuid = :userId
        //     AND c.ancestor = :parentNodeId
        //     AND c.depth = :depth
        //     ORDER BY C.length, O.order ASC;`, 
        // { 
        //     replacements: { 
        //         userId: userId,
        //     }, 
        //     type: sequelize.QueryTypes.SELECT 
        // }); 
    };

    User.getNodes = function() {
        sequelize.query(
            `SELECT C.ancestor,
            C.descendant as uuid,
            C.length as depth,
            c2.ancestor as parent_id
            FROM Workspace_nodes N
            LEFT JOIN Workspace_node_closures  C ON C.descendant = N.uuid
            LEFT JOIN 
                ( SELECT Workspace_node_closures.* 
                    FROM Workspace_node_closures 
                    WHERE Workspace_node_closures.length = 1 AND Workspace_node_closures.ancestor IN (SELECT descendant FROM workspace_node_closures)
                    ) C2 ON C2.descendant = C.descendant
            ORDER BY C.length;`, 
            // [
            //     $node_access->id,
            //     $node_access->id
            // ],
            { replacements: {  }, type: sequelize.QueryTypes.SELECT }
            // { replacements: { user_id: req.params.user_id }, type: sequelize.QueryTypes.SELECT }
        ).then(projects => {
            console.log(projects)
        })
    };

    
    return User;
};