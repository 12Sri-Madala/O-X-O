const Router = require('koa-router');

const router = new Router();

const payments = require('./payments');
const library = require('./library');
const login = require('./login');
const dash = require('./dash');
const nav = require('./nav');
const profile = require('./profile');

const address = require('./address');
const vehicles = require('./vehicles');
const location = require('./location');
const connection = require('./connection');
const waitlist = require('./waitlist');

router.use('/payments', payments.routes());
router.use('/library', library.routes());
router.use('/login', login.routes());
router.use('/dash', dash.routes());
router.use('/nav', nav.routes());
router.use('/profile', profile.routes());
router.use('/address', address.routes());
router.use('/vehicles', vehicles.routes());
router.use('/connection', connection.routes());
router.use('/location', location.routes());
router.use('/waitlist', waitlist.routes());

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello, World!  This is the OXO API';
  await next();
});

module.exports = router;
