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

        return queryInterface.bulkInsert('Workspace_nodes', [{
            uuid: '053361e5-2ed4-4418-b55a-4e89b858c746',   // Root lvl #1
            type: 'root',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: 'e4c6e98c-c264-457f-a922-3e5439cde892',   // Root lvl #2
            type: 'root',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '3dda10b0-85c6-4278-9921-990337b71c34',   // Root lvl #3
            type: 'root',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '6812159d-496f-4d6f-bda4-507b870a38ad',   // Root lvl #4
            type: 'root',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '1fde1a80-9e84-47e7-bf63-4f25ba7d073a',   // Bin lvl #1
            type: 'bin',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: 'a5a7d8bf-ecff-40aa-b90c-8140d4a134da',   // Bin lvl #2
            type: 'bin',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '850056d5-9b90-4d40-9f47-03837c775d59',   // Bin lvl #3
            type: 'bin',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '20be11c5-bebe-476b-9ea8-15f83e6ed80b',   // Bin lvl #4
            type: 'bin',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',   // Workspace
            type: 'workspace',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '53a3d3c8-9a83-41fb-a259-af259799e9cc',   // Workspace
            type: 'workspace',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '0caf454c-ae3f-40bf-98ab-05e760324761',   // Workspace
            type: 'workspace',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: 'aa01c3b0-a0cf-45ac-9ba7-55836036fd8f',   // Subspace #1
            type: 'subspace',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '43ea0806-9217-4798-8f2c-9367ddea22d0',   // Subspace #2
            type: 'subspace',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '000cf8b9-bc0e-40a1-abca-b4eb4f4a7218',   // Subspace #3
            type: 'subspace',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: 'f01e3b66-8751-46f4-a9f3-487cd092c16b',   // Subspace #4
            type: 'subspace',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: 'ef66aa68-0b22-4b1f-aa31-6123e17ce1ad',   // Subspace
            type: 'subspace',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: 'ed5bb442-8478-4c5c-86c0-89f76285cb2f',   // Document #1
            type: 'document',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',   // Document #2
            type: 'document',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '42b6b388-57f9-4c19-a723-00f45504f58d',   // Document #3
            type: 'document',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '6ead121a-1054-4dd7-a991-97673ec92ec2',   // Document
            type: 'document',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '8a331d32-975f-4c4e-ae74-1e6644dfcdc8',   // Document
            type: 'document',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '04f4e35f-934d-4691-8aa8-c9dc740f6844',   // Document
            type: 'document',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '693de16a-df99-46e3-8afc-cc6ae5e99037',   // Document
            type: 'document',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '2646c963-6701-45a4-86d3-7236bc1dc5b0',   // Document
            type: 'document',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '76772211-ce30-4715-91f8-a0372d0f8cb1',   // Document
            type: 'document',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: 'd6407f19-2975-4cc2-baf7-a4a2a58c7ea6',   // Document
            type: 'document',
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

        return queryInterface.bulkDelete('Workspace_nodes', null, {});
    }
};
