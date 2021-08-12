'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        id: '06896bd4-8cbc-48c6-8c46-9364a6d939c4',
        username: 'admin',
        email: 'admin@admin.com',
        password:
          '$2b$10$/jAVQe8ZpthhRvgLYWAIG./ACvAgehDCOwSw1/9mOAQLqfyPNiBN2', // password = admin
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
