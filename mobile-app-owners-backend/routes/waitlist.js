
const Router = require('koa-router');
const timber = require('../logs/timber');
const verifyOwner = require('./verifyId');

// Provides endpoints to run the waitlist to allow users to sign up without being activated
const waitlist = new Router();

require('dotenv').config();
const models = require('../models');

// Get methods

/**
* [waitlist_owner returns the waitlistEntry for the id]
* @method waitlist_get
* @param  '/id [id of the owner]
* @return                    [waitlistEntry]
*/
waitlist.get('/:id/:token', async (ctx, next) => {
  if (!(await verifyOwner(ctx.params.id, ctx.params.token))) {
    ctx.body = { success: false, error: 'unauthorized' };
    ctx.status = 401;
    return;
  }
  try {
    const waitlistEntry = await models.waitlist.findOne({
      where: {
        userID: ctx.params.id,
      }
        });

      if(waitlistEntry === null){
        timber.error('Error retrieving from owner waitlist', {
          errorString: `waitlistEntry was null for owner: ${ctx.params.id}`,
          source: 'generated',
          created_in: 'waitlist_owner'
        });
        ctx.body = { success: true };
        await next();
      }
    //Place in line
    const percentile = await calculatePlaceInLine(waitlistEntry);

    const userActions = await getUserActions(waitlistEntry);
    timber.info('Retrieved waitlist status', {
      percentile,
      userActions,
      waitlistEntry,
      source: 'generated',
      user: {
        id: ctx.params.id,
      },
      created_in: 'waitlist_owner',
    });
    ctx.body = {
      percentile,
      userActions,
      waitlistEntry,
      success: true,
    };
  } catch (error) {
    const errorSting = error.toString();
    console.log(errorSting);
    timber.error('Error retrieving from owner waitlist', {
      errorString: errorSting,
      source: 'generated',
      created_in: 'waitlist_owner',
    });
    ctx.body = { success: false, error: 'Waitlist database fetch error' };
  }
  await next();
});

async function getUserActions(waitlistEntry) {
  const actions = [];

  const owner = await models.owner.findByPk(waitlistEntry.userID);
  const vehicles = await models.vehicle.findAll({
    where: {
      ownerID: waitlistEntry.userID,
    },
  });

  // Do they have an email?
  actions.push({
    key: 'vehicle',
    description: 'Add a car',
    completion: vehicles.length > 0 ? 'COMPLETE' : 'NO', // NO, PARTIAL, COMPLETE
    route: 'ProfilePage', // Where to reroute on click
  });

  // Indicate availability
  const matches = await models.match.findAll({
    where: {
      ownerID: owner.id,
      current: true,
      status: 'Available',
    },
  });
  actions.push({
    key: 'availability',
    description: 'Tell us when your car is parked',
    completion: matches.length > 0 ? 'COMPLETE' : 'NO', // NO, PARTIAL, COMPLETE
    route: 'Dashboard', // Where to reroute on click
  });

  // Payment Info
  actions.push({
    key: 'payment',
    description: 'Add your payment details',
    completion: owner.accountId ? 'COMPLETE' : 'NO',
    route: 'Payment',
  });
  return actions;
}

async function calculatePlaceInLine(waitlistEntry) {
  const totalCount = await models.waitlist.count({
    where: {
      type: waitlistEntry.type,
      status: 'WAITLISTED',
    },
  });

  const place = await models.waitlist.count({
    where: {
      type: waitlistEntry.type,
      status: 'WAITLISTED',
      points: {
        $lt: waitlistEntry.points,
      },
    },
  });

  timber.info('Calculated place in line to be', {
    place,
    totalCount,
    totalPlace: (place + 1) / totalCount,
    source: 'generated',
  });

  return (place + 1) / totalCount;
}

module.exports = waitlist;
