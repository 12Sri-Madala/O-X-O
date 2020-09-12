const PORT = process.env.PORT || 5000;

const schedule = require('node-schedule');
const app = require('./app');
const db = require('./models');
const createMatches = require('./helpers/generateMatches.js');

// db.sequelize.sync().then(() => {
//   app.listen(PORT);
//   schedule.scheduleJob('0 0 0 * * *', async () => {
//     const owners = await db.owner.findAll({
//       attributes: [
//         'id',
//       ],
//     });
//     const matches = createMatches.addDaily(owners);
//     await db.match.bulkCreate(matches, { individualHooks: true });
//   });
// });
