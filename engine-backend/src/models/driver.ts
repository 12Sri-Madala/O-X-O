export{}

const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {

  const Driver = sequelize.define('driver', {
    id: {
      type: DataTypes.UUID,
      defaultType: DataTypes.UUIDV4,
      primaryKey: true,
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
    phoneNumber: {
      type: DataTypes.STRING
    },
    profileImage: {
      type: DataTypes.TEXT
    },
    email: {
      type: DataTypes.STRING
    },
    license: {
      type: DataTypes.STRING
    },
    zipCode: {
      type: DataTypes.STRING
    },
    checkr: {
      type: DataTypes.STRING
    },
    checkrID: {
      type: DataTypes.STRING
    },
    rating: {
      type: DataTypes.INTEGER
    },
    isOwner: {
      type: DataTypes.BOOLEAN
    },
    customerID: {
      type: DataTypes.STRING
    },
    matches: {
      type: DataTypes.JSON
    },
    addresses: {
      type: DataTypes.JSON
    }
  });

  Driver.beforeCreate(driver => driver.id = uuid());

  return Driver;
}
