'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Workspace_node_closures', {
            ancestor: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: 'Workspace_nodes',
                    key: 'uuid'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            descendant: {
                type: Sequelize.UUID,
                primaryKey: true,
                references: {
                    model: 'Workspace_nodes',
                    key: 'uuid'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            length: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Workspace_node_closures');
    }
};