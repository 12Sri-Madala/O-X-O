
// const koaRequest = require('koa-http-request');
const Router = require('koa-router');

const payments = new Router();
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.stripeSK);
const verifyOwner = require('./verifyId');
const timber = require('../logs/timber');


// Load environment variables from .env file

dotenv.config();

const models = require('../models');

payments.post('/stripe/payCustomer', async (ctx, next) => {
  if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
    ctx.body = { success: false, error: 'unauthorized' };
    ctx.status = 401;
    return;
  }
  try {
    const { request } = ctx;
    const payout = await stripe.payouts.create({
      amount: request.body.payload.amount,
      currency: request.body.payload.currency,
      description: request.body.payload.description,
    });
    // FIGURE OUT WHAT ACTUALLY TO DO WITH PAYOUT OBJECT, WHAT DO WE NEED TO CHECK?
    timber.info(
      'paid customer', {
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'payments_payCustomer',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
  } catch (error) {
    timber.error(
      'error paying customer', {
        error,
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'payments_payCustomer',

      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
  }

  await next();
});

payments.post('/stripe/captureCharge', async (ctx, next) => {
  if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
    ctx.body = { success: false, error: 'unauthorized' };
    ctx.status = 401;
    return;
  }
  try {
    const { request } = ctx;
    // Should we be waiting on this?
    const res = await stripe.charges.capture(request.body.chargeId);
    timber.info(
      'captured charge', {
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'payments_captureCharge',
        charge: res,
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
  } catch (error) {
    timber.error(
      'error capturing charge', {
        error,
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'payments_payCustomer',

      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
  }

  await next();
});

payments.post('/stripe/saveOwner/', async (ctx, next) => {
  if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
    ctx.body = { success: false, error: 'unauthorized' };
    ctx.status = 401;
    return;
  }
  try {
    const { request } = ctx;

    const authCreds = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_secret: process.env.stripeSK,
        code: request.body.code,
        grant_type: 'authorization_code',
      }),
    }).then((response) => response.json()).then((responseJson) => responseJson);

    const user = await models.owner.findById(request.body.id);

    user.update({
      accountId: authCreds.stripe_user_id,
    });

    timber.info(
      'saved owner', {
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'payments_saveOwner',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
  } catch (error) {
    timber.error(
      'error saving owner', {
        error,
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'payments_saveOwner',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
    ctx.body = { success: false, error: 'save Owner failed' };
  }
  await next();
});

payments.post('/stripe/getAccount', async (ctx, next) => {
  if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
    ctx.body = { success: false, error: 'unauthorized' };
    ctx.status = 401;
    return;
  }
  try {
    let accountId = await models.owner.findAll({
      where: {
        id: ctx.request.body.id,

      },
      attributes: [
        'accountId',
      ],
    });
    accountId = accountId[0].dataValues.accountId;
    if (!accountId) {
      ctx.body = { success: true, accounts: null };
      return;
    }
    const accounts = await stripe.accounts.retrieve(accountId);
    timber.info(
      'fetched stripe account', {
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'payments_getAccount',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
    ctx.body = { success: true, accounts: accounts.external_accounts };
  } catch (error) {
    timber.error(
      'error fetching account', {
        error,
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'payments_getAccount',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
    ctx.body = { success: false, error: 'get Account failed' };
  }
  await next();
});

payments.post('/stripe/dashboard', async (ctx, next) => {
  if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
    ctx.body = { success: false, error: 'unauthorized' };
    ctx.status = 401;
    return;
  }
  try {
    let accountId = await models.owner.findAll({
      where: {
        id: ctx.request.body.id,

      },
      attributes: [
        'accountId',
      ],
    });
    accountId = accountId[0].dataValues.accountId;
    const loginlink = await stripe.accounts.createLoginLink(accountId);

    timber.info(
      'fetched stripe dashboard', {
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'payments_stripe_dashboard',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });

    ctx.body = { success: true, login: loginlink };
  } catch (error) {
    timber.info(
      'error fetching stripe dashboard', {
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'payments_stripe_dashboard',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
    ctx.body = { success: false, error: 'nav to Stripe Dash failed' };
  }
  await next();
});

module.exports = payments;
