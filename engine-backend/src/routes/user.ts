'use strict';
import Router from 'koa-router';
const user = new Router();

// Load environment variables from .env file

require('dotenv').config();
const models = require('../models');

user.get('/getDriver/:driverID', async (ctx, next) => {
    try {
        let driver = await models.match.findByPk(ctx.params.driverID);
        ctx.body = {
            success: true,
            driver: driver,
        }
    }
    catch (error) {
        console.log(error);
        ctx.body = { success: false, error: 'Matches database fetch error' };
    }
    await next();
});

user.get('/getOwner/:ownerID', async (ctx, next) => {
    try {
        let owner = await models.match.findByPk(ctx.params.ownerID);
        ctx.body = {
            success: true,
            owner: owner,
        }
    }
    catch (error) {
        console.log(error);
        ctx.body = { success: false, error: 'Matches database fetch error' };
    }
    await next();
});

export default user;
