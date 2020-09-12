'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('connections', 'driverMatchID', {
        type: Sequelize.UUID
      });
      await queryInterface.addColumn('connections', 'ownerMatchID', {
        type: Sequelize.UUID
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('connections', 'driverMatchID');
      await queryInterface.removeColumn('connections', 'ownerMatchID');
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
};
