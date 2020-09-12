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
    vin: {
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
    ownerID: {
      type: DataTypes.UUID
    },
    vehicleImage: {
      type: DataTypes.TEXT
    },
    inspectionImage: {
      type: DataTypes.TEXT
    },
    insuranceImage: {
      type: DataTypes.TEXT
    },
    numberDoors: {
      type: DataTypes.INTEGER
    },
    numberSeats: {
      type: DataTypes.INTEGER
    },
    licenseState: {
      type: DataTypes.TEXT
    },
  });

  Vehicle.beforeCreate(vehicle => vehicle.id = uuid());

  return Vehicle;
}
