'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.createTable(
      'waitlists',
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        userID: {
          type: Sequelize.UUID
        },
        type: {
          type: Sequelize.STRING
        },
        status: {
          type: Sequelize.STRING
        },
        points: {
          type: Sequelize.INTEGER
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      }
      );
  },

  down: (queryInterface: any, Sequelize: any) => {
    queryInterface.dropTable('waitlists');
  }
};
