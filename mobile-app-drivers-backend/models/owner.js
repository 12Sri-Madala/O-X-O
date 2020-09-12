const uuid = require("uuid/v4");

module.exports = (sequelize, DataTypes) => {
  const Owner = sequelize.define("owner", {
    id: {
      type: DataTypes.UUID,
      defaultType: DataTypes.UUIDV4,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING
    },
    deviceToken: {
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    profileImage: {
      type: DataTypes.TEXT
    },
    email: {
      type: DataTypes.STRING
    },
    rating: {
      type: DataTypes.FLOAT
    },
    isDriver: {
      type: DataTypes.BOOLEAN
    },
    vehicles: {
      type: DataTypes.JSON
    },
    matches: {
      type: DataTypes.JSON
    },
    addresses: {
      type: DataTypes.JSON
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    accountId: {
      type: DataTypes.STRING
    }
  });

  Owner.beforeCreate(owner => (owner.id = uuid()));

  return Owner;
};
