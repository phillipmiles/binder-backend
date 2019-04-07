'use strict';
var models  = require('../models');

module.exports = (sequelize, DataTypes) => {
    var Workspace_node_access = sequelize.define('Workspace_node_access', {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        node_id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        type: {
            type: DataTypes.ENUM('read', 'write'),      // this holds permissions - protect this
            defaultValue: 'read'
        },
        status: {
            type: DataTypes.ENUM('active', 'pending', 'binned'),  // this holds status - user has control over this
            defaultValue: 'active'
        }
        
    }, {});
    
    Workspace_node_access.associate = function(models) {
        // associations can be defined here
        models.Workspace_node_access.belongsTo(models.Workspace_node, {
            as: 'Nodes',
            foreignKey: 'node_id'
        });

        models.Workspace_node_access.belongsTo(models.User, {
            foreignKey: 'user_id'
        });
    };


    Workspace_node_access.getUserAccessToNode = function(userId, nodeId) {
        return Workspace_node_access.findOne({
            where: {
                user_id: userId, 
                node_id: nodeId
            },
        });
    };

    // 23/01/19 - Update's a specific user's access level status to a specific node and all of it's children.
    Workspace_node_access.updateUserAccessStatusToNodeWithChildren = function(userId, nodeId, newStatus, transaction) {

        const query = `UPDATE Workspace_node_accesses
            SET status = :newStatus
            WHERE node_id IN
            (
                SELECT n.uuid
                FROM Workspace_nodes n
                JOIN Workspace_node_closures c ON n.uuid = c.descendant
                WHERE c.ancestor = :nodeId
            )
            AND user_id = :userId;`;

        return sequelize.query(query, { 
            transaction: transaction,
            model: models.Workspace_node_access,
            replacements: { 
                nodeId: nodeId,
                newStatus: newStatus,
                userId: userId
            }, 
            type: sequelize.QueryTypes.UPDATE
        });
    }
    
    Workspace_node_access.addUserAccessToNodeWithChildren = function(userId, nodeId, parentNodeId, type, status, transaction) {

        // TODO: Change to only try to add accesses where accessess don't already exist
        // rather then lean on the INSERT IGNORE to not add duplicate rows with primary
        // keys and siliently squashing ALL errors.
        var query = `INSERT IGNORE INTO Workspace_node_accesses (node_id, user_id, type, status)
            SELECT n.uuid as node_id, a.user_id, :type, :status
            FROM ( SELECT user_id
                    FROM Workspace_node_accesses
                    WHERE node_id = :parentNodeId) a
            JOIN (SELECT n.uuid
                    FROM Workspace_nodes n
                    JOIN Workspace_node_closures c ON n.uuid = c.descendant
                    WHERE c.ancestor = :nodeId) n`;

        // TODO: If simply adding SELECT type back into the first FROM doesn't work, maybe 
        // a JOIN ON to allow for getting correct user access level for each user.
        
        return sequelize.query(query, { 
            transaction: transaction,
            model: models.Workspace_node_access,
            replacements: { 
                nodeId: nodeId,
                parentNodeId: parentNodeId,
                userId: userId,
                type: type,
                status: status
            }, 
            type: sequelize.QueryTypes.INSERT
        });
    };


    Workspace_node_access.deleteUserAccessToNodeWithChildren = function(userId, nodeId) {

        var query = `DELETE FROM Workspace_node_accesses
            WHERE Workspace_node_id IN
            (
                SELECT n.id
                FROM Workspace_nodes n
                JOIN Workspace_nodes_closures c ON n.id = c.descendant
                WHERE c.ancestor = ?
            )
            AND user_id NOT IN 
            (
                SELECT * 
                FROM (SELECT user_id
                    FROM Workspace_node_accesses
                    WHERE Workspace_node_id = ?) as t
            );`;


        return sequelize.query(query, { 
            transaction: transaction,
            replacements: { 
                nodeId: nodeId,
                userId: userId
            }, 
            type: sequelize.QueryTypes.DELETE
        });
    }

    // getUsersWithoutAcceessToNode
    // Return users

    // Check you have permission to share moving node.


    return Workspace_node_access;
};