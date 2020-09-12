'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('vehicles', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
            },
            make: {
                type: Sequelize.STRING
            },
            model: {
                type: Sequelize.STRING
            },
            year: {
                type: Sequelize.INTEGER
            },
            VIN: {
                type: Sequelize.STRING
            },
            plateNumber: {
                type: Sequelize.STRING
            },
            color: {
                type: Sequelize.STRING
            },
            companies: {
                type: Sequelize.JSON
            },
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('vehicles');
    }
};
//# sourceMappingURL=20180820213540-vehicles.js.map