const session = require('express-session');
const Sequelize = require('sequelize')
const config = require('./../config/dbsessions.js')

// TODO: Move this out...?
const { dotenvError } = require("dotenv").config({ path: ".env.local" });

if (dotenvError) {
    throw dotenvError
}

const configEnv = config[process.env.NODE_ENV];

// initalize sequelize with session store
var SequelizeStore = require('connect-session-sequelize')(session.Store);

// create database, ensure 'sqlite3' in your package.json
// TODO: Should this merge with the other database?

// new Sequelize(config.database, config.username, config.password, config);

var sequelize = new Sequelize(
    configEnv.database,
    configEnv.username,
    configEnv.password, 
    configEnv
    // {
    //     "dialect": configEnv.dialect,
    //     "storage": "./session.mysql"    // TODO: WTF is this???
    // }
);


var sess = {
    secret: configEnv.secret,
    saveUninitialized: true,// TODO: What should this be.
    resave: true,          // TODO: What should this be.
    rolling: true,
    cookie: {
        httpOnly: true,
        maxAge: configEnv.cookieMaxAge
    }
}

var sessionStore = new SequelizeStore({
    db: sequelize
})

// TODO: NEED TO RENABLE THIS SOMEHOW. PREVENT COOKIES FROM GETTING RECIEVED BY THE FRONT-END
// if (process.env.NODE_ENV === 'production') {
//     sess.cookie.secure = true // serve secure cookies
// }

sess.store = sessionStore
// you want SequelizeStore to create/sync the database table for you, 
//you can call sync() against an instance of SequelizeStore - this will 
//run a sequelize sync() operation on the model for an initialized SequelizeStore object:
sessionStore.sync();


module.exports = session(sess);