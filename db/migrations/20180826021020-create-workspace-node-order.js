'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Workspace_node_orders', {
            node_id: {
                type: Sequelize.UUID,
                unique: 'compositeIndex',
                allowNull: false,
                references: {
                    model: 'Workspace_nodes',
                    key: 'uuid'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            ancestor: {
                type: Sequelize.UUID,
                unique: 'compositeIndex',
                allowNull: true,
                references: {
                    model: 'Workspace_nodes',
                    key: 'uuid'
                },
                onUpdate: 'cascade',
                onDelete: 'cascade'
            },
            order: {
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
        })
        // .then(() => {
        //     return queryInterface.sequelize.query('ALTER TABLE "Workspace_node_orders" ADD CONSTRAINT "username" PRIMARY KEY ("firstName", "lastName")');
        // });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Workspace_node_orders');
    }
};