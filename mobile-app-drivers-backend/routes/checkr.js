const Router = require("koa-router");

const checkr = new Router();
const models = require("../models");
const verifyDriver = require("./verifyId");
const timber = require("../logs/timber");

// Checkr Status
// sent: Background check sent to drivers email but application is still incomplete
// pending: Application completed but pending result of background report
// reportStatus: this is taken from checkr and either reports clear (cleared report) or consider (OXO needs to decide if OK to drive)

async function changeCheckr(events, candidateId, reportStatus) {
  const instance = await models.driver.findAll({
    where: { checkrID: candidateId }
  });
  if (events === "invitation.created") {
    instance[0].update({ checkr: "sent" });
  }
  if (events === "invitation.completed") {
    instance[0].update({ checkr: "pending" });
  }
  if (events === "report.completed") {
    instance[0].update({ checkr: reportStatus });
  }
}

checkr.post("/receiveWebhook", async (ctx, next) => {
  try {
    const { request } = ctx;
    const events = ctx.request.body.type;
    const candidateId = ctx.request.body.data.object.candidate_id;
    const reportStatus = ctx.request.body.data.object.status;
    changeCheckr(events, candidateId, reportStatus);
    ctx.body = { status: 200, success: true, message: "Success" };
  } catch (error) {
    console.log(error);
    ctx.body = {
      status: 503,
      success: false,
      message: "Internal error, please try again."
    };
  }
  await next();
});

checkr.get("/testEndpoint", async (ctx, next) => {
  ctx.body = "Hello, World!  This is the OXO API";
  await next();
});

checkr.get("/loadCheckrStatus/:id/:token", async (ctx, next) => {
  if (!(await verifyDriver(ctx.params.id, ctx.params.token))) {
    ctx.body = { success: false, error: "unauthorized" };
    ctx.status = 401;
    return;
  }
  const user = await models.driver.findAll({
    where: {
      id: ctx.params.id
    }
  });
  timber
    .info("loaded checkr status", {
      user: {
        id: ctx.params.id
      },
      source: "generated",
      created_in: "checkr_loadCheckrStatus",
      status: user[0].dataValues.checkr
    })
    .catch(error => {
      console.log(error);
    });

  ctx.body = { checkr: user[0].dataValues.checkr };
  await next();
});

module.exports = checkr;
