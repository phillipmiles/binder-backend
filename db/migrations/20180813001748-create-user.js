'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        
        return queryInterface.createTable('Users', {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            email: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING,
                validate: {
                    // TODO: Move validation into custom validation here instead of controller.
                    // Naaah. If its in controller we can prevent any preceeding DB requests
                    // that would be unneccessary earlier.
                    // custom validations are also possible:
                    // isSecurePassword(value) {
                    //     if (parseInt(value) % 2 != 0) {
                    //         throw new Error('Only even values are allowed!')
                    //         // we also are in the model's context here, so this.otherField
                    //         // would get the value of otherField if it existed
                    //     }
                    // }
                }
            },
            type: {
                allowNull: false,
                type: Sequelize.ENUM('basic', 'premium', 'admin'),
                defaultValue: 'basic'
            },
            // TODO: Is active the right term here for an account awaiting user confirmation
            // What if I want to disable accounts that have been confirmed for whatever reason?
            active: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
        return queryInterface.dropTable('Users');
    }
};