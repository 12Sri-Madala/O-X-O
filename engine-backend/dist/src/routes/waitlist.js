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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const timber = require('../logs/timber');
// Provides endpoints to run the waitlist to allow users to sign up without being activated
const waitlist = new koa_router_1.default();
require('dotenv').config();
const models = require('../models');
// Get methods
/**
 * [waitlist_owner returns the waitlistEntry for the ownerID]
 * @method waitlist_owner
 * @param  '/ownerID [id of the owner]
 * @return                    [waitlistEntry]
 */
waitlist.get('/owner/:ownerID', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let waitlistEntry = yield models.waitlist.findByPk(ctx.params.ownerID);
        timber.info('Retrieved waitlist status', {
            source: 'generated',
            user: {
                id: ctx.params.driverID
            },
            created_in: 'waitlist_owner'
        });
        ctx.body = {
            success: true,
            waitlistEntry: waitlistEntry,
        };
    }
    catch (error) {
        timber.error('Error retrieving from owner waitlist', {
            error,
            source: 'generated',
            created_in: 'waitlist_owner'
        });
        ctx.body = { success: false, error: 'Waitlist database fetch error' };
    }
    yield next();
}));
//Update endpoints
waitlist.post('/update', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = ctx.request.body.id;
        timber.debug('The id is', {
            userID: id.toString(),
            source: 'generated',
        });
        let exists = yield models.waitlist.count({
            where: {
                userID: id,
            }
        });
        let waitlistEntry;
        if (exists > 0) {
            timber.info('entering exists already...');
            waitlistEntry = yield models.waitlist.findOne({
                where: {
                    userID: id,
                }
            });
        }
        else {
            //newEntry
            const newEntry = {
                userID: id,
                type: ctx.request.body.type,
                status: 'WAITLISTED',
                points: 0,
                updatedAt: new Date(),
            };
            waitlistEntry = yield models.waitlist.create(newEntry);
        }
        //New point total
        const newPoints = yield calculateTotalPoints(waitlistEntry);
        waitlistEntry.update({ points: newPoints }); //Check this line
        console.log('Getting here');
        timber.info('simple');
        timber.info('pretty simple', {
            source: 'generated',
            waitlistEntry: 'hello',
        });
        timber.info('Retrieved waitlist status WITHJSON', {
            waitlistEntry: JSON.stringify(waitlistEntry),
            source: 'generated',
            user: {
                id,
            },
            created_in: 'waitlist_driver'
        });
        timber.info('Retrieved waitlist status NO ENTRY', {
            source: 'generated',
            user: {
                id,
            },
            created_in: 'waitlist_driver'
        });
        timber.info('Retrieved waitlist status WITH ID', {
            waitlistEntry: waitlistEntry.id,
            source: 'generated',
            user: {
                id,
            },
            created_in: 'waitlist_driver'
        });
        console.log('Getting after the logs');
        ctx.body = {
            success: true,
            waitlistEntry: waitlistEntry,
        };
    }
    catch (error) {
        console.log(error);
        console.log(typeof (error));
        console.log(error.toString());
        const errorString = error.toString();
        console.log(errorString);
        timber.error('Error retrieving from driver waitlist', {
            errorString: errorString,
            source: 'generated',
            created_in: 'waitlist_driver',
        });
        ctx.body = { success: false, error: 'Waitlist database fetch error' };
    }
    yield next();
}));
function calculateTotalPoints(waitlistEntry) {
    return __awaiter(this, void 0, void 0, function* () {
        if (waitlistEntry.type === 'DRIVER') {
            //Calculate driver points
            let points = 0;
            const driver = yield models.driver.findByPk(waitlistEntry.userID);
            //Checkr
            //Added email
            if (driver.email !== null) {
                points += 1;
            }
            //added profileImage
            if (driver.profileImage) {
                points += 2;
            }
            //TODO: double check checkr statuses
            switch (driver.checkr) {
                case 'sent':
                    points += 2;
                case 'clear':
                    points += 5;
            }
            //Added license number
            if (driver.license) {
                points += 2;
            }
            //Added a payment method
            if (driver.customerID) {
                points += 5;
            }
            //If they have availability
            const count = yield models.match.count({
                where: {
                    driverID: waitlistEntry.userID,
                    status: 'Available'
                }
            });
            if (count > 1) {
                points += 2;
            }
            timber.info('Calculated point total', {
                source: 'generated',
                created_in: 'waitlist_calculateTotalPoints',
                user: {
                    points,
                    id: waitlistEntry.userID,
                    type: 'DRIVER'
                }
            });
            return points;
        }
        else if (waitlistEntry.type === 'OWNER') {
            //Calculate owner points
            let points = 0;
            let owner = yield models.owner.findByPk(waitlistEntry.userID);
            if (owner.accountId) {
                points += 5;
            }
            if (owner.profileImage) {
                points += 2;
            }
            if (owner.email) {
                points += 1;
            }
            if (owner.addresses) {
                points += 2;
            }
            const vehicles = yield models.vehicle.findAll({
                where: {
                    ownerID: waitlistEntry.userID
                }
            });
            //Examining the vehicle
            if (vehicles.length > 0) {
                points += 2;
                const vehicle = vehicles[0];
                if (vehicle.vehicleImage) {
                    points += 2;
                }
                if (vehicle.insepectionImage) {
                    points += 2;
                }
                if (vehicle.insuranceImage) {
                    points += 2;
                }
            }
            //If they have availability
            const count = yield models.match.count({
                where: {
                    ownerID: waitlistEntry.userID,
                    status: 'Available'
                }
            });
            if (count > 1) {
                points += 2;
            }
            timber.info('Calculated point total', {
                source: 'generated',
                created_in: 'waitlist_calculateTotalPoints',
                user: {
                    points,
                    id: waitlistEntry.userID,
                    type: 'OWNER'
                }
            });
            return points;
        }
    });
}
exports.default = waitlist;
//# sourceMappingURL=waitlist.js.map