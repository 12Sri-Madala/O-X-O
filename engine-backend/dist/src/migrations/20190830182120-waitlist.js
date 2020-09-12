'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('waitlists', {
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
        });
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable('waitlists');
    }
};
//# sourceMappingURL=20190830182120-waitlist.js.map