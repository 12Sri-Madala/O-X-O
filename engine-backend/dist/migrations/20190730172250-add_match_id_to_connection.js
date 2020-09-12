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
            yield queryInterface.addColumn('connections', 'driverMatchID', {
                type: Sequelize.UUID
            });
            yield queryInterface.addColumn('connections', 'ownerMatchID', {
                type: Sequelize.UUID
            });
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(error);
        }
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield queryInterface.removeColumn('connections', 'driverMatchID');
            yield queryInterface.removeColumn('connections', 'ownerMatchID');
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(error);
        }
    })
};
//# sourceMappingURL=20190730172250-add_match_id_to_connection.js.map