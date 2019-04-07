const dotenv = require("dotenv");
const { dotenvError } = dotenv.config({ path: ".env.local" });

module.exports = {
    development: {
        secret: process.env.DB_SESSIONS_DEV_SECRET,
        username: process.env.DB_SESSIONS_DEV_USERNAME,
        password: process.env.DB_SESSIONS_DEV_PASSWORD,
        database: process.env.DB_SESSIONS_DEV_DATABASE,
        host: process.env.DB_SESSIONS_DEV_HOST,
        dialect: 'mysql',
        cookieMaxAge: (60 * 60 * 1000), // 1 hour (is in milliseconds)
        // cookieMaxAge: (60 * 60 * 1000) // 1 hour (is in milliseconds)
        logging: false
    },
    production: {
        secret: process.env.DB_SESSIONS_PROD_SECRET,
        username: process.env.DB_SESSIONS_PROD_USERNAME,
        password: process.env.DB_SESSIONS_PROD_PASSWORD,
        database: process.env.DB_SESSIONS_PROD_DATABASE,
        host: process.env.DB_SESSIONS_PROD_HOST,
        dialect: 'mysql',
        cookieMaxAge: (60 * 60 * 1000), // 1 hour (is in milliseconds)
        logging: false
    }
};