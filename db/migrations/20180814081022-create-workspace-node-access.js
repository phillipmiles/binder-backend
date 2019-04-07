'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Workspace_node_accesses', {
            user_id: {
                primaryKey: true,
                type: Sequelize.UUID,
                references: {
                    model: 'Users',
                    key: 'uuid'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            node_id: {
                primaryKey: true,
                type: Sequelize.UUID,
                references: {
                    model: 'Workspace_nodes',
                    key: 'uuid'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            type: {
                allowNull: false,
                type: Sequelize.ENUM('read', 'write')
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM('active', 'pending', 'binned'),
                defaultValue: 'active'
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
        return queryInterface.dropTable('Workspace_node_accesses');
    }
};