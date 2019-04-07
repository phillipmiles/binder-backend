'use strict';
module.exports = (sequelize, DataTypes) => {
    var Workspace_node_closure = sequelize.define('Workspace_node_closure', {
        ancestor: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        descendant: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        length: DataTypes.INTEGER
    }, {});

    Workspace_node_closure.associate = function(models) {
        // associations can be defined here
        models.Workspace_node_closure.belongsTo(models.Workspace_node, {
            foreignKey: 'ancestor'
        });

        models.Workspace_node_closure.belongsTo(models.Workspace_node, {
            foreignKey: 'descendant'
        });
    };

    
    // Deletes all node paths for a node along with its children.
    Workspace_node_closure.deleteNodePathsWithChildren = function(nodeId, transaction) {
        var query = `DELETE a FROM Workspace_node_closures AS a
            JOIN Workspace_node_closures AS d ON a.descendant = d.descendant
            LEFT JOIN Workspace_node_closures AS x
            ON x.ancestor = d.ancestor AND x.descendant = a.ancestor
            WHERE d.ancestor = :nodeId AND x.ancestor IS NULL;`; 
        
        return sequelize.query(query, { 
            transaction: transaction,
            replacements: { 
                nodeId: nodeId
            }, 
            type: sequelize.QueryTypes.DELETE
        });
    }

    // Creates new node paths for a single explicit node (nodeId) set to become an immediant child to
    // the parent node (parentNodeId). This is intended for use on a freshly created node. DO NOT 
    // USE if nodeId has children. Use function 'addNodePathsWithChildren' instead.
    Workspace_node_closure.addNodePaths = function(nodeId, parentNodeId, transaction) {
        var query = `INSERT INTO Workspace_node_closures (ancestor, descendant, length) 
            SELECT ancestor, :nodeId, length + 1 
            FROM Workspace_node_closures
            WHERE descendant = :parentNodeId
            UNION ALL SELECT :nodeId, :nodeId, 0;`; 

        return sequelize.query(query, { 
            transaction: transaction,
            replacements: { 
                nodeId: nodeId,
                parentNodeId: parentNodeId
            }, 
            type: sequelize.QueryTypes.INSERT
        });
    }

    // Creates new node paths for a explicit node (nodeId) along with all of it's children (if any)
    // to the parent node (parentNodeId).
    Workspace_node_closure.addNodePathsWithChildren = function(nodeId, parentNodeId, transaction) {

        var query = `INSERT INTO Workspace_node_closures (ancestor, descendant, length)
            SELECT supertree.ancestor, subtree.descendant,
            supertree.length+subtree.length+1
            FROM Workspace_node_closures AS supertree JOIN Workspace_node_closures AS subtree
            WHERE subtree.ancestor = :nodeId
            AND supertree.descendant = :parentNodeId;`;

        return sequelize.query(query, { 
            transaction: transaction,
            replacements: { 
                nodeId: nodeId,
                parentNodeId: parentNodeId
            }, 
            type: sequelize.QueryTypes.INSERT
        });
    }


    // Returns all ancestors or parents of a particular node.
    Workspace_node_closure.getAncestorsOfNode = function(nodeId) {

        return sequelize.query(
            `SELECT *
            FROM Workspace_node_closures
            WHERE descendant = :nodeId;`, 
        { 
            replacements: { 
                nodeId: nodeId,
            }, 
            type: sequelize.QueryTypes.SELECT 
        });
    };

    // Returns all immediate ancestors or parents of a particular node.
    Workspace_node_closure.getImmediantAncestorsOfNode = function(nodeId) {

        return sequelize.query(
            `SELECT *
            FROM Workspace_node_closures
            WHERE descendant = :nodeId
            AND length = 1;`, 
        { 
            replacements: { 
                nodeId: nodeId,
            }, 
            type: sequelize.QueryTypes.SELECT 
        });
    };

    // Returns immediate ancestor or parent for a particular node.
    Workspace_node_closure.getUsersImmediantAncestorsOfNode = function(nodeId, userId) {

        return sequelize.query(
            `SELECT *
            FROM Workspace_node_closures C
            JOIN Workspace_node_accesses A ON A.node_id = C.ancestor
            WHERE C.descendant = :nodeId
            AND A.user_id = :userId
            AND C.length = 1;`, 
        { 
            replacements: { 
                nodeId: nodeId,
                userId: userId
            }, 
            type: sequelize.QueryTypes.SELECT 
        });
    };

    return Workspace_node_closure;
}