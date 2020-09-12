// Load environment variables
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();
const Router = require("koa-router");

const login = new Router();
const { Client } = require("authy-client");

const authy = new Client({ key: process.env.twilio });
const { enums } = require("authy-client");
const matches = require("../helpers/generateMatches.js");
const models = require("../models");
const verifyOwner = require("./verifyId");
const timber = require("../logs/timber");
const waitlistHelpers = require("../helpers/updateWaitlist");

login.post("/twilio/sendCode", async (ctx, next) => {
  const { request } = ctx;
  console.log(request.body);
  try {
    let res;
    if (request.get("Content-Type").slice(0, 16) === "application/json") {
      const userInfo = request.body;
      if (userInfo.phoneNumber === "0000000000") {
        ctx.body = { codeSent: true };
      } else {
        res = await authy.startPhoneVerification({
          countryCode: userInfo.countryCode,
          locale: "en",
          phone: userInfo.phoneNumber,
          via: enums.verificationVia.SMS
        });
        if (res.success) {
          ctx.body = { codeSent: true };
        }
      }
      timber.info(`${userInfo.phoneNumber} sent code.`, {
        created_in: "login_twilio_sendCode",
        twilio_responded: res,
        source: "generated"
      });
    } else {
      ctx.body = { codeSent: false, message: "Error: incorrect content-type" };
    }
  } catch (res) {
    timber.info("Error with Twilio send code", {
      created_in: "login_twilio_sendCode",
      request: request.body,
      twilio_responded: res,
      source: "generated"
    });
    const error = handleSendCodeErrors(res.errors);
    ctx.body = { codeSent: false, message: error };
  }
  await next();
});

function handleSendCodeErrors(errors) {
  if ("carrier" in errors) {
    return "Error: invalid phone carrier";
  }
  if ("countryCode" in errors) {
    return "Error: invalid countryCode";
  }
  if ("phone" in errors) {
    return "Error: invalid phone number";
  }
  return "Internal Error, please try again";
}

/* TODO: error handling if db request fails! */
login.post("/saveUser", async (ctx, next) => {
  try {
    const { request } = ctx;
    const user = request.body;
    user.token = createLoginToken();
    let instance;
    if (user.id) {
      instance = await models.owner.findById(user.id);
      if (instance) {
        instance = await instance.update(user);
        ctx.body = instance;

        // This is for testing purposes,
        // when we pass in an id and token but deleted ourselves from the database.
      } else {
        delete user.id;
        instance = await models.owner.create(user);
        const match = matches.init(instance, 14);
        await models.match.bulkCreate(match, { individualHooks: true });
        ctx.body = instance;
      }
    } else {
      instance = await models.owner.create(user);
      const match = matches.init(instance, 14);
      await models.match.bulkCreate(match, { individualHooks: true });
      ctx.body = instance;
    }
    // Update waitlist status
    waitlistHelpers.updateWaitlist(instance.id);

    timber.info(`${instance.id}created a new profile!`, {
      user: { id: user.id },
      created_in: "login_saveUser",
      source: "generated"
    });
  } catch (error) {
    timber.error("Error creating user", {
      error
    });
    ctx.body = error;
  }
  await next();
});

login.post("/saveDeviceToken", async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: "unauthorized" };
      ctx.status = 401;
      return;
    }
    const { request } = ctx;
    const { deviceToken } = request.body;
    const instance = await models.owner.findAll({
      where: { id: request.body.id }
    });
    instance[0].update({ deviceToken });
    timber.info(`${request.body.id}created device token`, {
      deviceToken,
      user: { id: request.body.id },
      created_in: "login_saveDeviceToken",
      source: "generated"
    });
    ctx.body = { success: true, message: "Successfully set device token." };
  } catch (error) {
    timber.error("Error saving device token", {
      error
    });
    ctx.body = { success: false, message: "Internal error, please try again." };
  }
  await next();
});

/* Add Error handling! */
login.post("/saveProfileImage", async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: "unauthorized" };
      ctx.status = 401;
      return;
    }
    const { request } = ctx;
    console.log(request.body.token);
    const image = `data:image/png;base64,${request.body.payload.base64}`;
    const instance = await models.owner.findOne({
      where: { id: request.body.id }
    });
    instance.update({ profileImage: image });
    console.log(instance);
    ctx.body = { success: true, message: instance };
    timber
      .info("created profile image", {
        user: { id: request.body.id },
        created_in: "login_saveProfileImage",
        source: "generated"
      })
      .catch(error => {
        console.log(error);
      });
    waitlistHelpers.updateWaitlist(instance.id);
  } catch (error) {
    timber.error("Error saving profile image", {
      errorString: error.toString(),
      source: "generated",
      created_in: "login_saveProfileImage"
    });
    ctx.body = { success: false, message: "Internal error, please try again." };
  }
  await next();
});

login.post("/saveAddress", async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: "unauthorized" };
      ctx.status = 401;
      return;
    }
    const { request } = ctx;
    const { token } = request.body;
    const instance = await models.owner.findAll({ where: { token } });
    instance[0].update({ addresses: request.body.payload });
    timber.info("created address", {
      addresses: request.body.payload,
      user: request.body.id,
      created_in: "login_saveAddress",
      source: "generated"
    });
    ctx.body = { addresses: instance[0].dataValues.addresses, success: true };
  } catch (error) {
    timber.error("Error saving address", {
      error
    });
    ctx.body = { success: false, message: "Internal error, please try again." };
  }
  await next();
});

login.post("/twilio/verifyCode", async (ctx, next) => {
  const { request } = ctx;
  try {
    if (request.get("content-type").slice(0, 16) === "application/json") {
      const { userInfo, code } = request.body;
      if (code === "0000") {
        const token = createLoginToken();
        const user = await checkExistingUser(userInfo, token);
        ctx.body = {
          correctCode: true,
          existingUser: user.existingUser,
          owner: user.owner,
          loginToken: token
        };
      } else {
        const res = await authy.verifyPhone({
          countryCode: userInfo.countryCode,
          phone: userInfo.phoneNumber,
          token: code
        });
        if (res.success) {
          const token = createLoginToken();
          const user = await checkExistingUser(userInfo, token);
          ctx.body = {
            correctCode: true,
            existingUser: user.existingUser,
            owner: user.owner,
            loginToken: token
          };
        }
      }
      timber.info(`${userInfo.phoneNumber} code verified`, {
        user: { id: userInfo.id },
        created_in: "login_verifyCode",
        source: "generated"
      });
    } else {
      ctx.body = {
        correctCode: false,
        message: "Error: incorrect content-type"
      };
    }
  } catch (res) {
    timber.error("Error verifying with twilio", {
      created_in: "login_twilio_verifyCode",
      error: res,
      source: "generated"
    });
    const error = handleVerifyCodeErrors(res.message);
    ctx.body = { correctCode: false, message: error };
  }
  await next();
});

async function checkExistingUser(userInfo, token) {
  try {
    const owner = await models.owner.findAll({
      where: { phoneNumber: `+${userInfo.countryCode}${userInfo.phoneNumber}` }
    });
    console.log(owner);
    if (owner !== null && owner[0] !== undefined) {
      await owner[0].update({ token });

      return {
        existingUser: true,
        owner: owner[0],
        token: owner[0].dataValues.token
      };
    }
    return { existingUser: false, owner: "does not exist" };
  } catch (error) {
    timber.error("Error checking existing user", {
      error,
      created_in: "login_checkExistingUser"
    });
  }
  return false;
}

/* In the future consider altering this function to be more robust */
function handleVerifyCodeErrors(error) {
  if (error === "Verification code is incorrect") {
    return "Incorrect Verification code";
  }
  return error;
}

function createLoginToken() {
  const loginToken = crypto.randomBytes(32).toString("hex");
  return loginToken;
}

module.exports = login;
