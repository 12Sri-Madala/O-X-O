// const koaRequest = require('koa-http-request');
const Router = require("koa-router");

const payments = new Router();
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.stripeSK);
const verifyDriver = require("./verifyId");
const timber = require("../logs/timber");
const waitlistHelpers = require("../helpers/updateWaitlist");

// Load environment variables from .env file

dotenv.config();

const models = require("../models");

payments.get("/stripe/getCards/:id/:token/:customerID", async (ctx, next) => {
  if (!(await verifyDriver(ctx.params.id, ctx.params.token))) {
    ctx.body = { success: false, error: "unauthorized" };
    ctx.status = 401;
    return;
  }
  try {
    const stripe = require("stripe")(process.env.stripeSK);
    const customer = await stripe.customers.retrieve(ctx.params.customerID);
    timber.info("fetched stripe credit cards", {
      user: { id: ctx.params.id },
      created_in: "payments_stripe_getCards",
      source: "generated"
    });
    ctx.body = {
      cards: customer.sources.data,
      defaultCard: customer.default_source
    };
  } catch (error) {
    timber.error("error fetching stripe credit cards", {
      error,
      user: { id: ctx.params.id },
      created_in: "payments_stripe_getCards",
      source: "generated"
    });
  }

  await next();
});

payments.get("/stripe/getCustomerID/:id/:token", async (ctx, next) => {
  if (!(await verifyDriver(ctx.params.id, ctx.params.token))) {
    ctx.body = { success: false, error: "unauthorized" };
    ctx.status = 401;
    return;
  }
  try {
    const user = await models.driver.findAll({
      where: {
        id: ctx.params.id
      }
    });
    timber.info("fetched stripe customerID", {
      user: { id: ctx.params.id },
      created_in: "payments_stripe_getCustomerID",
      source: "generated"
    });
    ctx.body = { customerID: user[0].dataValues.customerID };
  } catch (error) {
    timber.error("error fetching stripe customerID", {
      user: { id: ctx.params.id },
      created_in: "payments_stripe_getCustomerID",
      source: "generated"
    });
  }

  await next();
});

/*
 * Description: Use a card token to create a new Stripe customer
 * Arguments: ctx.body => contains the login token and the payload which contains
 * the customer's name and cardToken (tok_...)
 * Returns: ctx.body => contains all customer information
 */
payments.post("/stripe/createCustomer", async (ctx, next) => {
  if (!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
    ctx.body = { success: false, error: "unauthorized" };
    ctx.status = 401;
    return;
  }
  try {
    const { request } = ctx;
    const stripe = require("stripe")(process.env.stripeSK);
    const customer = await stripe.customers.create({
      description: request.body.payload.name,
      source: request.body.payload.token
    });
    ctx.body = customer;

    waitlistHelpers.updateWaitlist(ctx.request.body.id);
  } catch (error) {
    timber.error("Error creating a customer", {
      errorString: error.toString(),
      source: "generated"
    });
    ctx.body = {
      error,
      success: false
    };
  }
  await next();
});

/*
 * Description: Change the default credit card for a user
 * Arguments: ctx.body => contains the login token and the payload which contains
 * customerID and cardToken (card_...)
 * Returns: ctx.body => contains all customer information
 */
payments.post("/stripe/changeDefaultCard", async (ctx, next) => {
  if (!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
    ctx.body = { success: false, error: "unauthorized" };
    ctx.status = 401;
    return;
  }
  const { request } = ctx;
  const stripe = require("stripe")(process.env.stripeSK);
  const customer = await stripe.customers.update(
    request.body.payload.customerID,
    {
      default_source: request.body.payload.token
    }
  );
  ctx.body = customer;
  await next();
});

payments.post("/stripe/deleteCard", async (ctx, next) => {
  if (!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
    ctx.body = { success: false, error: "unauthorized" };
    ctx.status = 401;
    return;
  }
  const { request } = ctx;
  const stripe = require("stripe")(process.env.stripeSK);
  const customer = await stripe.customers.deleteSource(
    request.body.payload.customerID,
    request.body.payload.token
  );
  ctx.body = customer;
  await next();
});

/*
 * Description: Add a new credit card to a user
 * Arguments: ctx.body => contains the login token and the payload which contains
 * customerID and cardToken (tok_...)
 * Returns: ctx.body => contains all customer information
 */
payments.post("/stripe/addCardToUser", async (ctx, next) => {
  if (!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
    ctx.body = { success: false, error: "unauthorized" };
    ctx.status = 401;
    return;
  }
  const { request } = ctx;
  try {
    const customer = await stripe.customers.createSource(
      request.body.payload.customerID,
      {
        source: request.body.payload.token
      }
    );
  } catch (error) {
    timber.error("error adding card", {
      error,
      source: "generated",
      created_in: "payments_stripe_addCardToUser"
    });
    ctx.body = { success: false, error: "bad card" };
    ctx.status = 403;
    return;
  }
  ctx.body = { success: true };

  // Update waitlist status
  waitlistHelpers.updateWaitlist(ctx.request.body.id);

  await next();
});

/*
 * Description: Use a customer id to charge a Stripe customer
 * Arguments: ctx.body => contains the login token, and the payload which is the
 * customer id, the amount, the currency, and the description of the purchase
 * Returns: ctx.body => contains all information about the charge or the reason
 * it didn't go through
 */
payments.post("/stripe/chargeCustomer", async (ctx, next) => {
  if (!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
    ctx.body = { success: false, error: "unauthorized" };
    ctx.status = 401;
    return;
  }
  const { request } = ctx;
  const stripe = require("stripe")(process.env.stripeSK);
  const charge = await stripe.charges.create({
    amount: request.body.payload.amount,
    currency: request.body.payload.currency,
    customer: request.body.payload.customer,
    description: request.body.payload.description
  });
  if (charge.outcome.network_status === "approved_by_network") {
    ctx.body = charge;
  } else {
    ctx.body = charge.outcome.reason;
  }
}),
  (module.exports = payments);

// /*
// * Description: Test method to generate card tokens
// * Arguments: ctx.body => contains card number, expiration month/year, cvc, and user name
// * Returns: ctx.body => card token for this information
// */
// payments.post('/stripe/createToken', async (ctx, next) => {
//   let { request } = ctx;
//   var stripePK = require("stripe-client")(process.env.stripePK);
//   const token = await stripePK.createToken({
//     number: request.body.number,
//     exp_month: request.body.exp_month,
//     exp_year: request.body.exp_year,
//     cvc: request.body.cvc,
//     name: request.body.name
//   });
//   ctx.body = token;
// }),
