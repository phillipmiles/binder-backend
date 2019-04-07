'use strict';
module.exports = (sequelize, DataTypes) => {
    var User_activation = sequelize.define('User_activation', {
        token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
        },
        expires: {
            type: DataTypes.DATE,
        }          
    }, {});

    User_activation.associate = function(models) {
        models.User.belongsTo(models.User, {
            foreignKey: 'uuid'
        });
    };

    
    // User_activation.getNodes = function() {
        
    // };

    
    return User_activation;
};