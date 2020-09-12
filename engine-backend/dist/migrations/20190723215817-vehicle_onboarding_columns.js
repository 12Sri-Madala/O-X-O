'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield queryInterface.addColumn('vehicles', 'ownerID', {
                type: Sequelize.UUID
            });
            yield queryInterface.addColumn('vehicles', 'vehicleImage', {
                type: Sequelize.TEXT
            });
            yield queryInterface.addColumn('vehicles', 'inspectionImage', {
                type: Sequelize.TEXT
            });
            yield queryInterface.addColumn('vehicles', 'insuranceImage', {
                type: Sequelize.TEXT
            });
            yield queryInterface.addColumn('vehicles', 'licenseState', {
                type: Sequelize.TEXT
            });
            yield queryInterface.addColumn('vehicles', 'numberDoors', {
                type: Sequelize.INTEGER
            });
            yield queryInterface.addColumn('vehicles', 'numberSeats', {
                type: Sequelize.INTEGER
            });
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(error);
        }
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
    }),
    down: (queryInterface, Sequelize) => {
        try {
            queryInterface.removeColumn('vehicles', 'ownerID');
            queryInterface.removeColumn('vehicles', 'vehicleImage');
            queryInterface.removeColumn('vehicles', 'inspectionImage');
            queryInterface.removeColumn('vehicles', 'insuranceImage');
            queryInterface.removeColumn('vehicles', 'numberDoors');
            queryInterface.removeColumn('vehicles', 'numberSeats');
            queryInterface.removeColumn('vehicles', 'licenseState');
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(error);
        }
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.dropTable('users');
        */
    }
};
//# sourceMappingURL=20190723215817-vehicle_onboarding_columns.js.map