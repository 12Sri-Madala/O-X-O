const PORT = process.env.PORT || 5000;

const schedule = require("node-schedule");
const app = require("./app");
const db = require("./models");
const createMatches = require("./helpers/generateMatches.js");

db.sequelize.sync().then(() => {
  console.log(`App listening on port ${PORT}`);
  app.listen(PORT);
  schedule.scheduleJob("0 0 0 * * *", async () => {
    const drivers = await db.driver.findAll({
      attributes: ["id", "rating"]
    });
    const matches = createMatches.addDaily(drivers);
    await db.match.bulkCreate(matches, { individualHooks: true });
    // console.log(matches);
  });
});
