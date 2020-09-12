const dotenv = require("dotenv");

dotenv.config();
const Router = require("koa-router");

const models = require("../models");
const verifyOwner = require("./verifyId");

const address = new Router();
const timber = require("../logs/timber");
const waitlistHelpers = require("../helpers/updateWaitlist");

address.get("/:id/:token", async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.params.id, ctx.params.token))) {
      ctx.body = { success: false, error: "Unauthorized" };
      ctx.status = 401;
      return;
    }
    const owner = await models.owner.findOne({
      where: {
        id: ctx.params.id
      }
    });
    timber
      .info("fetched addresses", {
        user: {
          id: ctx.params.id
        },
        addresses: owner.dataValues.addresses,
        source: "generated",
        created_in: "address_get"
      })
      .catch(error => {
        console.log(error);
      });
    ctx.body = { success: true, addresses: owner.dataValues.addresses };
  } catch (error) {
    timber.error(error);
    ctx.body = { success: false, error };
  }
  await next();
});

address.post("/saveAddress", async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: "unauthorized" };
      ctx.status = 401;
      return;
    }
    const { request } = ctx;
    const { token } = request.body;
    const instance = await models.owner.findOne({ where: { token } });
    instance.update({ addresses: request.body.payload });
    timber
      .info("saved addresses", {
        user: {
          id: ctx.params.id
        },
        source: "generated",
        created_in: "address_get",
        addresses: request.body.payload
      })
      .catch(error => {
        console.log(error);
      });
    waitlistHelpers.updateWaitlist(instance.id);

    ctx.body = { addresses: instance[0].dataValues.addresses, success: true };
  } catch (error) {
    timber.error(error);
    ctx.body = { success: false, message: "Internal error, please try again." };
  }
  await next();
});

module.exports = address;
