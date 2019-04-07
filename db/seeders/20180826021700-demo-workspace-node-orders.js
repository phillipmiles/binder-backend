'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
        Add altering commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.bulkInsert('Person', [{
            name: 'John Doe',
            isBetaMember: false
        }], {});
        */

       return queryInterface.bulkInsert('Workspace_node_orders', [{
            ancestor: '053361e5-2ed4-4418-b55a-4e89b858c746',  
            node_id: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',   // Workspace #1
            order: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee', 
            node_id: 'ed5bb442-8478-4c5c-86c0-89f76285cb2f',   // Document #1
            order: 10,
            createdAt: new Date(),
            updatedAt: new Date()

        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee', 
            node_id: 'aa01c3b0-a0cf-45ac-9ba7-55836036fd8f',   // Subspace #1
            order: 20,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee', 
            node_id: '43ea0806-9217-4798-8f2c-9367ddea22d0',   // Subspace #2
            order: 30,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee', 
            node_id: '000cf8b9-bc0e-40a1-abca-b4eb4f4a7218',   // Subspace #3
            order: 40,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '000cf8b9-bc0e-40a1-abca-b4eb4f4a7218', 
            node_id: 'f01e3b66-8751-46f4-a9f3-487cd092c16b',   // Subspace #4
            order: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: 'f01e3b66-8751-46f4-a9f3-487cd092c16b', 
            node_id: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',   // Document #2
            order: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '1fde1a80-9e84-47e7-bf63-4f25ba7d073a', 
            node_id: '42b6b388-57f9-4c19-a723-00f45504f58d',   // Document #3   // In bin
            order: 10,
            createdAt: new Date(),
            updatedAt: new Date()

            
        // TODO: Workspaces cant have orders in the current format!!! The order of a root lvl
        // workspace isn't distinct between two user's sharing a workspace!!!!
        // Either remove orders for nodes connected to workspaces or each user gets
        // a root level node! Would then have to implement checks everywhere to ensure a user
        // isn't attempting to manipulat a root lvl node as these must be static. OR add a user
        // ID column to the orders table. 
        }, {
            ancestor: 'e4c6e98c-c264-457f-a922-3e5439cde892', 
            node_id: '53a3d3c8-9a83-41fb-a259-af259799e9cc',   // Workspace #2
            order: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '53a3d3c8-9a83-41fb-a259-af259799e9cc', 
            node_id: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',   // Document #2
            order: 30,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: 'e4c6e98c-c264-457f-a922-3e5439cde892', 
            node_id: '0caf454c-ae3f-40bf-98ab-05e760324761',   // Workspace #3
            order: 20,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '53a3d3c8-9a83-41fb-a259-af259799e9cc', 
            node_id: '43ea0806-9217-4798-8f2c-9367ddea22d0',   // Subspace #2
            order: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        /*
        Add reverting commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.bulkDelete('Person', null, {});
        */
       return queryInterface.bulkDelete('Workspace_node_orders', null, {});
    }
};
