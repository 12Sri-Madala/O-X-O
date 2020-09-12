'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'matches',
      {
        id: {
          primaryKey: true,
          type: Sequelize.UUID,
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING
        },
        current: {
          type: Sequelize.BOOLEAN
        },
        pickupTime: {
          type: Sequelize.STRING
        },
        dropoffTime: {
          type: Sequelize.STRING
        },
        date: {
          type: Sequelize.STRING
        },
        pickupLocation: {
          type: Sequelize.JSON
        },
        dropoffLocation: {
          type: Sequelize.JSON
        },
        ownerID: {
          type: Sequelize.UUID
        },
        carID: {
          type: Sequelize.UUID
        },
        driverID: {
          type: Sequelize.UUID
        },
        proxyNumber: {
          type: Sequelize.STRING
        },
        carRating: {
          type: Sequelize.FLOAT
        },
        driverRating: {
          type: Sequelize.FLOAT
        },
        ownerTripRating: {
          type: Sequelize.INTEGER
        },
        driverTripRating: {
          type: Sequelize.INTEGER
        },
        pickStart: {
          type: Sequelize.STRING
        },
        pickEnd: {
          type: Sequelize.STRING
        },
        dropStart: {
          type: Sequelize.STRING
        },
        dropEnd: {
          type: Sequelize.STRING
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('matches');
  }
};
