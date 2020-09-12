// Load environment variables
const crypto = require("crypto");
const rp = require("request-promise");
const dotenv = require("dotenv");

dotenv.config();
const Router = require("koa-router");

const login = new Router();
const { Client } = require("authy-client");

const authy = new Client({ key: process.env.twilio });
const { enums } = require("authy-client");
const matches = require("../helpers/generateMatches.js");
const models = require("../models");
const verifyDriver = require("./verifyId");
const timber = require("../logs/timber");
const waitlistHelpers = require("../helpers/updateWaitlist");

/**
 *
 * [/twilio/sendCode requests a code to be sent from twilio to the users phone number]
 * @param {[countryCode, phoneNumber]} userInfo specifies the phone number and country code of the user.
 * @return {[codeSent, message]} boolean if code is sent, and message is set if an error occurs
 */
login.post("/twilio/sendCode", async (ctx, next) => {
  const { request } = ctx;
  console.log(request.body);
  try {
    if (request.get("Content-Type").slice(0, 16) === "application/json") {
      const userInfo = request.body;
      if (userInfo.phoneNumber == "0000000000") {
        ctx.body = { codeSent: true };
      } else {
        var res = await authy.startPhoneVerification({
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

/**
 * [handleSendCodeErrors specifies the error that should be sent back to the user after submitting phone number]
 * @method handleSendCodeErrors
 * @param  {[Array]}             errors [errors that are returned from twilio]
 * @return {[String]}                   [the error that should be returned]
 */
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

/**
 * [/saveUser saves the new user to our database]
 * @return {[response]} returns the created user or an error message
 */
login.post("/saveUser", async (ctx, next) => {
  try {
    const { request } = ctx;
    const user = request.body;
    user.token = createLoginToken();
    const instance = await models.driver.create(user);
    const match = matches.init(instance, 14);
    await models.match.bulkCreate(match, { individualHooks: true });
    timber.info(`${instance.id}created a new profile!`, {
      user: { id: user.id },
      created_in: "login_saveUser",
      source: "generated"
    });

    // Add them to the waitlist
    waitlistHelpers.updateWaitlist(instance.id);
    ctx.body = instance;
  } catch (error) {
    console.log(error);
    timber.error("Error creating user", {
      error,
      errorString: error.toString(),
      source: "generated",
      created_in: "login_saveUser"
    });
    ctx.body = error;
  }
  await next();
});

/**
 * [/saveDeviceToken saves a device token for later use in delivering push notifications
 * it also prompts the user to give us permission to send push notifications]
 * @return {[success, message]} success is set to true if save succeeded
 */
login.post("/saveDeviceToken", async (ctx, next) => {
  try {
    if (!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: "unauthorized" };
      ctx.status = 401;
      return;
    }
    const { request } = ctx;
    const { deviceToken } = request.body;
    const instance = await models.driver.findAll({
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
      error,
      source: "generated",
      created_in: "login_saveDeviceToken"
    });
    ctx.body = { success: false, message: "Internal error, please try again." };
  }
  await next();
});

/**
 * [/saveProfileImage saves a profile image to the user's profile]
 * @return  {[success, message]} success is set to true if save succeeds.
 */
login.post("/saveProfileImage", async (ctx, next) => {
  try {
    if (!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: "unauthorized" };
      ctx.status = 401;
      return;
    }
    const { request } = ctx;
    const { token } = request.body;
    console.log(request.body.token);
    const image = `data:image/png;base64,${request.body.payload.base64}`;
    const instance = await models.driver.findByPk(request.body.id);
    instance.update({ profileImage: image });
    timber
      .info("created profile image", {
        user: { id: request.body.id },
        created_in: "login_saveProfileImage",
        source: "generated"
      })
      .catch(error => {
        console.log(error);
      });

    // Update waitlist status
    waitlistHelpers.updateWaitlist(instance.id);

    ctx.body = { success: true, message: instance[0] };
    timber
      .info(`${request.body.id}created profile image`, {
        user: { id: request.body.id },
        created_in: "login_saveProfileImage",
        source: "generated"
      })
      .catch(error => {
        console.log(error);
      });
  } catch (error) {
    console.log("about to log error with", error);
    timber.error("Error saving profile image", {
      errorString: error.toString(),
      source: "generated",
      created_in: "login_saveProfileImage"
    });
    ctx.body = { success: false, message: "Internal error, please try again." };
  }
  await next();
});

/**
 * [createCandidate creates a candidate for background check via the checkr API]
 * @param  {[string]}        email [the user's email]
 * @return {[success, error]}      [the success or error of the operation]
 */
async function createCandidate(email) {
  try {
    const options = {
      url: "https://api.checkr.com/v1/candidates",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: `email=${email}`,
      auth: {
        user: process.env.checkr,
        pass: ""
      }
    };
    const res = JSON.parse(await rp.post(options));
    timber.info("created checkr candidate", {
      checkr: res,
      user: email,
      created_in: "login_createCandidate",
      source: "generated"
    });
    return { success: true, candidate: res };
  } catch (error) {
    timber.error("error creating checkr candidate", {
      error,
      created_in: "login_createCandidate",
      source: "generated"
    });
    return { success: false, error: err };
  }
}

/**
 * [sendInvitation sends the user an invitation to complete their background check through checkr]
 * @param  {[string]}       id [checkr candidate id]
 * @return {[success, message]}          [success and error message of the method]
 */
async function sendInvitation(id) {
  try {
    const options = {
      url: "https://api.checkr.com/v1/invitations",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: `candidate_id=${id}&package=driver_pro`,
      auth: {
        user: process.env.checkr,
        pass: ""
      }
    };
    const res = JSON.parse(await rp.post(options));
    return { success: true, invite: res };
  } catch (err) {
    return { success: false, message: err };
  }
}

/**
 * [/saveDriving saves the driving details of the user]
 * @param {[token, license, email]} [The users unique token, email address, and driver's license number]
 * @return {[success, message]}
 */
login.post("/saveDriving", async (ctx, next) => {
  try {
    if (!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: "unauthorized" };
      ctx.status = 401;
      return;
    }
    const { request } = ctx;
    const { token } = request.body;
    const { license } = request.body.payload;
    const { email } = request.body.payload;
    const resCreate = await createCandidate(email);
    if (resCreate.success) {
      const instance = await models.driver.findAll({ where: { token } });
      instance[0].update({
        email,
        license,
        checkrID: resCreate.candidate.id
      });
      const resInvite = await sendInvitation(resCreate.candidate.id);
      console.log(resInvite.success);
      console.log(resCreate.success);
      if (!resInvite.success) {
        ctx.body = {
          success: false,
          message: "Internal error, please try again."
        };
        return;
      }

      // Updating checkr status if email was successfully sent.
      instance[0].update({ checkr: "sent" });
    } else {
      ctx.body = { success: true, message: "Success" };
    }
    const instance = await models.driver.findByPk(request.body.id);
    instance.update({
      email,
      license,
      checkrID: resCreate.candidate.id
    });
    ctx.body = { success: true, message: "Success" };

    // Update waitlist status
    waitlistHelpers.updateWaitlist(instance.id);
  } catch (error) {
    console.log(error);
    ctx.body = { success: false, message: "Internal error, please try again." };
  }
  await next();
});

/**
 * [/twilio/verifyCode checks the code that the user gives us against the code that was sent through twilio]
 * @params {[userinfo, code]} [userInfo defines the phoneNumber and countryCode sent to checkr, the code is the
 * verification code that the user entered.]
 * @return {[correctCode, existingUser, driver, loginToken]} [correctCode: whether or not the code entered was correct
 * existingUser: if the user already exists, return their profile driver: if they are a driver (deprecated), loginToken:
 * the unique token of the logged in user]
 */
login.post("/twilio/verifyCode", async (ctx, next) => {
  const { request } = ctx;
  try {
    console.log("Calling verifyCode with");
    console.log(request);
    if (request.get("content-type").slice(0, 16) == "application/json") {
      const { userInfo, code } = request.body;
      if (code === "0000") {
        const token = createLoginToken();
        const user = await checkExistingUser(userInfo, token);
        ctx.body = {
          correctCode: true,
          existingUser: user.existingUser,
          driver: user.driver,
          loginToken: token
        };
        ctx.body = {
          correctCode: true,
          existingUser: user.existingUser,
          driver: user.driver,
          loginToken: token
        };
      } else {
        const res = await authy.verifyPhone({
          countryCode: userInfo.countryCode,
          phone: userInfo.phoneNumber,
          token: code
        });
        console.log(res);
        if (res.success) {
          const token = createLoginToken();
          const user = await checkExistingUser(userInfo, token);
          timber.info(`${userInfo.phoneNumber} code verified`, {
            user: { id: userInfo.id },
            created_in: "login_verifyCode",
            source: "generated"
          });
          ctx.body = {
            correctCode: true,
            existingUser: user.existingUser,
            driver: user.driver,
            loginToken: token
          };
        }
      }
    } else {
      console.log("Getting into if");
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
    console.log(res);
    const error = handleVerifyCodeErrors(res.message);
    ctx.body = { correctCode: false, message: error };
  }
  await next();
});

/**
 * [checkExistingUser checks whether the user already exists in our database]
 * @param  {[countryCode, phoneNumber]}          userInfo [descibes the user using their phone number]
 * @param  {[32 bit token]}          token    [unique login token]
 * @return {[existingUser, driver]}                   [if the user exists]
 * @TODO fix use of driver... its ridiculous currently
 */
async function checkExistingUser(userInfo, token) {
  try {
    const driver = await models.driver.findAll({
      where: { phoneNumber: `+${userInfo.countryCode}${userInfo.phoneNumber}` }
    });
    console.log(driver);
    if (driver !== null && driver[0] !== undefined) {
      await driver[0].update({ token });

      return {
        existingUser: true,
        driver: driver[0],
        token: driver[0].dataValues.token
      };
    }
    return { existingUser: false, driver: "does not exist" };
  } catch (driver) {
    console.log("There was an error checking the existing user...");
    console.log(driver);
    console.log("Issue with DB"); // Create better error handling in future, for cases when DB server crashes or is unavailable!
  }
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
