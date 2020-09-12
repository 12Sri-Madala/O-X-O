"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
module.exports = (sequelize, DataTypes) => {
    const Waitlist = sequelize.define('waitlist', {
        id: {
            type: DataTypes.UUID,
            defaultType: DataTypes.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING //WAITLISTED, DENIED, ACTIVATED
        },
        userID: {
            type: DataTypes.UUID
        },
        points: {
            type: DataTypes.INTEGER
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    });
    Waitlist.beforeCreate((waitlistEntry) => waitlistEntry.id = v4_1.default());
    return Waitlist;
};
//# sourceMappingURL=waitlist.js.map