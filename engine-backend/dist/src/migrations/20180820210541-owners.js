'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('owners', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            token: {
                type: Sequelize.STRING
            },
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            phoneNumber: {
                type: Sequelize.STRING
            },
            profileImage: {
                type: Sequelize.TEXT
            },
            email: {
                type: Sequelize.STRING
            },
            rating: {
                type: Sequelize.FLOAT
            },
            isDriver: {
                type: Sequelize.BOOLEAN
            },
            vehicles: {
                type: Sequelize.JSON
            },
            matches: {
                type: Sequelize.JSON
            },
            addresses: {
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
        return queryInterface.dropTable('owners');
    }
};
//# sourceMappingURL=20180820210541-owners.js.map