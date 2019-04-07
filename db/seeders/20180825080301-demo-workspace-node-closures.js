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

       return queryInterface.bulkInsert('Workspace_node_closures', [{

            // =======
            // USER #1
            // =======
            ancestor: '053361e5-2ed4-4418-b55a-4e89b858c746',   // Root lvl #1
            descendant: '053361e5-2ed4-4418-b55a-4e89b858c746',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '1fde1a80-9e84-47e7-bf63-4f25ba7d073a',   // Bin lvl #1
            descendant: '1fde1a80-9e84-47e7-bf63-4f25ba7d073a',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',   // Workspace #1
            descendant: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '053361e5-2ed4-4418-b55a-4e89b858c746',   // Workspace #1
            descendant: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',  
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: 'aa01c3b0-a0cf-45ac-9ba7-55836036fd8f',   // Subspace #1
            descendant: 'aa01c3b0-a0cf-45ac-9ba7-55836036fd8f',
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',   // Subspace #1
            descendant: 'aa01c3b0-a0cf-45ac-9ba7-55836036fd8f',
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '053361e5-2ed4-4418-b55a-4e89b858c746',   // Subspace #1
            descendant: 'aa01c3b0-a0cf-45ac-9ba7-55836036fd8f',
            length: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {         
            ancestor: 'ed5bb442-8478-4c5c-86c0-89f76285cb2f',   // Document #1
            descendant: 'ed5bb442-8478-4c5c-86c0-89f76285cb2f',
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',   // Document #1
            descendant: 'ed5bb442-8478-4c5c-86c0-89f76285cb2f',
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '053361e5-2ed4-4418-b55a-4e89b858c746',   // Document #1
            descendant: 'ed5bb442-8478-4c5c-86c0-89f76285cb2f',
            length: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '43ea0806-9217-4798-8f2c-9367ddea22d0',   // Subspace #2  // Shared w user #2
            descendant: '43ea0806-9217-4798-8f2c-9367ddea22d0',
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',   // Subspace #2  // Shared w user #2
            descendant: '43ea0806-9217-4798-8f2c-9367ddea22d0',
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '053361e5-2ed4-4418-b55a-4e89b858c746',   // Subspace #2  // Shared w user #2
            descendant: '43ea0806-9217-4798-8f2c-9367ddea22d0',
            length: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {   
            ancestor: '000cf8b9-bc0e-40a1-abca-b4eb4f4a7218',    
            descendant: '000cf8b9-bc0e-40a1-abca-b4eb4f4a7218', // Subspace #3
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',    
            descendant: '000cf8b9-bc0e-40a1-abca-b4eb4f4a7218', // Subspace #3
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '053361e5-2ed4-4418-b55a-4e89b858c746',    
            descendant: '000cf8b9-bc0e-40a1-abca-b4eb4f4a7218', // Subspace #3
            length: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: 'f01e3b66-8751-46f4-a9f3-487cd092c16b',    
            descendant: 'f01e3b66-8751-46f4-a9f3-487cd092c16b', // Subspace #4
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '000cf8b9-bc0e-40a1-abca-b4eb4f4a7218',    
            descendant: 'f01e3b66-8751-46f4-a9f3-487cd092c16b', // Subspace #4
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',    
            descendant: 'f01e3b66-8751-46f4-a9f3-487cd092c16b', // Subspace #4
            length: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '053361e5-2ed4-4418-b55a-4e89b858c746',    
            descendant: 'f01e3b66-8751-46f4-a9f3-487cd092c16b', // Subspace #4
            length: 3,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {     
            ancestor: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',
            descendant: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',    // Document #2   // Shared w user #2
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: 'f01e3b66-8751-46f4-a9f3-487cd092c16b',
            descendant: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',    // Document #2
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '000cf8b9-bc0e-40a1-abca-b4eb4f4a7218',
            descendant: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',    // Document #2
            length: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '8c789d2a-becd-4f33-9499-b0bbc0a572ee',
            descendant: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',    // Document #2
            length: 3,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '053361e5-2ed4-4418-b55a-4e89b858c746',
            descendant: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',    // Document #2
            length: 4,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '42b6b388-57f9-4c19-a723-00f45504f58d',   // Document #3   // In bin
            descendant: '42b6b388-57f9-4c19-a723-00f45504f58d',
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '1fde1a80-9e84-47e7-bf63-4f25ba7d073a',   // Document #3   // In bin
            descendant: '42b6b388-57f9-4c19-a723-00f45504f58d',
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {


        //     uuid: '5618cf2f-1ae1-4861-a8df-ee3b7e8c273f',   // Subspace
        //     node_id: 'ef66aa68-0b22-4b1f-aa31-6123e17ce1ad',
        //     user_id: '73ebadf2-49c2-4b05-8fad-66e49cabccf0',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // 
        // }, {
        //     uuid: 'b99d3465-57bd-48de-b7aa-d08518c87246',   // Document
        //     node_id: '6ead121a-1054-4dd7-a991-97673ec92ec2',
        //     user_id: '73ebadf2-49c2-4b05-8fad-66e49cabccf0',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // }, {
        //     uuid: '026c2505-a2f5-4c47-993a-aee003144161',   // Document
        //     node_id: '8a331d32-975f-4c4e-ae74-1e6644dfcdc8',
        //     user_id: '73ebadf2-49c2-4b05-8fad-66e49cabccf0',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // }, {
        //     uuid: 'b3073541-8562-40bf-8115-68f98ca74d18',   // Document
        //     node_id: '04f4e35f-934d-4691-8aa8-c9dc740f6844',
        //     user_id: '73ebadf2-49c2-4b05-8fad-66e49cabccf0',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // }, {
        //     uuid: '5f226789-e79c-4177-838f-af5214407558',   // Document
        //     node_id: '693de16a-df99-46e3-8afc-cc6ae5e99037',
        //     user_id: '73ebadf2-49c2-4b05-8fad-66e49cabccf0',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // }, {      
        //     uuid: '9d97b51e-32d4-4a84-9a39-62164d9ba421',   // Document
        //     node_id: '2646c963-6701-45a4-86d3-7236bc1dc5b0',
        //     user_id: '73ebadf2-49c2-4b05-8fad-66e49cabccf0',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // }, {
        //     uuid: 'f7c0b0e8-03ce-4558-805b-914224e4e031',   // Document
        //     node_id: '76772211-ce30-4715-91f8-a0372d0f8cb1',
        //     user_id: '73ebadf2-49c2-4b05-8fad-66e49cabccf0',
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // }, {
        //     uuid: '417d6b14-aeb6-4159-83a6-9d6f2eebb1c0',   // Document
        //     node_id: 'd6407f19-2975-4cc2-baf7-a4a2a58c7ea6',
        //     user_id: '73ebadf2-49c2-4b05-8fad-66e49cabccf0',
        //     createdAt: new Date(),
        //     updatedAt: new Date()




        // }, {
        // =======
        // USER #2
        // =======
            ancestor: 'e4c6e98c-c264-457f-a922-3e5439cde892',   // Root lvl #2
            descendant: 'e4c6e98c-c264-457f-a922-3e5439cde892',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: 'a5a7d8bf-ecff-40aa-b90c-8140d4a134da',   // Bin lvl #2
            descendant: 'a5a7d8bf-ecff-40aa-b90c-8140d4a134da',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '53a3d3c8-9a83-41fb-a259-af259799e9cc',   // Workspace #2
            descendant: '53a3d3c8-9a83-41fb-a259-af259799e9cc',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: 'e4c6e98c-c264-457f-a922-3e5439cde892',   // Workspace #2
            descendant: '53a3d3c8-9a83-41fb-a259-af259799e9cc',  
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '0caf454c-ae3f-40bf-98ab-05e760324761',   // Workspace #3 // Shared w user #3
            descendant: '0caf454c-ae3f-40bf-98ab-05e760324761',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {  
            ancestor: 'e4c6e98c-c264-457f-a922-3e5439cde892',   // Workspace #3 // Shared w user #3
            descendant: '0caf454c-ae3f-40bf-98ab-05e760324761',  
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '53a3d3c8-9a83-41fb-a259-af259799e9cc',   // Subspace #2  // Shared w user #1
            descendant: '43ea0806-9217-4798-8f2c-9367ddea22d0',
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: 'e4c6e98c-c264-457f-a922-3e5439cde892',   // Subspace #2  // Shared w user #1
            descendant: '43ea0806-9217-4798-8f2c-9367ddea22d0',
            length: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '53a3d3c8-9a83-41fb-a259-af259799e9cc',
            descendant: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',    // Document #2   // Shared w user #1
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: 'e4c6e98c-c264-457f-a922-3e5439cde892',
            descendant: '65f91ad6-0f8f-43ff-a447-786bbfd35e73',    // Document #2   // Shared w user #1
            length: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {

        // ===========
        // USER #3
        // ===========
            ancestor: '3dda10b0-85c6-4278-9921-990337b71c34',   // Root lvl #3
            descendant: '3dda10b0-85c6-4278-9921-990337b71c34',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '850056d5-9b90-4d40-9f47-03837c775d59',   // Bin lvl #3
            descendant: '850056d5-9b90-4d40-9f47-03837c775d59',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()

        // Don't need a 0 length Workspace 3 as it already exists above for user #2.
        }, {
            ancestor: '3dda10b0-85c6-4278-9921-990337b71c34',   // Workspace #3 // Shared w user #2
            descendant: '0caf454c-ae3f-40bf-98ab-05e760324761',  
            length: 1,
            createdAt: new Date(),
            updatedAt: new Date()

        // ===========
        // USER #4
        // ===========
        }, {
            ancestor: '6812159d-496f-4d6f-bda4-507b870a38ad',   // Root lvl #4
            descendant: '6812159d-496f-4d6f-bda4-507b870a38ad',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            ancestor: '20be11c5-bebe-476b-9ea8-15f83e6ed80b',   // Bin lvl #4
            descendant: '20be11c5-bebe-476b-9ea8-15f83e6ed80b',  
            length: 0,
            createdAt: new Date(),
            updatedAt: new Date()
     
        }], {});
    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('Workspace_node_closures', null, {});
    }
};
