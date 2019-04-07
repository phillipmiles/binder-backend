'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);

// const dotenv = require("dotenv");
// const { dotenvError } = dotenv.config({ path: ".env.local" });

var env       = process.env.NODE_ENV || 'development';

var config    = require(__dirname + '/../config/dbapp.js')[env];
// console.log('LOOK', process.env.NODE_ENV, config);
// var config    = require(__dirname + '/../config/config.js');
// var db_config = config.databaseApp(env);
var db        = {};

if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
.readdirSync(__dirname)
.filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
.forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
    // console.log('model', model.name)

    // if(model.name == 'User') {
    //     console.log('okay', model.findByEmail('email'))
    // }
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// sequelize.sync(); // Handle this with migrations.

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;