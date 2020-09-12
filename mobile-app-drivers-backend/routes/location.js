'use strict';

const Router = require('koa-router');
var dotenv = require('dotenv');
dotenv.config();

const verifyDriver = require('./verifyId');

const models = require('../models');
const location = new Router();
const timber = require('../logs/timber');

const Scaledrone = require('scaledrone-node-push');
const sd = new Scaledrone({
  channelId: 'fjiSVsyCb4xgahBA',
  secretKey: 'JRVv1MeOrReisMhaA3XTa84wQUHGoOS2',
});

/*
 * Called from background tasks installed on user's phone.
 * Updates the location of the user and streams this location to a Scaledrown channel with the name:
 * connectionID + _ + userID, if there is a live connection.
 * TODO: save this location for our own use, log on the drivers side and save on the owner side
 */
location.post('/locationUpdate', async (ctx, next) => {
  let { request } = ctx;
  try {
    if(!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = {success: false, error: 'unauthorized'};
      ctx.status = 401;
      return;
    }
    //Should have a better way of knowing current matches (THIS SHOULD USE CONNECTIONS)
    const connection = await models.connection.findAll({
      where: {
        status: 'CONFIRMED',
        driverID: ctx.request.body.id
      },
      attributes: [
          'id',
      ]
    })
    //Check whether the match is within the time limit
    // IE check that it is within 15 min from the start of the match.

    const liveID = connection[0].id;

    const message = request.body.payload[0].coords;
    const room = liveID+'_'+ctx.request.body.id;
    console.log('room', room);
    sd.publish(room, JSON.stringify(message), function(error) {
      // check for errors
    });
    //Handle location update handleVerifyCodeErrors
    timber.info(
  'updated location data', {
  user: {
    id: ctx.request.body.id,
    coords: message,
  },
  source: 'generated',
  created_in: 'location_updateLocation'}).catch(err => {
  console.log(err);
  } catch (error) {
    console.log(error);
    ctx.body = { success: false, message: "Internal error, please try again."};
  }
  const location = request.body.payload;
  next();
});

module.exports = location;
