
const dotenv = require('dotenv');

dotenv.config();
const Router = require('koa-router');
const verifyOwner = require('./verifyId');

const profile = new Router();
const models = require('../models');
const timber = require('../logs/timber');

profile.post('/saveProfileImage', async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: 'unauthorized' };
      ctx.status = 401;
      return;
    }
    const { request } = ctx;
    console.log(request.body.token);
    const image = `data:image/png;base64,${request.body.payload.base64}`;
    const instance = await models.owner.findAll({ where: { id: request.body.id } });
    instance[0].update({ profileImage: image });
    timber.info(
      'saved profile image', {
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'profile_saveProfileImage',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
    ctx.body = { success: true, message: instance[0] };
  } catch (error) {
    timber.error(
      'error saving  profile image', {
        user: {
          id: ctx.request.body.id,
        },
        source: 'generated',
        created_in: 'profile_saveProfileImage',
      },
    ).catch((err) => {
      console.log(err);
      // At this point, your log is synced with Timber.io!
    });
    ctx.body = { success: false, message: 'Internal error, please try again.' };
  }
  await next();
});

profile.post('/update', async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: 'unauthorized' };
      ctx.status = 401;
      return;
    }
    const owner = await models.owner.findByPk(ctx.request.body.id);
    timber.debug('Logging what is about to update', {
      source: 'generated',
      update: ctx.request.body.update,
    });
    await owner.update(ctx.request.body.update);
    const instance = await models.owner.findOne({
      where: { id: ctx.request.body.id },
      attributes: [
        'firstName', 'lastName', 'phoneNumber', 'addresses', 'profileImage', 'email',
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
    ctx.status = 500;
    ctx.body = { success: false, error };
  }
  await next();
});

profile.post('/load', async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: 'unauthorized' };
      ctx.status = 401;
      return;
    }
    ctx.body = { success: true, profile: null };
    const instance = await models.owner.findAll({
      where: { id: ctx.request.body.id },
      attributes: [
        'firstName', 'lastName', 'phoneNumber', 'addresses', 'profileImage', 'email',
      ],
    });
    timber.info(
      'fetched profile', {
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
    ctx.body = { success: true, profile: instance[0] };
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

module.exports = profile;
