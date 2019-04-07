// const fs = require('fs');
const dotenv = require("dotenv");
const { dotenvError } = dotenv.config({ path: ".env.local" });

module.exports = {
    development: {
        username: process.env.DB_APP_DEV_USERNAME,
        password: process.env.DB_APP_DEV_PASSWORD,
        database: process.env.DB_APP_DEV_DATABASE,
        host: process.env.DB_APP_DEV_HOST,
        logging: false,
        dialect: 'mysql'
    },
    test: {
        username: 'database_test',
        password: null,
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql'
    },
    production: {
        username: process.env.DB_APP_PROD_USERNAME,
        password: process.env.DB_APP_PROD_PASSWORD,
        database: process.env.DB_APP_PROD_DATABASE,
        host: process.env.DB_APP_PROD_HOST,
        logging: false,
        dialect: 'mysql',
        // dialectOptions: {
        //     ssl: {
        //         ca: fs.readFileSync(__dirname + '/mysql-ca-master.crt')
        //     }
        // }
    }  
};