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


       return queryInterface.bulkInsert('Users', [{
                uuid: '73ebadf2-49c2-4b05-8fad-66e49cabccf0',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@demo.com',
                password: '$argon2i$v=19$m=4096,t=3,p=1$nPmnXP4OJOUlduPN/U14jQ$WPokDd/SDQB3jMgVlMyWlga/mUWf81dS0P63lLnjZJw',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                uuid: '23feadg1-32f4-5b22-4fad-63e40cabaaa1',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'Jane@demo.com',
                password: '$argon2i$v=19$m=4096,t=3,p=1$nPmnXP4OJOUlduPN/U14jQ$WPokDd/SDQB3jMgVlMyWlga/mUWf81dS0P63lLnjZJw',
                type: 'basic',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                uuid: '312b1a65-38c1-43a6-b895-d1569277b71e',
                firstName: 'Jim',
                lastName: 'Doe',
                email: 'Jim@demo.com',
                password: '$argon2i$v=19$m=4096,t=3,p=1$nPmnXP4OJOUlduPN/U14jQ$WPokDd/SDQB3jMgVlMyWlga/mUWf81dS0P63lLnjZJw',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                uuid: '3be2e1db-7742-4a99-83d3-a8bdf91b37d4',
                firstName: 'Jill',
                lastName: 'Doe',
                email: 'Jill@demo.com',
                password: '$argon2i$v=19$m=4096,t=3,p=1$nPmnXP4OJOUlduPN/U14jQ$WPokDd/SDQB3jMgVlMyWlga/mUWf81dS0P63lLnjZJw',
                active: true,
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

       return queryInterface.bulkDelete('Users', null, {});
    }
};