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
const matches = new koa_router_1.default();
// Load environment variables from .env file
require('dotenv').config();
const models = require('../models');
// we pass in a specific date of the matches we want and either 'OWNER' or 'DRIVER' as the type
// returns all of the matches on that specific date
matches.get('/matchlist/:type/:date', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let newdate = new Date(ctx.params.date);
    let month = (newdate.getMonth() >= 9) ? `${newdate.getMonth() + 1}` : `0${newdate.getMonth() + 1}`;
    let day = (newdate.getDate() >= 10) ? `${newdate.getDate()}` : `0${newdate.getDate()}`;
    let year = `${newdate.getFullYear()}`;
    let correctDate = `${month}/${day}/${year}`;
    try {
        let matches = yield models.match.findAll({
            where: {
                type: ctx.params.type.toUpperCase(),
                date: correctDate,
            },
            order: [['date', 'ASC']],
            attributes: [
                'id', 'current', 'status', 'pickupTime', 'dropoffTime', 'date', 'pickupLocation', 'dropoffLocation',
                'ownerID', 'carID', 'driverID', 'driverRating', 'carRating', 'ownerTripRating',
                'driverTripRating', 'pickStart', 'pickEnd', 'dropStart', 'dropEnd', 'updatedAt', 'proxyNumber'
            ]
        });
        ctx.body = {
            success: true,
            matches: matches.map(match => {
                let matchData = match.dataValues;
                if (matchData.pickupLocation)
                    matchData.pickupLocation = matchData.pickupLocation.street;
                if (matchData.dropoffLocation)
                    matchData.dropoffLocation = matchData.dropoffLocation.street;
                const times = ['pickStart', 'pickEnd', 'dropStart', 'dropEnd', 'pickupTime', 'dropoffTime'];
                for (let time of times) {
                    if (matchData[time]) {
                        let hour = `${new Date(matchData[time]).getHours()}`;
                        let minute = `${new Date(matchData[time]).getMinutes()}`;
                        minute = Number(minute) < 10 ? `0${minute}` : `${minute}`;
                        matchData[time] = hour + ':' + minute;
                    }
                }
                return matchData;
            }),
        };
    }
    catch (_a) {
        console.log('error');
        ctx.body = { success: false, error: 'Matches database fetch error' };
    }
    yield next();
}));
matches.post('/makeMatch/:driverMatchID/:ownerMatchID', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let driverMatch = yield models.match.findByPk(ctx.params.driverMatchID);
        let ownerMatch = yield models.match.findByPk(ctx.params.ownerMatchID);
        let vehicles = yield models.vehicle.findAll({
            where: {
                ownerID: ownerMatch.ownerID
            }
        });
        const vehicle = vehicles[0];
        // Validate that these matches have not already been matched
        const newConnection = {
            status: 'MATCHED',
            pickupTime: ownerMatch.pickStart,
            dropoffTime: ownerMatch.dropStart,
            date: ownerMatch.date,
            pickupLocation: ownerMatch.pickupLocation,
            dropoffLocation: ownerMatch.dropoffLocation,
            ownerID: ownerMatch.ownerID,
            driverID: driverMatch.driverID,
            ownerMatchID: ownerMatch.id,
            driverMatchID: driverMatch.id,
            carID: vehicle.id,
            carRating: ownerMatch.carRating,
            driverRating: driverMatch.driverRating,
            driverConfirmation: 'UNCONFIRMED',
            ownerConfirmation: 'CONFIRMED',
        };
        const connection = yield models.connection.create(newConnection);
        const connectionID = connection.id;
        console.log('The connectionID is', connectionID);
        //Write the newConnectionID back to both matches
        ownerMatch.update({
            connectionID: connectionID,
            status: 'Confirmed',
            driverID: driverMatch.driverID,
            carID: vehicle.id
        });
        driverMatch.update({
            connectionID: connectionID,
            status: 'Matched',
            carID: vehicle.id,
            ownerID: ownerMatch.ownerID
        });
        ctx.body = {
            success: true
        };
    }
    catch (error) {
        ctx.body = { success: false, error: error, status: 500 };
        console.log(error);
    }
    yield next();
}));
matches.post('/makeTestMatch/:driverID/:ownerID', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newdate = new Date();
        let month = (newdate.getMonth() >= 9) ? `${newdate.getMonth() + 1}` : `0${newdate.getMonth() + 1}`;
        let day = (newdate.getDate() >= 10) ? `${newdate.getDate()}` : `0${newdate.getDate()}`;
        let year = `${newdate.getFullYear()}`;
        let correctDate = `${month}/${day}/${year}`;
        let driver = yield models.driver.findOne({
            where: {
                id: ctx.params.driverID
            }
        });
        let owner = yield models.owner.findOne({
            where: {
                id: ctx.params.ownerID
            }
        });
        let dummyVehicle = {
            make: 'Tesla',
            model: 'Model 3',
            year: 2018,
            vin: '010101JOINOXO10101',
            plateNumber: 'JOINOXO',
            color: 'white',
            companies: null,
            ownerID: ctx.params.ownerID,
            vehicleImage: null,
            inspectionImage: null,
            insurangeImage: null,
            numberDoors: 4,
            numberSeats: 5,
            licenseState: 'CA'
        };
        const vehicle = yield models.vehicle.create(dummyVehicle);
        owner.update({
            vehicles: vehicle.id
        });
        let testOwnerMatch = yield models.match.findOne({
            where: {
                date: correctDate,
                ownerID: owner.id
            },
            attributes: [
                'id', 'current', 'status', 'pickupTime', 'dropoffTime', 'date', 'pickupLocation', 'dropoffLocation',
                'ownerID', 'carID', 'driverID', 'driverRating', 'carRating', 'ownerTripRating',
                'driverTripRating', 'pickStart', 'pickEnd', 'dropStart', 'dropEnd', 'updatedAt', 'proxyNumber'
            ]
        });
        if (!testOwnerMatch.pickupLocation || !testOwnerMatch.dropoffLocation) {
            testOwnerMatch.update({
                pickupLocation: { "locale": "San Francisco", "street": "181 2nd Street, San Francisco, CA, USA", "longitude": 37.7749, "latitude": -122.4194 },
                dropoffLocation: { "locale": "San Francisco", "street": "181 2nd Street, San Francisco, CA, USA", "longitude": 37.7749, "latitude": -122.4194 }
            });
        }
        ;
        let testDriverMatch = yield models.match.findOne({
            where: {
                date: correctDate,
                driverID: driver.id
            },
            attributes: [
                'id', 'current', 'status', 'pickupTime', 'dropoffTime', 'date', 'pickupLocation', 'dropoffLocation',
                'ownerID', 'carID', 'driverID', 'driverRating', 'carRating', 'ownerTripRating',
                'driverTripRating', 'pickStart', 'pickEnd', 'dropStart', 'dropEnd', 'updatedAt', 'proxyNumber'
            ]
        });
        if (!testDriverMatch.pickupLocation || !testDriverMatch.dropoffLocation) {
            testDriverMatch.update({
                pickupLocation: { "locale": "San Francisco", "street": "181 2nd Street, San Francisco, CA, USA", "longitude": 37.7749, "latitude": -122.4194 },
                dropoffLocation: { "locale": "San Francisco", "street": "181 2nd Street, San Francisco, CA, USA", "longitude": 37.7749, "latitude": -122.4194 }
            });
        }
        ;
        if (testOwnerMatch.status === 'Available' || testDriverMatch.status === 'Available') {
            const newConnection = {
                status: 'CONFIRMED',
                pickupTime: testOwnerMatch.pickStart,
                dropoffTime: testOwnerMatch.dropStart,
                date: testOwnerMatch.date,
                pickupLocation: testOwnerMatch.pickupLocation,
                dropoffLocation: testOwnerMatch.dropoffLocation,
                ownerID: testOwnerMatch.ownerID,
                driverID: testDriverMatch.driverID,
                ownerMatchID: testOwnerMatch.id,
                driverMatchID: testDriverMatch.id,
                carID: vehicle.id,
                carRating: testOwnerMatch.carRating,
                driverRating: testDriverMatch.driverRating,
                driverConfirmation: 'CONFIRMED',
                ownerConfirmation: 'CONFIRMED',
            };
            const connection = yield models.connection.create(newConnection);
            const connectionID = connection.id;
            console.log('The newly made connection is: ', connection);
            //Write the newConnectionID back to both matches
            testOwnerMatch.update({
                connectionID: connectionID,
                status: 'Confirmed',
                driverID: testDriverMatch.driverID,
                carID: vehicle.id
            });
            testDriverMatch.update({
                connectionID: connectionID,
                status: 'Matched',
                carID: vehicle.id,
                ownerID: testOwnerMatch.ownerID
            });
        }
        ;
        ctx.body = {
            success: true,
            testDriverMatch: testDriverMatch,
            testOwnerMatch: testOwnerMatch,
        };
    }
    catch (error) {
        ctx.body = { success: false, error: error, status: 500 };
        console.log(error);
    }
    yield next();
}));
matches.post('/updateConnection', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield models.connection.findOne({
            where: {
                id: "d4d62edf-beb6-402c-b20d-dd7fd762a3f4",
            },
        });
        connection.update({
            staus: 'CONFIRMED'
        });
        ctx.body = {
            success: true
        };
    }
    catch (error) {
        ctx.body = { success: false, error: error, status: 500 };
        console.log(error);
    }
    yield next();
}));
exports.default = matches;
//# sourceMappingURL=matches.js.map