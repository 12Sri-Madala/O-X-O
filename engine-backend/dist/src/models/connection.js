"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require('uuid/v4');
module.exports = (sequelize, DataTypes) => {
    const Connection = sequelize.define('connection', {
        id: {
            type: DataTypes.UUID,
            defaultType: DataTypes.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING
        },
        driverID: {
            type: DataTypes.UUID
        },
        ownerID: {
            type: DataTypes.UUID
        },
        carID: {
            type: DataTypes.UUID
        },
        ownerMatchID: {
            type: DataTypes.UUID
        },
        driverMatchID: {
            type: DataTypes.UUID
        },
        pickupTime: {
            type: DataTypes.STRING
        },
        dropoffTime: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.STRING
        },
        pickupLocation: {
            type: DataTypes.JSON
        },
        dropoffLocation: {
            type: DataTypes.JSON
        },
        carRating: {
            type: DataTypes.FLOAT
        },
        driverRating: {
            type: DataTypes.FLOAT
        },
        ownerTripRating: {
            type: DataTypes.INTEGER
        },
        driverTripRating: {
            type: DataTypes.INTEGER
        },
        actualPickupTime: {
            type: DataTypes.STRING
        },
        actualDropoffTime: {
            type: DataTypes.STRING
        },
        paid: {
            type: DataTypes.STRING
        },
        paymentStatus: {
            type: DataTypes.STRING
        },
        canceledBy: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });
    Connection.beforeCreate(connection => connection.id = uuid());
    return Connection;
};
//# sourceMappingURL=connection.js.map