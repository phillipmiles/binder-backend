

// const mongodb = require('mongodb');
var ShareDB = require('sharedb');
var models  = require('../models');
ShareDB.types.register(require('rich-text').type);
// Redis client being an existing redis client connection
// TODO: REDIS PUB SUB!
// var redisPubsub = require('sharedb-redis-pubsub')(redisClient); 
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/dbshare.js')[env];
var tokenStore  = require('../services/token_store.js');


const dbUrl = config.host + ':' + config.port + '/' + config.database;


// TODO: Neeed a clean shut down/error message for a missing mongo DB.
// const db = require('sharedb-mongo')({mongo: function(callback) {
//     mongodb.connect(dbUrl, { useNewUrlParser: true }, callback);
// }});

const db = require('sharedb-mongo')(dbUrl);

// const db = sharedbMongo('mongodb://b-admin:DMrMRZj0CPiHwSaR@binder-cluster0-shard-00-00-b4vb9.mongodb.net:27017,binder-cluster0-shard-00-01-b4vb9.mongodb.net:27017,binder-cluster0-shard-00-02-b4vb9.mongodb.net:27017/test?ssl=true&replicaSet=Binder-Cluster0-shard-0&authSource=admin');
// console.log(db);
// var backend = new ShareDB();
// var backend = ShareDB({db});


// var COLLECTION_NAME = 'examples';
// var SPACE_COLLECTION = 'subspaces';
// var connection = backend.connect();




const shareBackend = new ShareDB({
    db: db,
    disableDocAction: true,             // docAction is depreciated
    disableSpaceDelimitedActions: true  // spaceDelimited is depreciated
    // pubsub: redisPubsub
});

const guard = function (req, callback) {
    console.log('=== receive', req.data);
    // TODO: Catch errors from websocket. If data isn't an object, server crashes!!!
    // TODO: Is saving an auth to true on the request safe!?
    // TODO: Have a refreshing token that checks on a a seconds timeout to see
    // if your still aloud to be connected. This token would have to be stored in redis
    // when a user changes your access permissions this token would be removed from the
    // server.
    // TODO: How do we determine each module.
    // TODO: Store the auth token on creation in redis with a uuid as its 'key' to relocate it.
    // otherwise someone could simply create a token and sign it if thry now your token
    // secret. Not sure if this is necessary but it seems right. Otherwise look at the
    // JWT hashing options to beef up its secuirty maybe.
    if(req.data.type === 'authToken') {
        // authenticate
        const token = req.data.token;

        if (token) {

            var decodedToken = tokenStore.verify(token);
            // verifies secret and checks exp
            if(decodedToken) {
                console.log('TOKEN PASSED!!!');
                req.agent.auth = {
                    userId: decodedToken.userId
                };
                req.agent.accessToDocs = {};
                // console.log(req.agent.stream.ws);
                req.agent.stream.ws.send('{"type": "authState", "state": true}')
            } else {
                console.log('TOKEN FAILED!!! kill websocket');
                // shareBackend.close(callback);    // This kills shareBackend for everyone.
            }
        }

        // For refreshing token.
        // if((req.data.refreshToken) && (req.data.refreshToken in tokenStore.tokens)) {
        //     console.log('We had a token!!!');
        //     req.agent.auth = true;
        // } else {
        //     console.log('DIEEEE!', req.data, tokenStore.tokens);
        // }

    } else if(!req.agent.auth === true) {
        console.log('WARNING: Server recieved a message from an unauthorised user that was not an authorisation request.');
        req.agent.stream.ws.send('{"type": "authState", "state": false, "message": "Failed to authenticate weboscket."}')
        return;
    } else {
        callback();
    }
}

async function checkUserAccessToDocument(userId, docId) {
    return await models.Workspace_node.findById(docId, {
        include: [{
            model: models.Workspace_node_access,
            as: 'Accesses',
            where: { user_id: userId },
        }]
    });
}

module.exports = (server) => {

    var WebSocket = require('ws');
    var wss = new WebSocket.Server({server: server});
    const WebSocketJSONStream = require('@teamwork/websocket-json-stream')

    // 'ws' is a websocket server connection, as passed into
    // new (require('ws').Server).on('connection', ...)

    // This one doesn't work. Need to the be on the stream???
    // wss.onmessage = function (event) {
    //     console.log('data', event.data);
    // }


    wss.on('connection', function(ws, req) {

        var stream = new WebSocketJSONStream(ws);

        // Catches errors like non JSON being sent through websocket and returns error
        // back down the agent's stream.
        stream.on('error', err => {
            stream.ws.send('{"type": "error", "message": "' + err.message + '"}')
        })
        
        shareBackend.listen(stream);
    });

    shareBackend.use('receive', guard);

    // TODO: I should move docAuthentication outside of the recieve middleware into a new package type like incoming
    // authState. Reason being is that I want to be able to check the database for changes in the users read/write permissions
    // everytime a user tries to subscribe to a doc without having to also check the database for every single
    // operation.
    shareBackend.use('receive', function(req, callback) {
        console.log('=== receive', req);
        if(req.agent.accessToDocs[req.data.d]) {
            console.log('Found already authenticated doc, proceed with recieved request.');
            callback();
        } else {
            console.log('Check DB do access to document', req.data.d);
            

            // Fetch node.
            // TODO: Should doc ids be based off of Node or containing Doc iD. Probably containing doc id yea?
            checkUserAccessToDocument(req.agent.auth.userId, req.data.d)
            .then((result) => {
                if(result) {
                    req.agent.accessToDocs[req.data.d] = 'write';
                    callback();
                } else {
                    throw Error();
                }
            }).catch(function (err) {
                console.log('WARNING: Server recieved a message from user attempting access on an unauthorised document.');
                req.agent.stream.ws.send('{"type": "docAuthState", "state": false, "docId": "' + req.data.d + '", "message": "Failed to authenticate document access."}');
            })
        }
    });

    // TODO: CHeck that we are catching unauthorised DELETE requests.

    shareBackend.use('op', function(req, callback) {
        console.log('=== op', req);
        callback();
    });

    shareBackend.use('readSnapshots', function(req, callback) {
        console.log('=== readSnapshots', req);
        callback();
    });

    shareBackend.use('query', function(req, callback) {
        console.log('=== query', req);
        callback();
    });

    shareBackend.use('submit', function(req, callback) {
        console.log('=== submit', req);
        if(req.agent.accessToDocs[req.id] !== 'write') {
            console.log('WARNING: Server recieved a op submission from a user attempting access on an unauthorised document.');
            req.agent.stream.ws.send('{"type": "error", "message": "Access to document denied." }')
            return
        }
        callback();
    });

    shareBackend.use('apply', function(req, callback) {
        console.log('=== apply', req);
        callback();
    });

    shareBackend.use('commit', function(req, callback) {
        console.log('=== commit', req);
        callback();
    });

    shareBackend.use('afterSubmit', function(req, callback) {
        console.log('=== afterSubmit', req);
        callback();
    });

    shareBackend.use('connect', function(req, callback) {
        console.log('=== connect', req);
        callback();
    });
}