const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

let sequelize;
if (env === 'development') {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port
  });
} else if (env === 'staging') {
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else {
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
db.Sequelize = Sequelize;

module.exports = db;
