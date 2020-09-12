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
exports.default = matches;
//# sourceMappingURL=matches.js.map