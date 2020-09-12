'use strict';

const Router = require('koa-router');

const nav = new Router();

nav.get('/', async (ctx, next) => {
	ctx.body = "Hello, World!  This is the Navigation API";
	await next();
});

module.exports = nav;