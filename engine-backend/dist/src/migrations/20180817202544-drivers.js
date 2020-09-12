'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('drivers', {
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
            phoneNumber: {
                type: Sequelize.STRING
            },
            profileImage: {
                type: Sequelize.TEXT
            },
            email: {
                type: Sequelize.STRING
            },
            license: {
                type: Sequelize.STRING
            },
            zipCode: {
                type: Sequelize.STRING
            },
            checkr: {
                type: Sequelize.STRING
            },
            checkrID: {
                type: Sequelize.STRING
            },
            rating: {
                type: Sequelize.FLOAT
            },
            isOwner: {
                type: Sequelize.BOOLEAN
            },
            customerID: {
                type: Sequelize.STRING
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
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('drivers');
    }
};
//# sourceMappingURL=20180817202544-drivers.js.map