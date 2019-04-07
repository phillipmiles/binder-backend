const workspaceController = require('./../controllers/workspace.ctrl')
const isAuthenticated = require('./../middleware/isAuthenticated.js')

module.exports = (router) => {
    router
    //     .route('/users')
    //     .get(userController.getAllUsers);

    // router
    //     .route('/user/:id')
    //     .get(userController.getUser);
    

    router
        .route('/workspace/:nodeId')
        .get(isAuthenticated, workspaceController.getNodeWithChildren);

    router
        .route('/node/:nodeId/order')
        .put(isAuthenticated, workspaceController.moveNode);

    router
        .route('/workspace')
        .post(isAuthenticated, workspaceController.createWorkspace);

    router
        .route('/document')
        .post(isAuthenticated, workspaceController.createDocument);

    router
        .route('/node')
        .post(isAuthenticated, workspaceController.createNode);

    router
        .route('/node/:nodeId')
        .put(isAuthenticated, workspaceController.editNodeTitle);

    router
        .route('/node/:nodeId/bin')
        .post(isAuthenticated, workspaceController.moveNodeToBin);

    router
        .route('/node/:nodeId')
        .patch(isAuthenticated, workspaceController.updateNode);
        
// .route('/workspace/node/move')

    // router
    //     .route('/user/node')
    //     .post(userController.addNode);
}