// services/websocket/index.js

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/dbshare.js')[env];
const shareDBInterface = require('./shareDBInterface.js');
var WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream')
// TODO: REDIS PUB SUB!
// var redisPubsub = require('sharedb-redis-pubsub')(redisClient); 

module.exports = (server) => {

    // var wss = new WebSocket.Server({server: server});
    var wss = new WebSocket.Server({port: process.env.PORT_WS});

    // TODO: Sharding?
    var shareDBUrl = '';
    shareDBUrl += config.srv ? 'mongodb+srv://' : 'mongodb://';
    shareDBUrl += (config.username && config.password) ? config.username + ':' + config.password + '@' : '';
    shareDBUrl += config.host;
    shareDBUrl += config.srv ? '' : ':' + config.port;
    shareDBUrl += '/' + config.database;

    shareDBUrl = 'mongodb://binder-mongo-read-write:lzVwHGX9ulpc5uX1@cluster0-shard-00-00-mheww.mongodb.net:27017,cluster0-shard-00-01-mheww.mongodb.net:27017,cluster0-shard-00-02-mheww.mongodb.net:27017/binder?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin';

    // // const mongoDbUrl = `mongodb://${config.username}:${config.password}@cluster0-shard-00-00-mheww.mongodb.net:27017,cluster0-shard-00-01-mheww.mongodb.net:27017,cluster0-shard-00-02-mheww.mongodb.net:27017/binder?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`;
    // const mongoDbUrl = 'mongodb://binder-mongo-read-write:lzVwHGX9ulpc5uX1@cluster0-shard-00-00-mheww.mongodb.net:27017,cluster0-shard-00-01-mheww.mongodb.net:27017,cluster0-shard-00-02-mheww.mongodb.net:27017/binder?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
    // 'mongodb+srv://binder-mongo-read-write:lzVwHGX9ulpc5uX1@cluster0-mheww.mongodb.net/binder?retryWrites=true'
    // // console.log('shareDBUrl');

    // shareDBUrl = 'mongodb://binder-mongo-read-write:lzVwHGX9ulpc5uX1@cluster0-shard-00-00-mheww.mongodb.net:27017,cluster0-shard-00-01-mheww.mongodb.net:27017,cluster0-shard-00-02-mheww.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

    
    // const MongoClient = require(‘mongodb’).MongoClient;
    
    // const uri = "mongodb+srv://binder-mongo-read-write:<password>@cluster0-mheww.mongodb.net/test?retryWrites=true";
    // const client = new MongoClient(uri, { useNewUrlParser: true });
    // client.connect(err => {
    // const collection = client.db("test").collection("devices");
    // // perform actions on the collection object
    // client.close();
    // });
    
    const shareBackend = shareDBInterface(shareDBUrl);

    wss.on('connection', function(ws, req) {

        var stream = new WebSocketJSONStream(ws);

        // Catches errors like non JSON being sent through websocket and returns error
        // back down the agent's stream.
        stream.on('error', err => {
            console.log('\n PHIL ERROR', err.name, err);
            // console.log('\n stream::', stream)
            // console.log('\n ws::', ws)
            console.log('\n req::', req)
            // TODO: If the error is [ERR_STREAM_DESTROYED]: Cannot call write after a stream was destroyed - then we can't
            // send an error message down the websocket else we got a critical error.
            // stream.ws.send('{"type": "error", "message": "' + err.message + '"}')
        })

        stream.on('data', data => {
            // console.log('serverStream data', data)
            console.log('serverStream data')
        })
        stream.on('end', () => {
            console.log('serverStream end')
        })
        stream.on('close', () => {
            console.log('serverStream close')
        })
        
        shareBackend.listen(stream);
    });

    // wss.on('message', function incoming(data) {
    //     console.log('\nw s message:', data);
    // });

    // wss.on('close', function close() {
    //     console.log('\n disconnected');
    // });

    // wss.on('error', function error() {
    //     console.log('\n error');
    // });
}