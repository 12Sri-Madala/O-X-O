'use strict';

const Router = require('koa-router');
const verifyDriver = require('./verifyId');
const library = new Router();
const models = require('../models');

library.get('/', async (ctx, next) => {
	ctx.body = "Hello, World!  This is the Library API"
	await next();
});

library.post('/', async (ctx, next) => {
	try {
        if(!(await verifyDriver(ctx.request.body.id, ctx.request.body.token))) {
            ctx.body = {success: false, error: 'Unauthorized'};
            ctx.status = 401;
            return;
        }
		const user = await models.driver.findAll({
			where: {
				id: ctx.request.body.id
			}
		});
		console.log('success');
		user[0].update(ctx.request.body.payload);
		ctx.body = ({success: true});
	} catch(error) {
		console.log(error);
		ctx.body = ({success: false, error: error});
	}
	await next()
});

module.exports = library;
