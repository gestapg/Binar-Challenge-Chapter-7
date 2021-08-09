'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rooms', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      player1Id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      player2Id: {
        type: Sequelize.UUID,
      },
      player1Choices: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['', '', ''],
      },
      player2Choices: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['', '', ''],
      },
      matchInfo: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['', '', '', '', '', ''],
      },
      winnerId: {
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rooms');
  },
};
