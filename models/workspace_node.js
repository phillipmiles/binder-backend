'use strict';
module.exports = (sequelize, DataTypes) => {
    var Workspace_node = sequelize.define('Workspace_node', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        type: {
            type: DataTypes.ENUM('root', 'bin', 'workspace', 'subspace', 'document')
        }
    }, {
        getterMethods: {

            canDelete() {
                switch(this.type) {
                    case 'root':
                        return false;
                    case 'bin':
                        return false;
                    case 'workspace':
                        return true;
                    case 'subspace':
                        return true; 
                    case 'document':
                        return true; 
                    default:
                        return false;
                }
            },

            canShare() {
                switch(this.type) {
                    case 'root':
                        return false;
                    case 'bin':
                        return false;
                    case 'workspace':
                        return true;
                    case 'subspace':
                        return true; 
                    case 'document':
                        return true; 
                    default:
                        return false;
                }
            },

            canMove() {
                switch(this.type) {
                    case 'root':
                        return false;
                    case 'bin':
                        return false;
                    case 'workspace':
                        return true;
                    case 'subspace':
                        return true; 
                    case 'document':
                        return true; 
                    default:
                        return false;
                }
            },

            canHaveChildren() {
                switch(this.type) {
                    case 'root':
                        return ['workspace'];
                    case 'bin':
                        return ['workspace', 'subspace', 'document'];
                    case 'workspace':
                        return ['subspace', 'document'];
                    case 'subspace':
                        return ['subspace', 'document'];
                    case 'document':
                        return false; 
                    default:
                        return false;
                }
            }
        },
    });

    Workspace_node.associate = function(models) {
        // associations can be defined here
        models.Workspace_node.hasOne(models.Document, {
            foreignKey: 'node_id'
        });
        models.Workspace_node.hasOne(models.Subspace, {
            foreignKey: 'node_id'
        });
        models.Workspace_node.hasMany(models.Workspace_node_access, {
            as: 'Accesses',
            foreignKey: 'node_id'
        });
        models.Workspace_node.hasMany(models.Workspace_node_closure, {
            as: 'Closures',
            foreignKey: 'descendant'
        });
        models.Workspace_node.hasMany(models.Workspace_node_order, {
            foreignKey: 'node_id'
        });

    };


    Workspace_node.getUserRootNode = function(userId) {

        return sequelize.query(
            `SELECT C.ancestor,
            C.descendant as id,
            C.length as depth,
            C.ancestor as parent_id,
            N.type,
            A.type as access_type,
            A.status as access_status
            FROM Users U
            LEFT JOIN Workspace_node_accesses A ON A.user_id = U.uuid
            LEFT JOIN Workspace_nodes N ON N.uuid = A.node_id
            LEFT JOIN Workspace_node_closures C ON C.descendant = N.uuid
            WHERE U.uuid = :userId AND N.type = 'root'`,
        {
            replacements: { 
                userId: userId,
            }, 
            model: Workspace_node,
            type: sequelize.QueryTypes.SELECT 
        }); 
    };

    // Returns all nodes of a particular type belonging to a given user.
    Workspace_node.getUserNodesOfType = function(userId, type) {

        return sequelize.query(
            `SELECT C.ancestor,
            C.descendant as id,
            C.length as depth,
            C.ancestor as parent_id,
            N.type,
            A.type as access_type,
            A.status as access_status
            FROM Users U
            LEFT JOIN Workspace_node_accesses A ON A.user_id = U.uuid
            LEFT JOIN Workspace_nodes N ON N.uuid = A.node_id
            LEFT JOIN Workspace_node_closures C ON C.descendant = N.uuid
            WHERE U.uuid = :userId AND N.type = 'bin'`,
        {
            replacements: { 
                userId: userId,
                // type: type
            }, 
            model: Workspace_node,
            type: sequelize.QueryTypes.SELECT 
        }); 
    };
   
    Workspace_node.getChildren = function(nodeId) {

        return sequelize.query(
            `SELECT C.ancestor,
            C.descendant as id,
            C.length as depth,
            O.order, 
            C2.ancestor as parent_id,
            DOC.uuid as content_id,
            DOC.lastEdited as lastEdited,
            N.createdAt as createdAt,
            CONCAT( COALESCE(WS.title,''), '', COALESCE(SS.title,''), '', COALESCE(DOC.title,'') ) AS title,
            N.type
            FROM Workspace_nodes N
            LEFT JOIN Workspace_node_closures C ON C.descendant = N.uuid
            LEFT JOIN 
                ( SELECT Workspace_node_closures.* 
                    FROM Workspace_node_closures 
                    WHERE Workspace_node_closures.length = 1 AND Workspace_node_closures.ancestor IN (SELECT descendant FROM Workspace_node_closures WHERE ancestor = :parentNodeId)
                    ) C2 ON C2.descendant = C.descendant
            LEFT JOIN Workspaces WS ON WS.node_id = N.uuid
            LEFT JOIN Subspaces SS ON SS.node_id = N.uuid
            LEFT JOIN Documents DOC ON DOC.node_id = N.uuid
            LEFT JOIN Workspace_node_orders O ON O.ancestor = C2.ancestor AND O.node_id = C.descendant
            WHERE C.ancestor = :parentNodeId
            ORDER BY C.length, O.order ASC;`, 
        { 
            replacements: { parentNodeId: nodeId }, 
            type: sequelize.QueryTypes.SELECT 
        });
    };


    Workspace_node.getChildrenAtDepth = function(nodeId, depth) {

        return sequelize.query(
            `SELECT C.ancestor,
            C.descendant as id,
            C.length as depth,
            O.order, 
            C2.ancestor as parent_id,
            CONCAT( COALESCE(WS.title,''), '', COALESCE(SS.title,''), '', COALESCE(DOC.title,'') ) AS title,
            N.type
            FROM Workspace_nodes N
            LEFT JOIN Workspace_node_closures C ON C.descendant = N.uuid
            LEFT JOIN 
                ( SELECT Workspace_node_closures.* 
                    FROM Workspace_node_closures 
                    WHERE Workspace_node_closures.length = 1 AND Workspace_node_closures.ancestor IN (SELECT descendant FROM Workspace_node_closures WHERE ancestor = :parentNodeId)
                    ) C2 ON C2.descendant = C.descendant
            LEFT JOIN Workspaces WS ON WS.node_id = N.uuid
            LEFT JOIN Subspaces SS ON SS.node_id = N.uuid
            LEFT JOIN Documents DOC ON DOC.node_id = N.uuid
            LEFT JOIN Workspace_node_orders O ON O.ancestor = C2.ancestor AND O.node_id = C.descendant
            WHERE C.ancestor = :parentNodeId
            AND C.length = :depth
            ORDER BY C.length, O.order ASC;`, 
        { 
            replacements: { 
                parentNodeId: nodeId,
                depth: depth 
            }, 
            type: sequelize.QueryTypes.SELECT 
        });
    };

    Workspace_node.getChildrenOfType = function(nodeId, type) {

        return sequelize.query(
            `SELECT C.ancestor,
            C.descendant as id,
            C.length as depth,
            O.order, 
            C2.ancestor as parent_id,
            CONCAT( COALESCE(WS.title,''), '', COALESCE(SS.title,''), '', COALESCE(DOC.title,'') ) AS title,
            N.type
            FROM Workspace_nodes N
            LEFT JOIN Workspace_node_closures C ON C.descendant = N.uuid
            LEFT JOIN 
                ( SELECT Workspace_node_closures.* 
                    FROM Workspace_node_closures 
                    WHERE Workspace_node_closures.length = 1 AND Workspace_node_closures.ancestor IN (SELECT descendant FROM Workspace_node_closures WHERE ancestor = :parentNodeId)
                    ) C2 ON C2.descendant = C.descendant
            LEFT JOIN Workspaces WS ON WS.node_id = N.uuid
            LEFT JOIN Subspaces SS ON SS.node_id = N.uuid
            LEFT JOIN Documents DOC ON DOC.node_id = N.uuid
            LEFT JOIN Workspace_node_orders O ON O.ancestor = C2.ancestor AND O.node_id = C.descendant
            WHERE C.ancestor = :parentNodeId
            AND N.type = :type
            ORDER BY C.length, O.order ASC;`, 
        { 
            replacements: { 
                parentNodeId: nodeId,
                type: type 
            }, 
            type: sequelize.QueryTypes.SELECT 
        });
    };

    
    return Workspace_node;
};