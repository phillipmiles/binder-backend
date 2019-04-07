/** server/controllers/article.ctrl.js*/
// const Workspace = require('./../models/Workspace');
// const User = require('./../models/User')

var models  = require('../models');
require('../helpers/error');

module.exports = {

    // Returns a specified node along with all it's children in a flat array with
    // the parent identified for each node. The front-end can then rebuild the
    // hierachical structure with an alogrithim. 
    getNodeWithChildren: async (req, res, next) => {

        try {
            const nodeId = req.params.nodeId;

            if(!nodeId)
                throwError(400, 'Unspecified node ID.')();

            // Fetch parent node.
            const parentNode = await models.Workspace_node.findById(nodeId, {
                include: [{
                    model: models.Workspace_node_access,
                    as: 'Accesses',
                    where: { user_id: req.user.uuid },
                }]
            });
            
            // TODO: Should we be explicit on which access types?
            // Check user has ANY access level to node
            if(!parentNode || parentNode.Accesses.length === 0)
                throwError(403, 'You don\'t have permission to view this item.')();

            // TODO: Only get children with access status of 'accepted'???
            const nodes = await models.Workspace_node.getChildren(req.params.nodeId)
            
            return res.status(200).json({
                status: 'ok',
                code: res.statusCode,
                message: 'Found nodes.',
                result: {
                    nodes: nodes
                }
            });

        } catch (err) {
            next(err);
        }
    },

    // Creates a document (along with the necessary access requirements) as a child of the parent
    // node specified along with optional sibling order position and title.
    createDocument: async (req, res, next) => {

        // TODO: Check user account type. If it's 'basic' check if number of documents
        // doesn't exceed the number allowed by this type.

        // TODO: For all of these routes that change anything, I'll have to check 
        // if the user's account is active or not in addition to whether it exists
        // or not, AFTER I consider what kinds of limitations affect inactive accounts.
        // I WONT HAVE TO DO THIS, if the user is prevented from logging on as basic
        // bouncer.isAuthenticated will catch this. Althoguht maybe I should include it
        // here just for safety incase I change my mind???? Could have it as a middleware,
        // an additional function to the bouncer helper.
        try {
            const parentNodeId = req.body.parentNodeId;
            const title = (req.body.title || 'Untitled');
            const index = (parseInt(req.body.index) || 5);

            // Check index is a positive number.
            if(!Number.isInteger(index) || (index < 0))
                throwError(400, 'The position index must be a positive integer.')();

            // Check parent node exists.
            if(!parentNodeId)
                throwError(400, 'Unspecified parent node ID.')();
            
            // Fetch parent node.
            const parentNode = await models.Workspace_node.findById(parentNodeId, {
                include: [{
                    model: models.Workspace_node_access,
                    as: 'Accesses',
                    where: { user_id: req.user.uuid },
                }]
            });
            
            // Check access level of parentNode
            if(!parentNode 
                || parentNode.Accesses.length === 0 
                || parentNode.Accesses[0].type !== 'write'
                || parentNode.Accesses[0].status !== 'active')
                throwError(403, 'You don\'t have permission to move this item.')();
            
            // Check what children we are allowed to add.
            if(!parentNode.canHaveChildren.includes('document'))
                throwError(403, 'The parent node is not allowed to have children of type \'document\'.')();

            // Start DB transaction
            models.sequelize.transaction( async function a(t) {
                const node = await models.Workspace_node.create({
                    type: 'document'
                }, {transaction: t});

                const document = await models.Document.create({ 
                    title: (title || 'Untitled'),
                    node_id: node.uuid,
                }, {transaction: t})
                
                // TODO: Check/test that this creates closures for shared users when created on a node that
                // is either a sharing node or a child of a sharing node.
                // Looking good so far. Need to do more thorough tests on complex, nested
                // sharing over multiple users and lengthy children branches.
                const nodeClosure = await models.Workspace_node_closure.addNodePaths(node.uuid, parentNodeId, t);

                // TODO: What if node is being created on a shared node where all other users only have 'read' access
                // to node.
                const newAccesses = await models.Workspace_node_access.addUserAccessToNodeWithChildren(req.user.uuid, node.uuid, parentNodeId, 'write', 'active', t);

                const nodeOrder = await models.Workspace_node_order.create({ 
                    node_id: node.uuid,
                    ancestor: parentNodeId,
                    order: index
                }, {transaction: t})

                const nodeOrderRefresh = await models.Workspace_node_order.refreshNodeChildrenOrder(parentNodeId, t)

                return document;

            }).then(function (result) {
                // Transaction committed
                // result is whatever the result of the promise chain returned to the transaction callback
                return res.status(200).json({
                    status: 'ok',
                    code: res.statusCode,
                    message: 'Document successfully created.',
                    result: {
                        document: result
                    }
                });
            }).catch(function (err) {
                // Transaction rolled back
                next(err);
            });           
        } catch (err) {
            next(err);
        }
    },

    moveNodeToBin: async (req, res, next) => {
        try {
            const nodeId = req.params.nodeId;

            if(!nodeId)
                throwError(403, 'Unspecified node ID.')();

            // Fetch bin node.
            const binNode = await models.Workspace_node.getUserNodesOfType(req.user.uuid, 'bin');

            // Check root node exists.
            if(!binNode)
                throwError(400, 'Could not locate the user\'s bin node.')();
        
            // Check access level of parentNode
            if(binNode[0].dataValues.access_type !== 'write'
                || binNode[0].dataValues.access_status !== 'active')
                throwError(403, 'You don\'t have permission move a node here.')();

            // Fetch node.
            const node = await models.Workspace_node.findById(nodeId, {
                include: [{
                    model: models.Workspace_node_access,
                    as: 'Accesses',
                    where: { user_id: req.user.uuid },
                }]
            });
            
            // Check user access levels.
            if(!node 
                || node.Accesses.length === 0
                || node.Accesses[0].type !== 'write'
                || node.Accesses[0].status !== 'active')
                throwError(403, 'You don\'t have permission to delete this item.')();

            if(!node.canDelete)
                throwError(403, 'This node cannot be deleted.')();
                
            // Check what children we are allowed to add.
            if(!binNode[0].canHaveChildren.includes(node.type))
                throwError(403, 'The bin is not allowed to have children of type \' ' + node.type + '\'.')();

            // Begin transaction
            models.sequelize.transaction( async function a(t) {
                
                // TODO: This is a dumb move to bin. It makes no concessions for shared nodes.
                const deletedNodeClosure = await models.Workspace_node_closure.deleteNodePathsWithChildren(node.uuid, t);

                const nodeClosure = await models.Workspace_node_closure.addNodePathsWithChildren(node.uuid, binNode[0].dataValues.id, t);

                // Set all relavent node status's to 'binned'.
                const updatedAccesses = await models.Workspace_node_access.updateUserAccessStatusToNodeWithChildren(req.user.uuid, node.uuid, 'binned', t);

                // TODO: Need to delete or UPDATE old node_order

                // const nodeOrderUpdate = await models.Workspace_node_order.updateNodeChildOrder(bin[0].dataValues.id, nodeId, 5, t)
                // if(!nodeOrderUpdate.metadata)
                //     throwError(500, 'Failed to update node order')();
                
                const nodeOrder = await models.Workspace_node_order.create({ 
                    node_id: node.uuid,
                    ancestor: binNode[0].dataValues.id,
                    order: 0
                }, {transaction: t})

                // TODO: Need to also refresh node order for old parent_node.


                // const nodeOrderRefresh = await models.Workspace_node_order.refreshNodeChildrenOrder(binNode[0].dataValues.id, t)
                // if(!nodeOrderRefresh.metadata) 
                //     throwError(500, 'Failed to refresh node order')();
                
                    return  {
                        "id": node.uuid,
                        "ancestor": binNode[0].dataValues.id,
                        "depth": 1,
                        "order": 10,
                        "previous_parent_id": node,
                        "parent_id": binNode[0].dataValues.id,
                        "type": node.type
                    }

            }).then(function (result) {
                // Transaction committed
                // result is whatever the result of the promise chain returned to the transaction callback
                return res.status(200).json({
                    status: 'ok',
                    code: res.statusCode,
                    message: 'Node successfully moved to bin.',
                    result: {
                        node: result
                    }
                });
            }).catch(function (err) {
                // Transaction rolled back
                next(err);
            });

        } catch (err) {
            next(err);
        }
    },

    moveNode: async (req, res, next) => {
        // TODO: Check for new parent node.
        // TODO: Handle sharing node if needed.
        // TODO: Prevent moving a node to the bin or moving a binned node or or moving to a node with a permission set to binned.
        // this should only be handles by the moveNodeToBin API route. 
        try {
            const nodeId = req.params.nodeId;
            const childNodeId = req.body.childNodeId
            const index = req.body.newIndex;
            
            if(!nodeId)
                throwError(403, 'Unspecified node ID.')();
            if(!childNodeId)
                throwError(403, 'Unspecified child node ID.')();
            if(!index)
                throwError(403, 'Unspecified index.')();

            // TODO: CHeck for write access to node.
            const access = await models.Workspace_node_access.getUserAccessToNode(req.user.uuid, nodeId)
            
            if(!access)
                throwError(403, 'You don\'t have permission to move this item.')();

            // Begin transaction
            models.sequelize.transaction( async function a(t) {
                const nodeOrderUpdate = await models.Workspace_node_order.updateNodeChildOrder(nodeId, childNodeId, index, t)
                if(!nodeOrderUpdate.metadata)
                    throwError(500, 'Failed to update node order')();
                
                const nodeOrderRefresh = await models.Workspace_node_order.refreshNodeChildrenOrder(nodeId, t)
                if(!nodeOrderRefresh.metadata) 
                    throwError(500, 'Failed to refresh node order')();
                
                return true;

            }).then(function (result) {
                // Transaction committed
                // result is whatever the result of the promise chain returned to the transaction callback
                return res.status(200).json({
                    status: 'ok',
                    code: res.statusCode,
                    message: 'Node order successfully updated.',
                    result: {}
                });
            }).catch(function (err) {
                // Transaction rolled back
                next(err);
            });
        } catch (err) {
            next(err);
        }
    },


    // Creates a workspace (along with the necessary access requirements) as a child of the parent
    // node specified along with optional sibling order position and title.
    createWorkspace: async (req, res, next) => {

        // TODO: Check user account type. If it's 'basic' check if number of documents
        // doesn't exceed the number allowed by this type.

        // TODO: For all of these routes that change anything, I'll have to check 
        // if the user's account is active or not in addition to whether it exists
        // or not, AFTER I consider what kinds of limitations affect inactive accounts.
        // I WONT HAVE TO DO THIS, if the user is prevented from logging on as basic
        // bouncer.isAuthenticated will catch this. Althoguht maybe I should include it
        // here just for safety incase I change my mind???? Could have it as a middleware,
        // an additional function to the bouncer helper.
        try {
            const title = (req.body.title || 'Untitled');
            const index = (parseInt(req.body.index) || 5);

            // Fetch root node.
            const rootNode = await models.Workspace_node.getUserRootNode(req.user.uuid);

            // Check root node exists.
            if(!rootNode)
                throwError(400, 'Could not locate the user\'s root node.')();
        
            // Check access level of parentNode
            if(rootNode[0].dataValues.access_type !== 'write'
                || rootNode[0].dataValues.access_status !== 'active')
                throwError(403, 'You don\'t have permission add a workspace here.')();

            // Check index is a positive number.
            if(!Number.isInteger(index) || (index < 0))
                throwError(400, 'The position index must be a positive integer.')();
            
            // Check what children we are allowed to add.
            if(!rootNode[0].canHaveChildren.includes('workspace'))
                throwError(403, 'The parent node is not allowed to have children of type \'workspace\'.')();


            // Start DB transaction
            models.sequelize.transaction( async function a(t) {
                const node = await models.Workspace_node.create({
                    type: 'workspace'
                }, {transaction: t});

                const workspace = await models.Workspace.create({ 
                    title: (title || 'Untitled'),
                    node_id: node.uuid,
                }, {transaction: t})
                
                const nodeClosure = await models.Workspace_node_closure.addNodePaths(node.uuid, rootNode[0].dataValues.id, t);

                const newAccesses = await models.Workspace_node_access.addUserAccessToNodeWithChildren(req.user.uuid, node.uuid, rootNode[0].dataValues.id, 'write', 'active', t);

                const nodeOrder = await models.Workspace_node_order.create({ 
                    node_id: node.uuid,
                    ancestor: rootNode[0].dataValues.id,
                    order: index
                }, {transaction: t})

                const nodeOrderRefresh = await models.Workspace_node_order.refreshNodeChildrenOrder(rootNode[0].dataValues.id, t)

                return  {
                    "id": node.uuid,
                    "ancestor": rootNode[0].dataValues.id,
                    "depth": 1,
                    "order": 10,
                    "parent_id": rootNode[0].dataValues.id,
                    "title": workspace.title,
                    "type": workspace.type
                }

            }).then(function (result) {
                // Transaction committed
                // result is whatever the result of the promise chain returned to the transaction callback
                return res.status(200).json({
                    status: 'ok',
                    code: res.statusCode,
                    message: 'Workspace successfully created.',
                    result: {
                        workspace: result
                    }
                });
            }).catch(function (err) {
                // Transaction rolled back
                next(err);
            });           
        } catch (err) {
            next(err);
        }
    },  


    // Creates a node
    createNode: async (req, res, next) => {

        // TODO: Check user account type. If it's 'basic' check if number of documents
        // doesn't exceed the number allowed by this type.

        // TODO: For all of these routes that change anything, I'll have to check 
        // if the user's account is active or not in addition to whether it exists
        // or not, AFTER I consider what kinds of limitations affect inactive accounts.
        // I WONT HAVE TO DO THIS, if the user is prevented from logging on as basic
        // bouncer.isAuthenticated will catch this. Althoguht maybe I should include it
        // here just for safety incase I change my mind???? Could have it as a middleware,
        // an additional function to the bouncer helper.
        try {
            const parentNodeId = req.body.parentNodeId;
            const title = (req.body.title || 'Untitled');
            const nodeType = req.body.nodeType.toLowerCase().replace(/^\s+|\s+$/g, ''); // Fancy trim stuff not really needed.
            const index = (parseInt(req.body.index) || 5);

            // Check index is a positive number.
            if(!Number.isInteger(index) || (index < 0))
                throwError(400, 'The position index must be a positive integer.')();


            // Check node type exists
            if(!nodeType)
                throwError(400, 'Unspecified node type.')();

            // Check parent node exists.
            if(!parentNodeId)
                throwError(400, 'Unspecified parent node ID.')();
                
            
            // Fetch parent node.
            const parentNode = await models.Workspace_node.findById(parentNodeId, {
                include: [{
                    model: models.Workspace_node_access,
                    as: 'Accesses',
                    where: { user_id: req.user.uuid },
                }]
            });

            // Check access level of parentNode
            if(!parentNode 
                || parentNode.Accesses.length === 0 
                || parentNode.Accesses[0].type !== 'write'
                || parentNode.Accesses[0].status !== 'active')
                throwError(403, 'You don\'t have permission to create this item here.')();
            
            // Check what children we are allowed to add.
            if(!parentNode.canHaveChildren.includes(nodeType))
                throwError(403, "The parent node is not allowed to have children of type '" + nodeType + "'.")();

            // Start DB transaction
            models.sequelize.transaction( async function a(t) {
                const node = await models.Workspace_node.create({
                    type: nodeType
                }, {transaction: t});


                var nodeContent;
        
                switch(nodeType) {
                    case 'workspace':
                        nodeContent= await models.Workspace.create({ 
                            title: (title || 'Untitled'),
                            node_id: node.uuid,
                        }, {transaction: t})
                        break;
                    case 'subspace':
                        nodeContent = await models.Subspace.create({ 
                            title: (title || 'Untitled'),
                            node_id: node.uuid,
                        }, {transaction: t})
                        break;
                    case 'document':
                        nodeContent = await models.Document.create({ 
                            title: (title || 'Untitled'),
                            node_id: node.uuid,
                        }, {transaction: t})
                        break;
                    default: 
                        throwError(403, "The parent node is not allowed to have children of type '" + nodeType + "'.")();
                        break;
                }
                
                
                // TODO: Check/test that this creates closures for shared users when created on a node that
                // is either a sharing node or a child of a sharing node.
                // Looking good so far. Need to do more thorough tests on complex, nested
                // sharing over multiple users and lengthy children branches.
                const nodeClosure = await models.Workspace_node_closure.addNodePaths(node.uuid, parentNodeId, t);

                // TODO: What if node is being created on a shared node where all other users only have 'read' access
                // to node.
                const newAccesses = await models.Workspace_node_access.addUserAccessToNodeWithChildren(req.user.uuid, node.uuid, parentNodeId, 'write', 'active', t);

                const nodeOrder = await models.Workspace_node_order.create({ 
                    node_id: node.uuid,
                    ancestor: parentNodeId,
                    order: index
                }, {transaction: t})

                const nodeOrderRefresh = await models.Workspace_node_order.refreshNodeChildrenOrder(parentNodeId, t)

                return {
                       ancestor: null,
                       content_id: nodeContent.uuid,
                       depth: null,
                       id: node.uuid,
                       order: nodeOrder.order,
                       parent_id: parentNodeId,
                       title: nodeContent.title,
                       lastEdited: nodeContent.lastEdited,
                       type: node.type
                };

            }).then(function (result) {
                // Transaction committed
                // result is whatever the result of the promise chain returned to the transaction callback
                return res.status(200).json({
                    status: 'ok',
                    code: res.statusCode,
                    message: 'Node successfully created.',
                    result: {
                        node: result
                    }
                });
            }).catch(function (err) {
                // Transaction rolled back
                next(err);
            });           
        } catch (err) {
            next(err);
        }
    },

    editNodeTitle: async (req, res, next) => {
        try {
            const title = req.body.title;
            const nodeId = req.params.nodeId;
            
            if(!nodeId)
                throwError(403, 'Unspecified node ID.')();
            if(!title)
                throwError(403, 'No title provided')();

            // Fetch node.
            const node = await models.Workspace_node.findById(nodeId, {
                include: [{
                    model: models.Workspace_node_access,
                    as: 'Accesses',
                    where: { user_id: req.user.uuid },
                }]
            });
            
            // Check user access levels.
            if(!node 
                || node.Accesses.length === 0
                || node.Accesses[0].type !== 'write'
                || node.Accesses[0].status !== 'active')
                throwError(403, 'You don\'t have permission to view this item.')();

            switch(node.type) {
                case 'document':
                    var nodeContent = await models.Document.findAll({
                        where: {
                            node_id: node.uuid
                        }
                    });
                    break;
                case 'subspace':
                    var nodeContent = await models.Subspace.findAll({
                        where: {
                            node_id: node.uuid
                        }
                    });
                    break;
                case 'workspace':
                    var nodeContent = await models.Workspace.findAll({
                        where: {
                            node_id: node.uuid
                        }
                    });
                    break;
                default:
                    throwError(404, 'Could not identify the node type.')();
                    break;
            }
            
            nodeContent[0].update({
                title: title
            }).then((result) => {
                return res.status(200).json({
                    status: 'ok',
                    code: res.statusCode,
                    message: 'Node successfully updated.',
                    result: {
                        nodeContent: result
                    }
                });
            }).catch(function (err) {
                console.log('error on update'. err);
                next(err);
            })
        } catch (err) {
            console.log('final error?');
            next(err);
        }
    },


    updateNode: async (req, res, next) => {
        try {
            const nodeId = req.params.nodeId;
            const title = req.body.title;
            const parentNodeId = req.body.parentNodeId;
            const index = req.body.index;
            
            if(!nodeId)
                throwError(403, 'Unspecified node ID.')();

            // Fetch node.
            const node = await models.Workspace_node.findById(nodeId, {
                include: [{
                    model: models.Workspace_node_access,
                    as: 'Accesses',
                    where: { user_id: req.user.uuid },
                }]
            });
            
            
            // Check user access levels.
            if(!node 
                || node.Accesses.length === 0
                || node.Accesses[0].type !== 'write'
                || node.Accesses[0].status !== 'active')
                throwError(403, 'You don\'t have permission to update this item.')();

            // Move node
            if(parentNodeId) {
                // Fetch node.
                const parentNode = await models.Workspace_node.findById(parentNodeId, {
                    include: [{
                        model: models.Workspace_node_access,
                        as: 'Accesses',
                        where: { user_id: req.user.uuid },
                    }]
                });

                // Check user access levels.
                if(!parentNode 
                    || parentNode.Accesses.length === 0
                    || parentNode.Accesses[0].type !== 'write'
                    || parentNode.Accesses[0].status !== 'active')
                    throwError(403, 'You don\'t have permission set this node to the specified parent node.')();


                if(!node.canMove)
                    throwError(403, 'This node is not allowed to have their parent node updated.')();
                
                // Check what children we are allowed to add.
                if(!parentNode.canHaveChildren.includes(node.type)) // TODO : disallow root node type from having documents and subspaces.
                    throwError(403, 'Specified parent node is not allowed to have children of type \' ' + node.type + '\'.')();

                // TODO: Need to prevent adding a folder into itself or a nested folder. Currently getting caught by unclear SQL validation error.
               
                // PHIL LOOK ======================================≠
                // TODO: Subspace 2 has two parent nodes. How do we get the one that this user cares about!!!
                // this affects which old parent node is getting their order refreshed as part of the move.
                // PHIL LOOK ======================================≠
                var oldParent = await models.Workspace_node_closure.getUsersImmediantAncestorsOfNode(node.uuid, req.user.uuid);

                // Begin transaction
                var result = await models.sequelize.transaction(async function a(t) {
                    return moveNode(req.user.uuid, node.uuid, parentNode.uuid, parentNode.type, index, oldParent[0].ancestor, t)
                }).catch(function (err) {
                    // Transaction rolled back
                    // next(err);
                    throwError(403, err)();
                });
            }

            if(title) {
                switch(node.type) {
                    case 'document':
                        var nodeContent = await models.Document.findAll({
                            where: {
                                node_id: node.uuid
                            }
                        });
                        break;
                    case 'subspace':
                        var nodeContent = await models.Subspace.findAll({
                            where: {
                                node_id: node.uuid
                            }
                        });
                        break;
                    case 'workspace':
                        var nodeContent = await models.Workspace.findAll({
                            where: {
                                node_id: node.uuid
                            }
                        });
                        break;
                    default:
                        throwError(404, 'Could not identify the node type.')();
                        break;
                }

                await nodeContent[0].update({
                    title: title
                }).catch(function (err) {
                    console.log('error on update'. err);
                    next(err);
                })
            }

            res.status(200).json({
                status: 'ok',
                code: res.statusCode,
                message: 'Node successfully updated.'
            });
            
        } catch (err) {
            console.log('final error?');
            next(err);
        }
    }

}

async function moveNode(user_id, node_id, parent_id, parent_node_type, index, old_parent_id, t) {
                    
    // TODO: This is a dumb move to bin. It makes no concessions for shared nodes.
    const deletedNodeClosure = await models.Workspace_node_closure.deleteNodePathsWithChildren(node_id, t);

    const nodeClosure = await models.Workspace_node_closure.addNodePathsWithChildren(node_id, parent_id, t);

    if(parent_node_type === 'bin') {
        const updatedAccesses = await models.Workspace_node_access.updateUserAccessStatusToNodeWithChildren(user_id, node_id, 'binned', t);
    }

    // const nodeOrder = await models.Workspace_node_order.findAll({
    //     where: {
    //         node_id: node_id,
    //         ancestor: old_parent_id
    //     }
    // });


    // const nodeOrder = await  models.Workspace_node_order.findOne({
    //     where: {
    //         node_id: node_id,
    //         ancestor: old_parent_id
    //     }
    // });
    // console.log('PARENT NODE: ', parent_id);
    // console.log('BINGO BANGO', nodeOrder[0]);

    // TODO: Need to delete or UPDATE old node_order
    // const nodeOrderUpdate = await nodeOrder[0].update({
    //     order: index ? (index * 10) + 5 : 5,
    //     ancestor: parent_id,
    // }, {
    //     fields: ['ancestor', 'order'],
    //     transaction: t});

    const order = index ? (index * 10) + 5 : 5;
    const nodeOrderUpdate = await models.Workspace_node_order.updateNodeOrder(node_id, old_parent_id, parent_id, order, t);
    // const nodeOrder = await models.Workspace_node_order.create({ 
    //     node_id: node_id,
    //     ancestor: parent_id,
    //     order: index ? (index * 10) + 5 : 5
    // }, {transaction: t})


    // Refresh node orders.
    const nodeOrderRefresh = await models.Workspace_node_order.refreshNodeChildrenOrder(parent_id, t)
    const nodeOrderRefreshOldParent = await models.Workspace_node_order.refreshNodeChildrenOrder(old_parent_id, t)
    
    return true;
}