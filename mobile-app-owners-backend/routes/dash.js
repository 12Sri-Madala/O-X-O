const Router = require("koa-router");

const dash = new Router();
const models = require("../models");
const verifyOwner = require("./verifyId");
const timber = require("../logs/timber");

const waitlistHelpers = require("../helpers/updateWaitlist");

function today() {
  const d = new Date();
  const month = d.getMonth() >= 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
  const day = d.getDate() >= 10 ? d.getDate() : `0${d.getDate()}`;
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

async function findDrivers(matches) {
  const driverIDs = [];
  Object.keys(matches).forEach(match => {
    const id = matches[match].dataValues.driverID;
    if (id && !driverIDs.includes(id)) {
      driverIDs.push(id);
    }
  });
  try {
    const drivers = await models.driver.findAll({
      where: {
        id: driverIDs
      },
      attributes: ["id", "firstName", "lastName", "profileImage"]
    });
    return drivers;
  } catch (error) {
    timber
      .error("Error in dash find drivers", {
        error: matches,
        created_in: "dash_get_findDrivers"
      })
      .catch(err => {
        console.log(err);
      });
    return { error };
  }
}

async function findVehicles(matches) {
  const vehicleIDs = [];
  Object.keys(matches).forEach(match => {
    const id = matches[match].dataValues.carID;
    if (id && !vehicleIDs.includes(id)) {
      vehicleIDs.push(id);
    }
  });
  try {
    if (vehicleIDs.length === 0) {
      const vehicles = [];
      return vehicles;
    }
    const vehicles = await models.vehicle.findAll({
      where: {
        id: vehicleIDs
      },
      attributes: ["id", "plateNumber", "make", "model"]
    });
    return vehicles;
  } catch (error) {
    timber
      .error("Error in dash", {
        error: matches,
        created_in: "dash_get_findVehicles"
      })
      .catch(err => {
        console.log(err);
      });
    return { error };
  }
}

dash.get("/:id/:token", async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.params.id, ctx.params.token))) {
      ctx.body = { success: false, error: "Unauthorized" };
      ctx.status = 401;
      return;
    }
    const owner = await models.owner.findAll({
      where: {
        id: ctx.params.id
      },
      attributes: ["id", "firstName", "lastName", "addresses"]
    });
    const matches = await models.match.findAll({
      where: {
        type: "OWNER",
        ownerID: ctx.params.id,
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
    timber.debug("Getting into this method...");
    if (matches.length === 0) {
      ctx.body = {
        success: false,
        error: `No driver with ID ${ctx.params.id} found`
      };
      return;
    }
    const drivers = await findDrivers(matches);
    if (drivers.error) {
      timber.debug("about to return driver error");
      ctx.status = 500;
      ctx.body = { success: false, error: drivers.error };
      return;
    }
    const vehicles = await findVehicles(matches);
    if (vehicles.error) {
      timber.debug("About to return vehicle error");
      ctx.status = 500;
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
      });
    ctx.body = {
      success: true,
      data: {
        owner,
        matches,
        drivers,
        vehicles
      }
    };
  } catch (matches) {
    timber
      .info("Error in dash", {
        error: matches,
        user: { id: ctx.params.id },
        source: "generated",
        created_in: "dash_get"
      })
      .catch(error => {
        console.log(error);
      });
    ctx.status = 500;
    ctx.body = { success: false, error: "Matches database fetch error" };
  }
  await next();
});

dash.post("/", async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.request.body.userId, ctx.request.body.token))) {
      ctx.body = { success: false, error: "Unauthorized" };
      ctx.status = 401;
      return;
    }
    let match = await models.match.findById(ctx.request.body.matchId);
    console.log(Object.keys(ctx.request.body.payload)[0]);
    if (Object.keys(ctx.request.body.payload)[0] === "pickupLocation") {
      ctx.request.body.payload.pickupLocation = {
        locale: "San Francisco",
        street: Object.values(ctx.request.body.payload)[0],
        longitude: 37.7749,
        latitude: -122.4194
      };
    }
    if (Object.keys(ctx.request.body.payload)[0] === "dropoffLocation") {
      ctx.request.body.payload.dropoffLocation = {
        locale: "San Francisco",
        street: Object.values(ctx.request.body.payload)[0],
        longitude: 37.7749,
        latitude: -122.4194
      };
    }
    match = await match.update(ctx.request.body.payload);

    waitlistHelpers.updateWaitlist(ctx.request.body.userId);
    ctx.body = { success: true, payload: match };
    timber
      .info("updated matches", {
        user: { id: ctx.request.body.userId },
        created_in: "dash_post",
        source: "generated",
        data: {
          matchId: ctx.request.body.matchId,
          ...ctx.request.body.payload
        }
      })
      .catch(error => {
        console.log(error);
      });
  } catch (error) {
    timber
      .error("error updating matches", {
        user: { id: ctx.request.body.userId },
        created_in: "dash_post",
        source: "generated"
      })
      .catch(err => {
        console.log(err);
      });
    console.log(error);
    ctx.body = { success: false, error };
  }
  await next();
});

module.exports = dash;
