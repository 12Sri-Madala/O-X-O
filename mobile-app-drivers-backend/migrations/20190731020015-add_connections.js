'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('matches', 'connectionID', {
        type: Sequelize.UUID
      });
      await queryInterface.addColumn('matches', 'type', {
        type: Sequelize.STRING
      });
      await queryInterface.createTable(
        'connections',
        {
          id: {
            type: DataTypes.UUID,
            defaultType: DataTypes.UUIDV4,
            primaryKey: true,
          },
          status: {
            type: DataTypes.STRING
          },
          driverID: {
            type: DataTypes.UUID
          },
          ownerID: {
            type: DataTypes.UUID
          },
          carID: {
            type: DataTypes.UUID
          },
          ownerMatchID: {
            type: DataTypes.UUID
          },
          driverMatchID: {
            type: DataTypes.UUID
          },
          pickupTime: {
            type: DataTypes.STRING
          },
          dropoffTime: {
            type: DataTypes.STRING
          },
          date: {
            type: DataTypes.STRING
          },
          pickupLocation: {
            type: DataTypes.JSON
          },
          dropoffLocation: {
            type: DataTypes.JSON
          },
          carRating: {
            type: DataTypes.FLOAT
          },
          driverRating: {
            type: DataTypes.FLOAT
          },
          ownerTripRating: {
            type: DataTypes.INTEGER
          },
          driverTripRating: {
            type: DataTypes.INTEGER
          },
          actualPickupTime: {
            type: DataTypes.STRING
          },
          actualDropoffTime: {
            type: DataTypes.STRING
          },
          paid: {
            type: DataTypes.STRING
          },
          paymentStatus: {
            type: DataTypes.STRING
          },
          createdAt: {
            type: DataTypes.DATE
          },
          updatedAt: {
            type: DataTypes.DATE
          }
        });
        return Promise.resolve();
      } catch(error){
        return Promise.reject();
      }
    },

    down: (queryInterface, Sequelize) => {
      try {
        await queryInterface.dropTable('connections');
        await queryInterface.removeColumn('matches', 'connectionID');
        await queryInterface.removeColumn('matches', 'type');

        return Promise.resolve();
      } catch(error){
        return Promise.reject(error);
      }

    }
  };
