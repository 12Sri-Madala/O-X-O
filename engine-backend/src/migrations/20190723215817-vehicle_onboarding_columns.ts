'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('vehicles', 'ownerID', {
        type: Sequelize.UUID
      });
      await queryInterface.addColumn('vehicles', 'vehicleImage', {
        type: Sequelize.TEXT
      });
      await queryInterface.addColumn('vehicles', 'inspectionImage', {
        type: Sequelize.TEXT
      });
      await queryInterface.addColumn('vehicles', 'insuranceImage', {
        type: Sequelize.TEXT
      });
      await queryInterface.addColumn('vehicles', 'licenseState', {
        type: Sequelize.TEXT
      });
      await queryInterface.addColumn('vehicles', 'numberDoors', {
        type: Sequelize.INTEGER
      });
      await queryInterface.addColumn('vehicles', 'numberSeats', {
        type: Sequelize.INTEGER
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    try {
      queryInterface.removeColumn('vehicles', 'ownerID');
      queryInterface.removeColumn('vehicles', 'vehicleImage');
      queryInterface.removeColumn('vehicles', 'inspectionImage');
      queryInterface.removeColumn('vehicles', 'insuranceImage');
      queryInterface.removeColumn('vehicles', 'numberDoors');
      queryInterface.removeColumn('vehicles', 'numberSeats');
      queryInterface.removeColumn('vehicles', 'licenseState');
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }

    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
