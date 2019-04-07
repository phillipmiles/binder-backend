'use strict';
module.exports = (sequelize, DataTypes) => {

    var Document = sequelize.define('Document', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: DataTypes.STRING,
        lastEdited: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        node_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {});
    

    Document.associate = function(models) {
        // associations can be defined here
        models.Document.belongsTo(models.Workspace_node, {
            foreignKey: 'node_id'
        });
    };
    return Document;
};