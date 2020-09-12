"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// const dotenv = require('dotenv');
// dotenv.config();
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    var config = require('../../config/config.json')[env];
    var sequelize = new sequelize_1.Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: config.dialect,
    });
}
else if (env === 'staging') {
    var config = require('../../config/config.js')[env];
    var sequelize = new sequelize_1.Sequelize(process.env["DATABASE_URL"], config);
}
else if (env === 'production') {
    var config = require('../../config/config.js')[env];
    var sequelize = new sequelize_1.Sequelize(process.env["DATABASE_URL"], config);
}
else {
    console.log('The configuration options for this environment were not found. The current environment is printed below.');
    console.log(env);
}
const db = {};
const owner = sequelize.import('./owner.js');
db[owner.name] = owner;
const driver = sequelize.import('./driver.js');
db[driver.name] = driver;
const match = sequelize.import('./match.js');
db[match.name] = match;
const connection = sequelize.import('./connection.js');
db[connection.name] = connection;
const vehicle = sequelize.import('./vehicle.js');
db[vehicle.name] = vehicle;
const waitlist = sequelize.import('./waitlist.js');
db[waitlist.name] = waitlist;
db.sequelize = sequelize;
db.Sequelize = sequelize_1.Sequelize;
module.exports = db;
//# sourceMappingURL=index.js.map