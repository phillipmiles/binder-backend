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

        return queryInterface.bulkInsert('Workspaces', [{
            uuid: '0b945f2d-6765-45d2-a605-3df06e8c01b8',
            title: 'Workspace #1',
            node_id: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',   // Workspace
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: 'ba5a2a34-1e65-4801-819d-aaaee247c87a',
            title: 'Workspace #2',
            node_id: '53a3d3c8-9a83-41fb-a259-af259799e9cc',   // Workspace
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            uuid: '5e54d2af-dfd9-4212-b7ee-a1c585d490b0',
            title: 'Workspace #3',
            node_id: '0caf454c-ae3f-40bf-98ab-05e760324761',   // Workspace
            createdAt: new Date(),
            updatedAt: new Date()



        }], {}).then(function() {



            return queryInterface.bulkInsert('Subspaces', [{
                uuid: 'abeaf6cb-0481-433c-a3b1-c228d6703645',
                title: 'Subspace #1',
                node_id: 'aa01c3b0-a0cf-45ac-9ba7-55836036fd8f',   // Subspace #1
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                uuid: 'e2286190-62f3-48ba-9e6b-50a9dbf8da1e',
                title: 'Subspace #2',
                node_id: '43ea0806-9217-4798-8f2c-9367ddea22d0',   // Subspace #2
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                uuid: '5a1d115a-744d-499e-ab2e-338d7bde22e8',
                title: 'Subspace #3',
                node_id: '000cf8b9-bc0e-40a1-abca-b4eb4f4a7218',   // Subspace
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                uuid: '6bf13953-5dc2-4d24-89b5-44d39b20e8ba',
                title: 'Subspace #4',
                node_id: 'f01e3b66-8751-46f4-a9f3-487cd092c16b',   // Subspace
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                uuid: '508d7e54-c606-456b-95ab-198e3837ccac',
                title: 'Subspace #5',
                node_id: 'ef66aa68-0b22-4b1f-aa31-6123e17ce1ad',   // Subspace
                createdAt: new Date(),
                updatedAt: new Date()



            }], {}).then(function() {



                return queryInterface.bulkInsert('Documents', [{
                    uuid: '9a6cb9ce-b570-41e2-adee-e6e84986e374',
                    title: 'Document #1',
                    node_id: 'ed5bb442-8478-4c5c-86c0-89f76285cb2f',   // Document #1
                    lastEdited: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    uuid: 'debe37c2-837b-4941-90a7-20418a7951bb',
                    title: 'Document #2',
                    node_id: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',   // Document #2
                    lastEdited: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    uuid: 'c943cc6f-eac2-4dd2-809e-a0bd51321385',
                    title: 'Document #3',
                    node_id: '42b6b388-57f9-4c19-a723-00f45504f58d',   // Document  #3
                    lastEdited: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    uuid: '66f3f762-8b2b-42a7-a036-764a54751e9b',
                    title: 'Document #4',
                    node_id: '6ead121a-1054-4dd7-a991-97673ec92ec2',   // Document
                    lastEdited: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    uuid: 'f9463519-b180-4c78-88ba-d83640bb8074',
                    title: 'Document #5',
                    node_id: '8a331d32-975f-4c4e-ae74-1e6644dfcdc8',   // Document
                    lastEdited: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    uuid: 'a0479f40-d688-4094-8a08-41faadbeaee3',
                    title: 'Document #6',
                    node_id: '04f4e35f-934d-4691-8aa8-c9dc740f6844',   // Document
                    lastEdited: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    uuid: 'e718d7da-ba14-4224-915b-cc54cc1d418e',
                    title: 'Document #7',
                    node_id: '693de16a-df99-46e3-8afc-cc6ae5e99037',   // Document
                    lastEdited: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    uuid: '38d942d3-fd81-4170-b2ba-f3c2855f2e9d',
                    title: 'Document #8',
                    node_id: '2646c963-6701-45a4-86d3-7236bc1dc5b0',   // Document
                    lastEdited: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    uuid: '06087a7c-1015-4975-9096-a6bea776430e',
                    title: 'Document #9',
                    node_id: '76772211-ce30-4715-91f8-a0372d0f8cb1',   // Document
                    lastEdited: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, {
                    uuid: '736d0652-2eb2-4722-b3f9-303c8e72e656',
                    title: 'Document #10',
                    node_id: 'd6407f19-2975-4cc2-baf7-a4a2a58c7ea6',   // Document
                    lastEdited: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }], {});
            });
        });
    },

    down: (queryInterface, Sequelize) => {
        /*
        Add reverting commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.bulkDelete('Person', null, {});
        */
        return queryInterface.bulkDelete('Workspaces', null, {}).then(function() {
            return queryInterface.bulkDelete('Subspaces', null, {}).then(function() {
                return queryInterface.bulkDelete('Documents', null, {});
            });
        });
    }
};
