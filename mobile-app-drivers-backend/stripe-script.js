/**
 * Script for checking if anyone needs to be charged or paid.
 * Should be run every hour or so.
 * 
 * @see {@link https://stripe.com/docs/api/}
 */

 'use strict';


// IMPORTS

const models = require('./models');
const _ = require('lodash');
const dotenv = require('dotenv');
dotenv.config();

// Load stripe from API key
var stripe = require("stripe")(process.env.stripeSK);

const CHARGE_AMOUNT = 5000;
const OXO_AMOUNT = 2000;
const CHARGE_CURRENCY = "usd";
const CHARGE_DESCRIPTION = "One day of OXO car rental";

// Run on local serer for now
// TODO: fix this
const serverInfo = {
    name: 'http://localhost:5000',
}


// FUNCTIONS

/**
 * Gets the driver matches that are due to be charged.
 *
 * @return     {Promise}  The matches.
 */
 async function getMatches() {
    try {
        // TODO: get only matches that are less than 24 hours from now
        const matches = await models.match.findAll({
            where: {
                paid: null,
            }
        });
        console.log(matches);
        return matches;
    } catch (error) {
        console.log(error);
        return []; // TODO: What do we return here?
    }
}

/**
 * Gets the unique drivers from a list of match promises.
 *
 * @param      {Promise}  matches  The matches.
 * @return     {Promise}  The drivers.
 */
 function getDrivers(matches) {

    // Pull the drivers from the matches
    let drivers = _.map(matches, (match) => {
        return match.driverID;
    });
    drivers = _.uniq(drivers);
    return drivers;
}

/**
 * Charges a driver single if they are overdue provided a match object.
 * Overdue is currently defined as the start date being less than
 * 24 hours from now.
 *
 * @param      Model  match   Any match that may be overdue.
 */
 async function chargeOverdueDriver(match) {
    console.log('Charging driver with ID: ', match.driverID);

    // 1. get driver profile
    const driver = await models.driver.findById(match.driverID);
    console.log('Found driver: ', driver);

    // make sure status is confirmed
    if (match.status !== 'Confirmed') {
        return;
    }

    // make sure customer ID is not null
    if (driver.customerID === null) {
        models.match.update({
            paid: "ERROR_NO_CUSTOMER_ID"
        },
        {where: {id: match.id}}).catch((err) => {
            console.log(err);
        });
        return;
    }

    // make sure driver is due (hasn't happened and less than 24 hours from now)
    const nowTime = new Date();
    const startTime = new Date(match.pickStart);
    const hoursUntilPick = (startTime - nowTime) / (1000 * 60 * 60);
    if (hoursUntilPick > 24 || hoursUntilPick < 0) {
        return;
    }

    // get owner (destination) account from database
    const owner = await models.owner.findById(match.ownerID); //TODO: make sure this works

    // 2. charge to stripe
    const charge = await stripe.charges.create({
        amount: CHARGE_AMOUNT,
        currency: CHARGE_CURRENCY,
        capture: false,
        application_fee_amount: OXO_AMOUNT,
        customer: driver.customerID,
        description: CHARGE_DESCRIPTION,
        transfer_data: {
            destination: owner.accountId
        }
    });

    console.log('Getting charge ', charge);

    // 3. get status
    // 4. save driverProfile back to database
    if (charge.outcome.network_status === "approved_by_network") {
        models.match.update({
            paid: charge.id,
        },
        {where: {id: match.id}}).catch((err) => {
            console.log(err);
        });
    } else {
        models.match.update({
            paid: "ERROR",
        },
        {where: {id: match.id}}).catch((err) => {
            console.log(err);
        });
    }
    
    console.log('Completed a match with id', match.id);
}

/**
 * Charges drivers whose payments are overdue.
 *
 * @param      [Model]  matches  Potentially overdue matches.
 */
 function chargeOverdueDrivers(matches) {
    _.forEach(matches, chargeOverdueDriver);
}


// SCRIPT
getMatches().then(chargeOverdueDrivers);


// TEST
console.log(new Date());
