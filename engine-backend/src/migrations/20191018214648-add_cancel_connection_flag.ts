'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('connections', 'canceledBy', {
        type: Sequelize.STRING
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('connections', 'canceledBy');
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
};
