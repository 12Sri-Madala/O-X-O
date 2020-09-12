'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('connections', {
            id: {
                type: Sequelize.UUID,
                defaultType: Sequelize.UUIDV4,
                primaryKey: true,
            },
            status: {
                type: Sequelize.STRING
            },
            driverID: {
                type: Sequelize.UUID
            },
            ownerID: {
                type: Sequelize.UUID
            },
            carID: {
                type: Sequelize.UUID
            },
            pickupTime: {
                type: Sequelize.STRING
            },
            dropoffTime: {
                type: Sequelize.STRING
            },
            date: {
                type: Sequelize.STRING
            },
            pickupLocation: {
                type: Sequelize.JSON
            },
            dropoffLocation: {
                type: Sequelize.JSON
            },
            carRating: {
                type: Sequelize.FLOAT
            },
            driverRating: {
                type: Sequelize.FLOAT
            },
            ownerTripRating: {
                type: Sequelize.INTEGER
            },
            driverTripRating: {
                type: Sequelize.INTEGER
            },
            actualPickupTime: {
                type: Sequelize.STRING
            },
            actualDropoffTime: {
                type: Sequelize.STRING
            },
            paid: {
                type: Sequelize.STRING
            },
            paymentStatus: {
                type: Sequelize.STRING
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
        return queryInterface.dropTable('connections');
    }
};
//# sourceMappingURL=20190726001626-add_connection_model.js.map