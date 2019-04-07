'use strict';
module.exports = (sequelize, DataTypes) => {
    var Workspace_node_order = sequelize.define('Workspace_node_order', {
        node_id: {
            type: DataTypes.UUID,
            unique: 'compositeIndex',
            primaryKey: true
        },
        ancestor: {
            type: DataTypes.UUID,
            unique: 'compositeIndex',
            primaryKey: true,
            allowNull: true,
        },
        order: DataTypes.INTEGER
    }, {});

    Workspace_node_order.associate = function(models) {
        // associations can be defined here
        models.Workspace_node_order.belongsTo(models.Workspace_node, {
            foreignKey: 'node_id'
        });

        models.Workspace_node_order.belongsTo(models.Workspace_node, {
            foreignKey: 'ancestor'
        });
    };

    Workspace_node_order.updateNodeChildOrder = function(nodeId, childNodeId, newIndex, transaction) {

        var newNodePos = (newIndex * 10) + 5;
        // Use model instance update for this???
        var query = `UPDATE Workspace_node_orders O
            SET O.order = :newNodePos
            WHERE O.ancestor = :nodeId
            AND O.node_id = :childNodeId
    
            AND ancestor = :nodeId 
            ORDER BY O.order ASC;`;

        return sequelize.query(query, { 
            transaction: transaction,
            replacements: { 
                nodeId: nodeId,
                childNodeId: childNodeId,
                newNodePos: newNodePos
            }, 
            type: sequelize.QueryTypes.UPDATE
        });
    }

    Workspace_node_order.updateNodeOrder = function(nodeId, oldParentId, parentId, order, transaction) {
        var query = `UPDATE Workspace_node_orders O
            SET O.order = :order, O.ancestor = :parentId
            WHERE O.node_id = :nodeId
            AND O.ancestor = :oldParentId`;

        return sequelize.query(query, { 
            transaction: transaction,
            replacements: { 
                nodeId: nodeId,
                oldParentId: oldParentId,
                parentId: parentId,
                order: order
            }, 
            type: sequelize.QueryTypes.UPDATE
        });
    }

    Workspace_node_order.refreshNodeChildrenOrder = function(nodeId, transaction) {
        // Removed n.node_content_type != ? AND from subquery as we wont have,
        // any child workspaces. All workspaces should be a root level already.
        var query = `UPDATE Workspace_node_orders O
            SET O.order = (@new_ordering := @new_ordering + 10) 
            WHERE O.node_id IN ( 
                SELECT OO.node_id 
                FROM Workspace_nodes N 
                    LEFT JOIN Workspace_node_accesses A ON N.uuid = A.node_id 
                    RIGHT JOIN Workspace_node_closures C ON N.uuid = C.descendant 
                    LEFT JOIN (SELECT * FROM Workspace_node_orders) OO ON N.uuid = OO.node_id 
                WHERE C.ancestor = :nodeId 
                ORDER BY OO.order 
            ) 
            AND ancestor = :nodeId 
            ORDER BY O.order ASC;`;

        // HARD CODDED SET VARIABLE INTO QUERY AS SETTING IT PRIOR WASN'T WORKING
        // Reset user sessions order variables.
        // return sequelize.query('SET @ordering_inc = 10;', { 
        //     transaction: transaction })
        // .then(() => {
            return sequelize.query('SET @new_ordering = 0;', { 
                transaction: transaction })
            .then(() => {
                // Rerun the setting ordering indexes.
                return sequelize.query(query, { 
                    transaction: transaction,
                    replacements: { nodeId: nodeId }, 
                    type: sequelize.QueryTypes.UPDATE
                });
            });
        // });
    }

    return Workspace_node_order;
};