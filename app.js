// server/app.js

// Dependencies
// ============

const express = require("express");
const http = require('http');
const https = require('https')
const router = express.Router();
const fs = require('fs')
const cors = require('cors')
const helmet = require('helmet')

const dotenv = require("dotenv");

// const cloudinary = require('cloudinary')

const passport = require('passport');
const sessions = require('./services/sessions.js');

const websocket = require('./services/websocket/index.js');

// Body-parser not recommended https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters
// const bodyParser = require('body-parser')  


// .ENV Setup
// ==========
const { dotenvError } = dotenv.config({ path: ".env.local" });

if (dotenvError) {
    throw dotenvError
}





const routes = require('./routes/')
const models = require('./models');


// Start new express app
const app = express();



// ISSUES / VERSION CONTROL
// MAYBE!!! Consider this untested... sequalise has issue with mysql v 5.7 when it comes to generating UUIDs as a default value.

// Resetting password
// ==================
// Stop mysql server
// sudo /usr/local/mysql/support-files/mysql.server stop
// Enter LAPTOP password - not DB - this is sudo shit

// Start mysql server in safe mode
// sudo /usr/local/mysql/bin/mysqld_safe --skip-grant-tables

// In new terminal window run the following lines
// sudo /usr/local/mysql/bin/mysql -u root
// UPDATE mysql.user SET authentication_string=PASSWORD('NewPassword') WHERE User='root';
// FLUSH PRIVILEGES;
// \q

// Stop mysql server
// sudo /usr/local/mysql/support-files/mysql.server stop

// Start mysql server
// sudo /usr/local/mysql/support-files/mysql.server start

// AND (for expired password resetting)
// ---
// (While mysql server is running)
// mysql -u root -p
// Enter 'NewPassword' when prompted.
// SET PASSWORD = PASSWORD('xxxxxxxx');


// MIGRATIONS
// ==========

// To migrate all
// node_modules/.bin/sequelize db:migrate

// To undo a single migration.
// node_modules/.bin/sequelize db:migrate:undo

/** configure cloudinary */
// cloudinary.config({
//     cloud_name: 'process.env.CLOUDINARY_NAME',
//     api_key: 'process.env.CLOUDINARY_KEY',
//     api_secret: 'process.env.CLOUDINARY_SECRET'
// })

models.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
});
  


app.set('port', process.env.PORT_APP || 3000);

// Middlewares
// ===========

// Security
// app.use(cors({ origin: process.env.ORIGIN_FRONTEND }))

app.use(cors({ 
    origin: 'http://binder-frontend.s3-website-ap-southeast-2.amazonaws.com',
    // orgin: '*',
    credentials: true // Allows front end to send/recieve cookie credentials on subsequent api calls
}))

app.use(helmet())


// //app.use('/static',express.static(path.join(__dirname,'static')))
app.use(express.static("public"));

app.use(express.json({ extended: true }));       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

// if (process.env.NODE_ENV === 'production') {
//     app.set('trust proxy', 1) // trust first proxy
// }

app.use(sessions);

// Passport
// ========
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');


/* Define routes {API Endpoints} */
routes(router)
app.use('/api', router) // Difference between localhost:5000/api/articles and...
// app.use(router) // ... localhost:5000/articles

// TODO: Will I need this in production???
//https://egghead.io/lessons/javascript-redux-filtering-redux-state-with-react-router-params
// app.get('/*', (req, res) => {
//     // console.log('file', sendFile(path.join__dirname, 'index.html'));
//     res.sendFile(path.join__dirname, 'index.html')
// });

const User_activation = require('./services/token_user_activation.js').init();




// TODO: Sooo redis yea...?
// var redis = require('redis')
// var client = redis.createClient()

// client.on('error', function (err) {
//     console.log('Error ' + err)
// })

// client.set('string key', 'string val', redis.print)
// client.hset('hash key', 'hashtest 1', 'some value', redis.print)
// client.hset(['hash key', 'hashtest 2', 'some other value'], redis.print)

// client.hkeys('hash key', function (err, replies) {
//     console.log(replies.length + ' replies:')

//     replies.forEach(function (reply, i) {
//         console.log('    ' + i + ': ' + reply)
//     })

//     client.quit()
// })




















// Error handlers.
// Replacing Express's default error handling error.toString() with the below. Needs to sit under routes.
// Can have multiple error handlers. Just use more next().
app.use(function(err, req, res, next) {
    // If headers are already set, (ie error occurs while streaming response), defer
    // handling to express's default error handler.
    if (res.headersSent) {
        return next(err)
    }
    next(err);
});

// Development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {

        res.status(err.code || 500)

        // Send response.
        res.json({ 
            status: 'error',
            code: err.code || 500,
            message: err.message,
            error: err.stack
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.code || 500)
    
    // Send response.
    res.json({ 
        status: 'error',
        code: err.code || 500,
        message: err.message ,
        error: {}
    });
});




// Start server
// ============
// Needs to be https for running secure websocket from clientside.
// if (app.get('env') === 'development') {
    var server = http.createServer(app)
// } else {
//     // TODO: Route all http requests to https. https://contextneutral.com/story/creating-an-https-server-with-nodejs-and-express

//     var server = https.createServer({
//         key: fs.readFileSync('server.key'),
//         cert: fs.readFileSync('server.cert')
//     }, app);
// }

// Setup websocket
websocket(server);

server.listen(app.get('port'), () => {
    console.log('Server started at port: ' + app.get('port'));
});

