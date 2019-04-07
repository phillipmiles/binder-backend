// const fs = require('fs');
const dotenv = require("dotenv");
const { dotenvError } = dotenv.config({ path: ".env.local" });

module.exports = {
    development: {
        username: process.env.DB_SHARE_DEV_USERNAME,
        password: process.env.DB_SHARE_DEV_PASSWORD,
        database: process.env.DB_SHARE_DEV_DATABASE,
        host: process.env.DB_SHARE_DEV_HOST,
        port: process.env.DB_SHARE_DEV_PORT,
        srv: false,
        dialect: 'mongo'
    },
    production: {
        username: process.env.DB_SHARE_PROD_USERNAME,
        password: process.env.DB_SHARE_PROD_PASSWORD,
        database: process.env.DB_SHARE_PROD_DATABASE,
        host: process.env.DB_SHARE_PROD_HOST,
        port: process.env.DB_SHARE_PROD_PORT,
        srv: true,
        dialect: 'mongo'
    },

    // production: {
    //     username: process.env.DB_USERNAME,
    //     password: process.env.DB_PASSWORD,
    //     database: process.env.DB_NAME,
    //     host: process.env.DB_HOSTNAME,
    //     dialect: 'mysql',
        // dialectOptions: {
        //     ssl: {
        //         ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
        //     }
        // }
    // }
    
};