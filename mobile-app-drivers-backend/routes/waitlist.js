const Router = require("koa-router");
const timber = require("../logs/timber");
const verifyDriver = require("./verifyId");

// Provides endpoints to run the waitlist to allow users to sign up without being activated
const waitlist = new Router();

require("dotenv").config();
const models = require("../models");

// Get methods

/**
 * [waitlist_driver returns the waitlistEntry for the id]
 * @method waitlist_get
 * @param  '/id [id of the driver]
 * @return                    [waitlistEntry]
 */
waitlist.get("/:id/:token", async (ctx, next) => {
  if (!(await verifyDriver(ctx.params.id, ctx.params.token))) {
    ctx.body = { success: false, error: "unauthorized" };
    ctx.status = 401;
    return;
  }
  try {
    const waitlistEntry = await models.waitlist.findOne({
      where: {
        userID: ctx.params.id
      }
    });
    // Place in line
    if (waitlistEntry === null) {
      timber.error("Error retrieving from driver waitlist", {
        errorString: `waitlistEntry was null for driver: ${ctx.params.id}`,
        source: "generated",
        created_in: "waitlist_driver"
      });
      ctx.body = { success: true };
      await next();
    }
    // Place in line
    const percentile = await calculatePlaceInLine(waitlistEntry);

    const userActions = await getUserActions(waitlistEntry);
    timber.info("Retrieved waitlist status", {
      percentile,
      userActions,
      waitlistEntry,
      source: "generated",
      user: {
        id: ctx.params.id
      },
      created_in: "waitlist_driver"
    });
    ctx.body = {
      // percentile,
      percentile,
      userActions,
      waitlistEntry,
      success: true
    };
  } catch (error) {
    const errorSting = error.toString(); // errorString: TypeError: Cannot read property 'type' of null
    timber.error("Error retrieving from driver waitlist", {
      errorString: errorSting,
      source: "generated",
      created_in: "waitlist_driver"
    });
    ctx.body = { success: false, error: "Waitlist database fetch error" };
  }
  await next();
});

async function getUserActions(waitlistEntry) {
  const actions = [];

  const driver = await models.driver.findByPk(waitlistEntry.userID);

  // Do they have an email?
  actions.push({
    key: "email",
    description: "Add your email address",
    completion: driver.email ? "COMPLETE" : "NO", // NO, PARTIAL, COMPLETE
    route: "ProfilePage" // Where to reroute on click
  });

  // Indicate availability
  const matches = await models.match.findAll({
    where: {
      driverID: driver.id,
      current: true,
      status: "Available"
    }
  });
  actions.push({
    key: "availability",
    description: "Tell us when you want to drive",
    completion: matches.length > 0 ? "COMPLETE" : "NO", // NO, PARTIAL, COMPLETE
    route: "Dashboard" // Where to reroute on click
  });

  // Payment Info
  actions.push({
    key: "payment",
    description: "Add your payment details",
    completion: driver.customerID ? "COMPLETE" : "NO",
    route: "Payment"
  });
  return actions;
}

async function calculatePlaceInLine(waitlistEntry) {
  const totalCount = await models.waitlist.count({
    where: {
      type: waitlistEntry.type,
      status: "WAITLISTED"
    }
  });

  const place = await models.waitlist.count({
    where: {
      type: waitlistEntry.type,
      status: "WAITLISTED",
      points: {
        $lt: waitlistEntry.points
      }
    }
  });

  if (place + 1 === totalCount) {
    timber.info("Calculated place in line to be", {
      place,
      totalCount,
      totalPlace: 0.99,
      source: "generated"
    });

    return 0.99;
  }

  timber.info("Calculated place in line to be", {
    place,
    totalCount,
    totalPlace: place + 1 / totalCount,
    source: "generated"
  });

  return (place + 1) / totalCount;
}

module.exports = waitlist;
