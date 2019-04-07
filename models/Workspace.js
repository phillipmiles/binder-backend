'use strict';
module.exports = (sequelize, DataTypes) => {
    var Workspace = sequelize.define('Workspace', {
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
    Workspace.associate = function(models) {
        models.Workspace.belongsTo(models.Workspace_node, {
            foreignKey: 'node_id'
        });
    };
    return Workspace;
};