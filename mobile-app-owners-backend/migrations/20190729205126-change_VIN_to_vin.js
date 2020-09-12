'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.renameColumn('vehicles', 'VIN', 'vin');
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
            queryInterface.removeColumn('vehicles', 'vin');
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
