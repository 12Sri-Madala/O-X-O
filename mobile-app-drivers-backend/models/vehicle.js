const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {

  const Vehicle = sequelize.define('vehicle', {
    id: {
      type: DataTypes.UUID,
      defaultType: DataTypes.UUIDV4,
      primaryKey: true,
    },
    make: {
      type: DataTypes.STRING
    },
    model: {
      type: DataTypes.STRING
    },
    year: {
      type: DataTypes.INTEGER
    },
    VIN: {
      type: DataTypes.STRING
    },
    plateNumber: {
      type: DataTypes.STRING
    },
    color: {
      type: DataTypes.STRING
    },
    companies: {
      type: DataTypes.JSON
    },
  });

  Vehicle.beforeCreate(vehicle => vehicle.id = uuid());

  return Vehicle;
}
