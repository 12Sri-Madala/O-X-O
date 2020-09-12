
const Router = require('koa-router');
const dotenv = require('dotenv');

dotenv.config();

const Scaledrone = require('scaledrone-node-push');
const verifyOwner = require('./verifyId');

const models = require('../models');

const location = new Router();
const timber = require('../logs/timber');


const sd = new Scaledrone({
  channelId: 'fjiSVsyCb4xgahBA',
  secretKey: 'JRVv1MeOrReisMhaA3XTa84wQUHGoOS2',
});

/*
 * Returns: date formatted in mm/dd/yyyy format, will pad with 0 for singular months or days.
 */
function format(d) {
  const month = (d.getMonth() >= 9) ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
  const day = (d.getDate() >= 10) ? d.getDate() : `0${d.getDate()}`;
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

/*
 * Called from background tasks installed on user's phone.
 * Updates the location of the user and streams this location to a Scaledrown channel with the name:
 * connectionID + _ + userID, if there is a live connection.
 * TODO: save this location for our own use, log on the drivers side and save on the owner side
 */
location.post('/locationUpdate', async (ctx, next) => {
  const { request } = ctx;
  try {
    if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: 'unauthorized' };
      ctx.status = 401;
      return;
    }
    // Should have a better way of knowing current matches
    const connection = await models.connection.findAll({
      where: {
        status: 'CONFIRMED',
        ownerID: ctx.request.body.id,
        date: format(new Date()),
      },
      attributes: [
        'id', 'driverID',
      ],
    });
    // Check whether the match is within the time limit
    // IE check that it is within 15 min from the start of the match.

    const liveID = connection[0].id;

    const message = request.body.payload[0].coords;
    const room = `${liveID}_${request.body.id}`;
    console.log('room', room);
    sd.publish(room, JSON.stringify(message), (error) => {
      console.log('Error on publishing to the room', error);
    });

    timber.info(
      'updated location data', {
        user: {
          id: ctx.request.body.id,
          coords: message,
        },
        source: 'generated',
        created_in: 'location_updateLocation',
      },
    ).catch((err) => {
      console.log(err);
    });

    // Handle location update handleVerifyCodeErrors
  } catch (error) {
    timber.error('error updating location', {
      error,
      user: { id: ctx.request.body.id },
    });
    ctx.body = { success: false, message: 'Internal error, please try again.' };
    ctx.status = 500;
  }
  next();
});

module.exports = location;
