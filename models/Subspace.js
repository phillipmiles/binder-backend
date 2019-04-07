'use strict';
module.exports = (sequelize, DataTypes) => {
    
    var Subspace = sequelize.define('Subspace', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: DataTypes.STRING,
        node_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {});

    Subspace.associate = function(models) {
        models.Subspace.belongsTo(models.Workspace_node, {
            foreignKey: 'node_id'
        });
    };
    return Subspace;
};