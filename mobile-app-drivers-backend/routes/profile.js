
const dotenv = require('dotenv');

dotenv.config();
const Router = require('koa-router');
const verifyDriver = require('./verifyId');

const profile = new Router();
const models = require('../models');
const timber = require('../logs/timber');

profile.get('/:id/:token', async (ctx, next) => {
  try {
    if (!(await verifyDriver(ctx.params.id, ctx.params.token))) {
      ctx.body = { success: false, error: 'unauthorized' };
      ctx.status = 401;
      return;
    }
    ctx.body = { success: true, profile: null };
    const instance = await models.driver.findOne({
      where: { id: ctx.params.id },
      attributes: [
        'firstName', 'lastName', 'phoneNumber', 'checkrID', 'checkr', 'addresses', 'profileImage', 'email',
      ],
    });
    timber.info(
      'fetched profile', {
        profile: instance.toString(),
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'profile_load',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
    ctx.body = { success: true, profile: instance };
    await next();
  } catch (error) {
    timber.error(
      'error fetching profile', {
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'profile_load',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
    ctx.body = { success: false, error };
  }
});

profile.post('/update', async (ctx, next) => {
  try {
    if (!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: 'unauthorized' };
      ctx.status = 401;
      return;
    }
    const driver = await models.driver.findByPk(ctx.request.body.id);
    timber.debug('Logging what is about to update', {
      source: 'generated',
      update: ctx.request.body.update,
    });
    await driver.update(ctx.request.body.update);
    const instance = await models.driver.findOne({
      where: { id: ctx.request.body.id },
      attributes: [
        'firstName', 'lastName', 'phoneNumber', 'checkrID', 'checkr', 'addresses', 'profileImage', 'email',
      ],
    });
    timber.info('Successfully updated profile', {
      profile: instance.toString(),
      source: 'generated',
      created_in: 'profile_update',
    });

    ctx.body = {
      success: true,
      profile: instance,
    };
  } catch (error) {
    timber.error(
      'Error updating profile',
      {
        errorString: error.toString(),
        source: 'generated',
        created_in: 'profile_update',
      },
    );
  }
  await next();
});

module.exports = profile;
