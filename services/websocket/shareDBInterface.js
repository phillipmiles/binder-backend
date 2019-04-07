const ShareDB = require('sharedb');
const tokenStore  = require('../token_store.js');
const models = require('../../models');


// Closes the websocket stream for the passed in request.
function closeStream(req) {
    req.agent.stream.ws.close();        // TODO: Does this instead kill for just the one stream???
}

// Converts and javascript object into json and sends it through the websocket.
function sendData(req, dataObj) {
    const jsonData = JSON.stringify(dataObj);
    req.agent.stream.ws.send(jsonData)
}

// Searched DB for user access to a document.
// async function fetchUserAccessToDocument(userId, docId) {
function fetchUserAccessToDocument(userId, docId) {
    return models.Document.findById(docId, {
        include: [{
            model: models.Workspace_node,
            as: 'Workspace_node',
            include: [{
                model: models.Workspace_node_access,
                as: 'Accesses',
                where: { user_id: userId },
            }]
        }]
    });
}

function updateDocLastEdit(docId, lastEdited) {
    return models.Document.findById(docId, {})
        .then((result) => {
            // console.log('resultting??', result);
            result.update({
                lastEdited: lastEdited
            })
        });
}

// TODO: I should move docAuthentication outside of the recieve middleware into a new package type like incoming
// authState. Reason being is that I want to be able to check the database for changes in the users read/write permissions
// everytime a user tries to subscribe to a doc without having to also check the database for every single
// operation.
function checkUserAccessToDocument(req, callback) {
    console.log('checkUserAccessToDocument')
    const agent = req.agent;
    const docId = req.data.d;

    // Look for user's access level to document
    if(agent.accessToDocs[docId]) {
        callback();
    } else {
        // Check DB and set agent's access level to document.
        // TODO: Should doc ids be based off of Node or containing Doc iD. Probably containing doc id yea?
        fetchUserAccessToDocument(agent.auth.userId, docId)
        .then((result) => {
            // console.log('OUR RESULT', result, docId);
            var access = result.Workspace_node.Accesses ? result.Workspace_node.Accesses[0] : null;

            if(!access) {
                throw Error('No access record found.');
            }

            if(access && access.status !== 'active') {
                throw Error('Access status to document is not active.');
            } else if(access) {
                agent.accessToDocs[docId] = access.type;  
                callback();
            } else {
                throw Error();
            }
        }).catch(function (err) {
            sendData(req, {
                type: "docAuthState", 
                state: false, 
                docId: docId,
                message: "Failed to authenticate document access. " + err.message
            });
        })
    }
}

// Checks to see if user is authenticated and attempts to autenticate with
// an expected token if not.
function checkUserAuthentication(req, callback) {
    console.log('checkUserAuthentication')
    if(req.data.type === 'authToken') {
        // authenticate user
        authenticateStream(req, req.data.token);
    } else if(!req.agent.auth || !req.agent.auth.authenticated) {
        sendData(req, {
            type: "authState",
            state: false,
            message: "Failed to authenticate websocket."
        });
        console.log('FIX ME: Failed to authenticate websocket.')
        closeStream(req);
    } else {
        callback();
    }
}

// Authenticates the request's webosocket stream using a token.
function authenticateStream(req, token) {
    // TODO: Have a refreshing token that checks on a a seconds timeout to see
    // if your still aloud to be connected. This token would have to be stored in redis
    // when a user changes your access permissions this token would be removed from the
    // server.
    // TODO: How do we determine each module.
    // TODO: Store the auth token on creation in redis with a uuid as its 'key' to relocate it.
    // otherwise someone could simply create a token and sign it if thry now your token
    // secret. Not sure if this is necessary but it seems right. Otherwise look at the
    // JWT hashing options to beef up its secuirty maybe.
    if (token) {
        // verifies secret and checks exp
        var decodedToken = tokenStore.verify(token);
        
        // If decodedToken then token was valid.
        if(decodedToken) {
            req.agent.auth = {
                userId: decodedToken.userId,
                authenticated: true
            };
            req.agent.accessToDocs = {};
            sendData(req, {
                type: "authState", 
                state: true
            });
            return true;
        } else {
            // 'TOKEN FAILED!!! kill websocket'
            console.log('FIX ME: TOKEN FAILED!!! kill websocket')
            closeStream(req);
        }
    }

    return false;

    // For refreshing token.
    // if((req.data.refreshToken) && (req.data.refreshToken in tokenStore.tokens)) {
    //     console.log('We had a token!!!');
    //     req.agent.auth = true;
    // } else {
    //     console.log('DIEEEE!', req.data, tokenStore.tokens);
    // }

}


// Order of middleware
// -- New user connects to websocket
// 1. connect
// -- Open and read document
// 2. recieve
// 3. readSnapshots
// -- Write to document
// 4. recieve
// 5. submit SubmitRequest
// 6. apply SubmitRequest
// 7. commit SubmitRequest
// 8. after SubmitRequest
// 9. op
// -- Delete document
// ???

function setMiddleware(shareBackend) {

    // > USER AUTHENTICATION
    // Only calls callback if user is authenticated and data type isn't of type 
    // 'authToken'. Closes stream if user not authenticated. 
    shareBackend.use('receive', checkUserAuthentication);

    // > DOC ACCESS
    // Looks at all incoming 'receive' messages. Only calls callback if user has access.
    shareBackend.use('receive', checkUserAccessToDocument);


    shareBackend.use('receive', function(req, callback) {
        // TODO: NEED TO CATCH CREATE REQUESTS AND CHECK USE HAS ACCESS TO THAT DOC ID!!!!
        // console.log('=== receive', req);
        console.log('=== receive', req.data);
        console.log('\n', req.data.op);
        callback();
    });
    

    // TODO: Server should be destorying subscriptions to docs if the client 
    // fails to destroy them.
    // TODO: CHeck that we are catching unauthorised DELETE requests.
    // TODO: Check that we aren't allowing documents to be created willy nilly.
    // TODO: If i remove the call back op seems to be called multiple times after page reload with
    // the same operation. Perhaps operation conflicts are causing the issue.
    // Are we not cloasing the webksocket between refreshes?
    shareBackend.use('op', function(req, callback) {
        // console.log('=== op', req);
        console.log('=== op', req.op);
        console.log('\n', req.op.op);
        // console.log('\n', req);
        // sendData(req, {
        //     type: "replacement op", 
        //     state: true
        // });
        callback();
    });

    shareBackend.use('readSnapshots', function(req, callback) {
        // console.log('=== readSnapshots', req);
        console.log('=== readSnapshots');
        callback();
    });

    shareBackend.use('query', function(req, callback) {
        // console.log('=== query', req);
        console.log('=== query');
        callback();
    });

    // > DOC EDIT PERMISSION
    // Checks that a user has the 'write' permission before editing the document.
    shareBackend.use('submit', function(req, callback) {
        // console.log('=== submit', req);
        console.log('=== submit');
        if(req.agent.accessToDocs[req.id] !== 'write') {
            sendData(req, {
                type: "error", 
                docId: req.id,
                message: "Missing write access to document."
            });
            return
        }

        callback();
    });

    shareBackend.use('apply', function(req, callback) {
        // console.log('=== apply', req);
        console.log('=== apply');
        callback();
    });

    shareBackend.use('commit', function(req, callback) {
        // console.log('=== commit', req);
        console.log('=== commit');
        callback();
    });

    shareBackend.use('afterSubmit', function(req, callback) {
        // console.log('=== afterSubmit', req);
        console.log('=== afterSubmit');

        const now = new Date();
        req.agent.lastEdit = now.getTime();

        // TODO: Shift the save interval value into some configuration location. 60000 = 1 minute
        // Updates documents last edited value on an interval.
        if(!req.agent.lastSavedEdit || req.agent.lastSavedEdit + 60000 < req.agent.lastEdit ) {
            console.log('=== save ===');
            
            const docId = req.id;
            req.agent.lastSavedEdit = now.getTime();

            updateDocLastEdit(docId, now.toISOString())
            .catch(function (err) {
                sendData(req, {
                    type: "error", 
                    state: false, 
                    docId: docId,
                    message: "Failed to update document lastEdited value. " + err.message
                });
            })
        }

        callback();
    });

    shareBackend.use('connect', function(req, callback) {
        // console.log('=== connect', req);
        console.log('=== connect');
        callback();
    });

}



module.exports = (dbUrl) => {

    // TODO: No graceful error handling if the Mongo DB goes down. App keeps running
    // with bugged front-end.
    // TODO: If MongoDB server comes back, currently ShareDB doesn't try to reconnect.
    console.log(dbUrl);
    const db = require('sharedb-mongo')(dbUrl);     // BUSTED!!!!

    // Register rich-text shareDB type.
    ShareDB.types.register(require('rich-text').type);

    const shareBackend = new ShareDB({
        db: db,
        disableDocAction: true,             // docAction is depreciated
        disableSpaceDelimitedActions: true  // spaceDelimited is depreciated
        // pubsub: redisPubsub
    });

    setMiddleware(shareBackend);

    return shareBackend;
}