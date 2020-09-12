"use strict";
import Router from "koa-router";
const connection = new Router();
// Load environment variables from .env file

require("dotenv").config();
const models = require("../models");
const timber = require("../logs/timber");

const uuid = require("uuid/v4");

connection.post("/", async (ctx, next) => {
	try {
		const { ownerMatchID, driverMatchID } = ctx.request.body;

		const ownerMatch = await models.match.findByPk(ownerMatchID);
		const driverMatch = await models.match.findByPk(driverMatchID);
		console.log("ownerMatch: ", ownerMatch);
		console.log("driverMatch: ", driverMatch);

		const vehicles = await models.vehicle.findAll({
			where: {
				ownerID: ownerMatch.ownerID
			}
		});

		// temp until owners start associating storing multiple vehicles and
		// associating a vehicle with their matches
		const vehicle = vehicles[0];

		// TODO: validate matches before making connection (individual match objects)
		// must have complete and compatible info, not already matched
		const newConnection = {
			status: "UNCONFIRMED",
			pickupTime: ownerMatch.pickStart,
			dropoffTime: ownerMatch.dropStart,
			date: ownerMatch.date,
			pickupLocation: ownerMatch.pickupLocation,
			dropoffLocation: ownerMatch.dropoffLocation,
			ownerID: ownerMatch.ownerID,
			driverID: driverMatch.driverID,
			ownerMatchID: ownerMatch.id,
			driverMatchID: driverMatch.id,
			carID: vehicle.id,
			carRating: ownerMatch.carRating,
			driverRating: driverMatch.driverRating
		};
		const connection = await models.connection.create(newConnection);

		const updatedOwnerMatch = await ownerMatch.update({
			connectionID: connection.id,
			status: "Confirmed",
			driverID: driverMatch.driverID,
			carID: vehicle.id,
			pickupTime: ownerMatch.pickStart, // NOTE: will soon use pickupTime instead of pickStart in owner matches
			dropoffTime: ownerMatch.dropStart
		});

		const updatedDriverMatch = driverMatch.update({
			connectionID: connection.id,
			status: "Matched",
			carID: vehicle.id,
			ownerID: ownerMatch.ownerID,
			pickupTime: ownerMatch.pickStart,
			dropoffTime: ownerMatch.dropStart,
			pickupLocation: ownerMatch.pickupLocation,
			dropoffLocation: ownerMatch.dropoffLocation
		});

		timber
			.info("connection created", {
				source: "generated",
				created_in: "connections",
				connection_created: connection
			})
			.catch(error => {
				console.log("There was an error with logging in connections", error);
			});

		ctx.body = {
			success: true,
			connection,
			ownerMatch: updatedOwnerMatch,
			driverMatch: updatedDriverMatch
		};
	} catch (error) {
		timber
			.error("error in connections", {
				error: error.message,
				created_in: "connections",
				source: "generated"
			})
			.catch(err => {
				console.log(err);
			});
		ctx.body = { success: false, errorMessage: error.message };
		ctx.status = 500;
	}
	await next();
});

/*
 * Client optionally supplies an ownerMatchID and driverMatchID, and this endpoint
 * creates a connection between the supplied ownerMatch (or a dummy one, if not provided)
 * and the supplied or dummy driverMatch, plus updates the matches. Does NOT create
 * dummy owner or driver.
 *
 * Returns the new connection and updated matches in the response.
 */

connection.post("/makeTestConnection", async (ctx, next) => {
	try {
		const { ownerMatchID, driverMatchID } = ctx.request.body;

		const ownerMatch = ownerMatchID
			? await models.match.findByPk(ownerMatchID)
			: await models.match.create({
				ownerID: DUMMY_OWNER_ID,
				carID: DUMMY_VEHICLE_ID,
				pickStart: DUMMY_PICK_START,
				dropStart: DUMMY_DROP_START,
				date: DUMMY_DATE,
				pickupLocation: LOCATION_DEFAULT,
				dropoffLocation: LOCATION_DEFAULT,
				status: "Available"
			});

		const driverMatch = driverMatchID
			? await models.match.findByPk(driverMatchID)
			: await models.match.create({
				pickStart: DUMMY_PICK_START,
				pickEnd: DUMMY_PICK_END,
				dropStart: DUMMY_DROP_START,
				dropEnd: DUMMY_DROP_END,
				date: DUMMY_DATE,
				pickupLocation: LOCATION_DEFAULT,
				dropoffLocation: LOCATION_DEFAULT,
				status: "Available",
				driverID: DUMMY_DRIVER_ID
			});

		const vehicle = ownerMatchID
			? await models.vehicle.findOne({
				where: {
					ownerID: ownerMatch.ownerID
				}
			})
			: await models.vehicle.create({
				...DUMMY_VEHICLE,
				ownerID: ownerMatch.ownerID
			});

		// Validate that these matches have not already been matched,
		// all necessary info supplied, and all info compatible (this includes not having existing match)

		const newConnection = {
			status: "UNCONFIRMED",
			pickupTime: ownerMatch.pickStart,
			dropoffTime: ownerMatch.dropStart,
			date: ownerMatch.date,
			pickupLocation: ownerMatch.pickupLocation,
			dropoffLocation: ownerMatch.dropoffLocation,
			ownerID: ownerMatch.ownerID,
			driverID: driverMatch.driverID,
			ownerMatchID: ownerMatch.id,
			driverMatchID: driverMatch.id,
			carID: vehicle.id,
			carRating: ownerMatch.carRating,
			driverRating: driverMatch.driverRating
		};
		const connection = await models.connection.create(newConnection);

		const updatedOwnerMatch = await ownerMatch.update({
			connectionID: connection.id,
			status: "Confirmed",
			driverID: driverMatch.driverID,
			carID: vehicle.id,
			pickupTime: ownerMatch.pickStart, // NOTE: will soon use pickupTime instead of pickStart in owner matches
			dropoffTime: ownerMatch.dropStart
		});

		const updatedDriverMatch = await driverMatch.update({
			connectionID: connection.id,
			status: "Matched",
			carID: vehicle.id,
			ownerID: ownerMatch.ownerID,
			pickupTime: ownerMatch.pickStart,
			dropoffTime: ownerMatch.dropStart,
			pickupLocation: ownerMatch.pickupLocation,
			dropoffLocation: ownerMatch.dropoffLocation
		});

		timber
			.info("connection created", {
				source: "generated",
				created_in: "connections",
				connection_created: connection
			})
			.catch(error => {
				console.log("There was an error with logging in connections", error);
			});

		ctx.body = {
			success: true,
			connection,
			ownerMatch: updatedOwnerMatch,
			driverMatch: updatedDriverMatch
		};
	} catch (error) {
		timber
			.error("error in connections", {
				error,
				created_in: "connections",
				source: "generated"
			})
			.catch(err => {
				console.log(err);
			});
		ctx.body = { success: false, error };
		ctx.status = 500;
	}
	await next();
});

const LOCATION_DEFAULT = {
	locale: "San Francisco, CA 94108",
	street: "650 California St",
	latitude: 37.792912,
	longitude: -122.405211
};

const today = new Date();
today.setHours(9, 0, 0, 0);
const DUMMY_PICK_START = today.toString();
today.setHours(10, 0, 0, 0);
const DUMMY_PICK_END = today.toString();
today.setHours(17, 0, 0, 0);
const DUMMY_DROP_START = today.toString();
today.setHours(18, 0, 0, 0);
const DUMMY_DROP_END = today.toString();
const DUMMY_DATE =
	(today.getMonth() + 1).toString() +
	"/" +
	today.getDate().toString() +
	"/" +
	today.getFullYear().toString();

const DUMMY_OWNER_ID = uuid();
const DUMMY_DRIVER_ID = uuid();
const DUMMY_VEHICLE_ID = uuid();

const DUMMY_VEHICLE = {
	id: DUMMY_VEHICLE_ID,
	make: "Tesla",
	model: "Model 3",
	year: 2018,
	vin: "010101JOINOXO10101",
	plateNumber: "JOINOXO",
	color: "white",
	companies: null,
	vehicleImage: null,
	inspectionImage: null,
	insurangeImage: null,
	numberDoors: 4,
	numberSeats: 5,
	licenseState: "CA"
};

export default connection;
