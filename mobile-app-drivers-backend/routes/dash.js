const Router = require("koa-router");

const dash = new Router();
const models = require("../models");
const verifyDriver = require("./verifyId");
const timber = require("../logs/timber");
const waitlistHelpers = require("../helpers/updateWaitlist");

function today() {
  const d = new Date();
  const month = d.getMonth() >= 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
  const day = d.getDate() >= 10 ? d.getDate() : `0${d.getDate()}`;
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

async function findOwners(matches) {
  const ownerIDs = [];
  for (const match in matches) {
    const id = matches[match].dataValues.ownerID;
    if (id && !ownerIDs.includes(id)) {
      ownerIDs.push(id);
    }
  }
  try {
    const owners = await models.owner.findAll({
      where: {
        id: ownerIDs
      },
      attributes: ["id", "firstName", "lastName", "profileImage"]
    });
    return owners;
  } catch (error) {
    timber.error("Error in owner fetch", {
      error,
      source: "generated",
      created_in: "dash_findOwners"
    });
    return { error };
  }
}

async function findVehicles(matches) {
  const vehicleIDs = [];
  for (const match in matches) {
    const id = matches[match].dataValues.carID;
    if (id && !vehicleIDs.includes(id)) {
      vehicleIDs.push(id);
    }
  }
  try {
    const vehicles = await models.vehicle.findAll({
      where: {
        id: vehicleIDs
      },
      attributes: [
        "id",
        "plateNumber",
        "make",
        "model",
        "year",
        "inspectionImage",
        "insuranceImage"
      ]
    });
    return vehicles;
  } catch (error) {
    timber.error("Error in vehicle fetch", {
      error,
      source: "generated",
      created_in: "dash_findVehicles"
    });
    console.log(error);
    return { error };
  }
}

dash.get("/:id/:token", async (ctx, next) => {
  if (!(await verifyDriver(ctx.params.id, ctx.params.token))) {
    ctx.body = { success: false, error: "Unauthorized" };
    ctx.status = 401;
    return;
  }
  try {
    const driverInfo = await models.driver.findOne({
      where: {
        id: ctx.params.id
      },
      attributes: ["id", "firstName", "lastName"]
    });
    const matches = await models.match.findAll({
      where: {
        type: "DRIVER",
        driverID: ctx.params.id,
        date: { $gte: today() }
      },
      order: [["date", "ASC"]],
      attributes: [
        "id",
        "current",
        "status",
        "pickupTime",
        "dropoffTime",
        "date",
        "pickupLocation",
        "dropoffLocation",
        "ownerID",
        "carID",
        "driverID",
        "driverRating",
        "carRating",
        "ownerTripRating",
        "driverTripRating",
        "pickStart",
        "pickEnd",
        "dropStart",
        "dropEnd",
        "updatedAt",
        "proxyNumber"
      ]
    });
    if (matches.length === 0) {
      ctx.body = {
        success: false,
        error: `No driver with ID ${ctx.params.id} found`
      };
      return;
    }
    const owners = await findOwners(matches);
    if (owners.error) {
      ctx.body = { success: false, error: owners.error };
      return;
    }
    const vehicles = await findVehicles(matches);
    if (vehicles.error) {
      ctx.body = { success: false, error: vehicles.error };
      return;
    }

    timber
      .info("fetched dash data", {
        user: { id: ctx.params.id },
        source: "generated",
        created_in: "dash_get"
      })
      .catch(err => {
        console.log(err);
        // At this point, your log is synced with Timber.io!
      });
    ctx.body = {
      success: true,
      data: {
        owners,
        matches,
        vehicles,
        driverInfo
      }
    };
  } catch (error) {
    console.log(error);
    timber
      .info("Error in dash", {
        error,
        user: { id: ctx.params.id },
        source: "generated",
        created_in: "dash_get"
      })
      .catch(error => {
        console.log(error);
      });
    ctx.body = { success: false, error: "Matches database fetch error" };
    ctx.status = 500;
  }
  await next();
});

dash.post("/", async (ctx, next) => {
  try {
    if (
      !(await verifyDriver(ctx.request.body.userId, ctx.request.body.token))
    ) {
      ctx.body = { success: false, error: "Unauthorized" };
      ctx.status = 401;
      return;
    }
    let match = await models.match.findById(ctx.request.body.matchId);
    console.log("success");
    match = await match.update(ctx.request.body.payload);

    waitlistHelpers.updateWaitlist(ctx.request.body.userId);

    // update the waitlist status

    timber
      .info("updated matches", {
        match,
        user: { id: ctx.params.id },
        source: "generated",
        created_in: "dash_get"
      })
      .catch(error => {
        console.log(error);
      });
    ctx.body = { success: true, payload: match };
  } catch (error) {
    console.log(error);
    ctx.body = { success: false, error };
  }
  await next();
});

module.exports = dash;
