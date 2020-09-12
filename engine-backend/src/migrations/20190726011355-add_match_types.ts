'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('matches', 'connectionID', {
        type: Sequelize.UUID
      });
      await queryInterface.addColumn('matches', 'type', {
        type: Sequelize.STRING
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

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('matches', 'connectionID');
      await queryInterface.removeColumn('matches', 'type');
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
