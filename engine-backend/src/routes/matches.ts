'use strict';
import Router from 'koa-router';
const matches = new Router();
// Load environment variables from .env file

require('dotenv').config();
const models = require('../models');

// we pass in a specific date of the matches we want and either 'OWNER' or 'DRIVER' as the type
// returns all of the matches on that specific date
matches.get('/matchlist/:type/:date', async (ctx, next) => {
    let newdate:Date = new Date(ctx.params.date);
    let month:string = (newdate.getMonth() >= 9) ? `${newdate.getMonth()+1}` : `0${newdate.getMonth()+1}`;
    let day:string = (newdate.getDate() >= 10) ? `${newdate.getDate()}` : `0${newdate.getDate()}`;
    let year:string = `${newdate.getFullYear()}`;
    let correctDate:string = `${month}/${day}/${year}`;
    try {
        let matches = await models.match.findAll({
            where: {
                type: ctx.params.type.toUpperCase(),
                date: correctDate,
            },
            order: [['date', 'ASC']],
            attributes: [
                'id','current','status','pickupTime','dropoffTime','date','pickupLocation','dropoffLocation',
                'ownerID','carID','driverID','driverRating','carRating','ownerTripRating',
                'driverTripRating','pickStart','pickEnd','dropStart','dropEnd','updatedAt', 'proxyNumber'
            ]
        });
        ctx.body = {
            success: true,
            matches: matches.map(match => {
                let matchData = match.dataValues;
                if (matchData.pickupLocation) matchData.pickupLocation = matchData.pickupLocation.street;
                if (matchData.dropoffLocation) matchData.dropoffLocation = matchData.dropoffLocation.street;
                const times = ['pickStart', 'pickEnd', 'dropStart', 'dropEnd', 'pickupTime', 'dropoffTime'];
                for (let time of times) {
                    if (matchData[time]) {
                        let hour = `${new Date(matchData[time]).getHours()}`;
                        let minute = `${new Date(matchData[time]).getMinutes()}`;
                        minute = Number(minute) < 10 ? `0${minute}` : `${minute}`;
                        matchData[time] = hour + ':' + minute;
                    }
                }
                return matchData}),
            }
        }
    catch {
        console.log('error');
        ctx.body = {success: false, error: 'Matches database fetch error'};
    }
    await next();
});



export default matches;
