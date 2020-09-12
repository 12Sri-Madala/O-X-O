const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {

  const Match = sequelize.define('match', {
    id: {
      type: DataTypes.UUID,
      defaultType: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING
    },
    current: {
      type: DataTypes.BOOLEAN
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
    ownerID: {
      type: DataTypes.UUID
    },
    carID: {
      type: DataTypes.UUID
    },
    proxyNumber: {
      type: DataTypes.STRING
    },
    driverID: {
      type: DataTypes.UUID
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
    pickStart: {
      type: DataTypes.STRING
    },
    pickEnd: {
      type: DataTypes.STRING
    },
    dropStart: {
      type: DataTypes.STRING
    },
    dropEnd: {
      type: DataTypes.STRING
    },
    paid: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    connectionID: {
      type: DataTypes.UUID,
    }
  });

  Match.beforeCreate(match => match.id = uuid());

  return Match;
}
