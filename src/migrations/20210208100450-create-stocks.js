'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        // primaryKey: true,
        type: Sequelize.INTEGER
      },
      SYMBOL: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      NAME: {
        type: Sequelize.STRING,
      },
      SERIES: {
        type: Sequelize.STRING
      },
      OPEN: {
        type: Sequelize.STRING
      },
      HIGH: {
        type: Sequelize.STRING
      },
      LOW: {
        type: Sequelize.STRING
      },
      CLOSE: {
        type: Sequelize.STRING
      },
      LAST: {
        type: Sequelize.STRING
      },
      PREVCLOSE: {
        type: Sequelize.STRING
      },
      TOTTRDQTY: {
        type: Sequelize.STRING
      },
      TOTTRDVAL: {
        type: Sequelize.STRING
      },
      TIMESTAMP: {
        type: Sequelize.STRING
      },
      TOTALTRADES: {
        type: Sequelize.STRING
      },
      ISIN: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stocks');
  }
};