const dotenv = require("dotenv");

dotenv.config();
const Router = require("koa-router");

const models = require("../models");
const verifyDriver = require("./verifyId");

const vehiclesRouter = new Router();
const timber = require("../logs/timber");

const waitlistHelpers = require("../helpers/updateWaitlist");

vehiclesRouter.get("/:id/:token", async (ctx, next) => {
  try {
    if (!(await verifyDriver(ctx.params.id, ctx.params.token))) {
      ctx.body = { success: false, error: "Unauthorized" };
      ctx.status = 401;
      return;
    }
    const vehicles = await models.vehicle.findAll({
      where: {
        ownerID: ctx.params.id
      },
      attributes: [
        "id",
        "make",
        "model",
        "year",
        "vin",
        "plateNumber",
        "color",
        "companies",
        "ownerID",
        "vehicleImage",
        "inspectionImage",
        "insuranceImage",
        "licenseState",
        "numberDoors",
        "numberSeats"
      ]
    });
    const payload = {};
    vehicles.forEach((vehicle) => payload[vehicle.dataValues.id] = vehicle.dataValues); // eslint-disable-line
    timber
      .info("fetched profile", {
        user: {
          id: ctx.params.id
        },
        source: "generated",
        created_in: "vehicle_get"
      })
      .catch(err => {
        console.log(err);
        // At this point, your log is synced with Timber.io!
      });
    ctx.body = {
      success: true,
      payload
    };
  } catch (error) {
    timber
      .info("fetched profile", {
        error,
        user: {
          id: ctx.params.id
        },
        source: "generated",
        created_in: "vehicles_get"
      })
      .catch(err => {
        console.log(err);
        // At this point, your log is synced with Timber.io!
      });
    ctx.body = { success: false, error: "Vehicles database fetch error" };
  }
  await next();
});

vehiclesRouter.post("/", async (ctx, next) => {
  try {
    if (
      !(await verifyDriver(ctx.request.body.userId, ctx.request.body.token))
    ) {
      ctx.body = { success: false, error: "Unauthorized" };
      ctx.status = 401;
      return;
    }
    const changesvehicle = JSON.parse(ctx.request.body.payload);
    let vehicle;
    if (ctx.request.body.id) {
      vehicle = await models.vehicle.findById(ctx.request.body.id);
      vehicle = await vehicle.update(changesvehicle);
    } else {
      vehicle = await models.vehicle.create(changesvehicle);
    }
    waitlistHelpers.updateWaitlist(ctx.request.body.userId);

    timber
      .info("updated vehicles", {
        vehicle,
        user: {
          id: ctx.request.body.userId
        },
        source: "generated",
        created_in: "vehicles_post"
      })
      .catch(err => {
        console.log(err);
        // At this point, your log is synced with Timber.io!
      });
    ctx.body = { success: true, payload: vehicle };
  } catch (error) {
    timber
      .error("error updating vehicles", {
        error,
        user: {
          id: ctx.request.body.userId
        },
        source: "generated",
        created_in: "vehicles_post"
      })
      .catch(err => {
        console.log(err);
        // At this point, your log is synced with Timber.io!
      });
    ctx.body = { success: false, error };
  }
  await next();
});

module.exports = vehiclesRouter;
