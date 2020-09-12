'use strict';
import Router from 'koa-router';

const timber = require('../logs/timber');
// Provides endpoints to run the waitlist to allow users to sign up without being activated
const waitlist = new Router();

require('dotenv').config();
const models = require('../models');

// Get methods



/**
 * [waitlist_owner returns the waitlistEntry for the ownerID]
 * @method waitlist_owner
 * @param  '/ownerID [id of the owner]
 * @return                    [waitlistEntry]
 */
waitlist.get('/owner/:ownerID', async (ctx, next) => {
	try {
		let waitlistEntry = await models.waitlist.findByPk(ctx.params.ownerID);
		timber.info('Retrieved waitlist status', {
			source: 'generated',
			user: {
				id: ctx.params.driverID
			},
			created_in: 'waitlist_owner'
		});
		ctx.body = {
			success: true,
			waitlistEntry,
		}
	} catch (error) {
		timber.error('Error retrieving from owner waitlist', {
			error,
			source: 'generated',
			created_in: 'waitlist_owner'
		});
		ctx.body = { success: false, error: 'Waitlist database fetch error' };
	}
	await next();
});

//Update endpoints

waitlist.post('/update', async (ctx, next) => {
	try {
		const id: string = ctx.request.body.id;
		timber.debug('The id is', {
			userID: id.toString(),
			source: 'generated',
		});
		let exists = await models.waitlist.count({
			where: {
				userID: id,
			}
		});
		let waitlistEntry: any;
		if (exists > 0) {
			timber.info('entering exists already...');
			waitlistEntry = await models.waitlist.findOne({
				where: {
					userID: id,
				}
			});
		} else {
			//newEntry
			const newEntry = {
				userID: id,
				type: ctx.request.body.type,
				status: 'WAITLISTED',
				points: 0,
				updatedAt: new Date(),
			}
			waitlistEntry = await models.waitlist.create(newEntry)
		}

		//New point total
		const newPoints: number = await calculateTotalPoints(waitlistEntry);

		waitlistEntry.update({ points: newPoints }); //Check this line
		console.log('Getting here');
		timber.info('simple');
		timber.info('pretty simple', {
			source: 'generated',
			waitlistEntry: 'hello',
		});
		timber.info('Retrieved waitlist status WITHJSON', {
			waitlistEntry: JSON.stringify(waitlistEntry),
			source: 'generated',
			user: {
				id,
			},
			created_in: 'waitlist_driver'
		});
		timber.info('Retrieved waitlist status NO ENTRY', {
			source: 'generated',
			user: {
				id,
			},
			created_in: 'waitlist_driver'
		});
		timber.info('Retrieved waitlist status WITH ID', {
			waitlistEntry: waitlistEntry.id,
			source: 'generated',
			user: {
				id,
			},
			created_in: 'waitlist_driver'
		});
		console.log('Getting after the logs');
		ctx.body = {
			success: true,
			waitlistEntry,
		}
	} catch (error) {
		console.log(error);
		console.log(typeof (error));
		console.log(error.toString());
		const errorString = error.toString();
		console.log(errorString);
		timber.error('Error retrieving from driver waitlist', {
			errorString: errorString,
			source: 'generated',
			created_in: 'waitlist_driver',
		});
		ctx.body = { success: false, error: 'Waitlist database fetch error' };
	}
	await next();
});

waitlist.post('/statusUpdate', async (ctx, next) => {
	try {
		const id: string = ctx.request.body.id;
		timber.debug('The id is', {
			userID: id.toString(),
			source: 'generated',
		});
		let newStatus: string;
		let user: any;
		const waitlistEntry = await models.waitlist.findOne({
			where: {
				userID: id
			}
		});
		const type: string = waitlistEntry.type === "DRIVER" ? "driver" : "owner";
		waitlistEntry.update({ status: newStatus });

		timber.info(`Retrieved waitlist and updated status to ${newStatus}`, {
			source: 'generated',
			user: {
				id,
			},
			created_in: `waitlist_${type}`
		});

		if (newStatus === 'ACTIVATED') {
			user = await models[type].findByPk(waitlistEntry.userID);
			user.update({ status: newStatus });

			timber.info(`Updated ${user.id} status to ${newStatus}`, {
				source: 'generated',
				user: {
					id,
				},
				created_in: `${type}`
			});
		}

		ctx.body = {
			success: true,
			waitlistEntry
		}
	} catch (error) {
		console.log('Waitlist status update error: ', error)
		ctx.status = 500;
		ctx.body = { success: false, error: 'Waitlist status update error' };
	}
	await next()
})

async function calculateTotalPoints(waitlistEntry: any): Promise<number> {
	if (waitlistEntry.type === 'DRIVER') {
		//Calculate driver points
		let points: number = 0;
		const driver = await models.driver.findByPk(waitlistEntry.userID);
		//Checkr

		//Added email
		if (driver.email !== null) {
			points += 1;
		}

		//added profileImage
		if (driver.profileImage) {
			points += 2;
		}

		//TODO: double check checkr statuses
		switch (driver.checkr) {
			case 'sent':
				points += 2;
			case 'clear':
				points += 5;
		}

		//Added license number
		if (driver.license) {
			points += 2;
		}

		//Added a payment method
		if (driver.customerID) {
			points += 5;
		}

		//If they have availability
		const count: number = await models.match.count({
			where: {
				driverID: waitlistEntry.userID,
				status: 'Available'
			}
		});
		if (count > 1) {
			points += 2;
		}

		timber.info('Calculated point total', {
			source: 'generated',
			created_in: 'waitlist_calculateTotalPoints',
			user: {
				points,
				id: waitlistEntry.userID,
				type: 'DRIVER'
			}
		});

		return points;
	} else if (waitlistEntry.type === 'OWNER') {
		//Calculate owner points
		let points: number = 0;
		let owner = await models.owner.findByPk(waitlistEntry.userID);

		if (owner.accountId) {
			points += 5;
		}

		if (owner.profileImage) {
			points += 2;
		}

		if (owner.email) {
			points += 1;
		}

		if (owner.addresses) {
			points += 2;
		}

		const vehicles = await models.vehicle.findAll({
			where: {
				ownerID: waitlistEntry.userID
			}
		});

		//Examining the vehicle
		if (vehicles.length > 0) {
			points += 2;
			const vehicle: any = vehicles[0];
			if (vehicle.vehicleImage) {
				points += 2;
			}

			if (vehicle.insepectionImage) {
				points += 2;
			}

			if (vehicle.insuranceImage) {
				points += 2;
			}
		}

		//If they have availability
		const count: number = await models.match.count({
			where: {
				ownerID: waitlistEntry.userID,
				status: 'Available'
			}
		});
		if (count > 1) {
			points += 2;
		}

		timber.info('Calculated point total', {
			source: 'generated',
			created_in: 'waitlist_calculateTotalPoints',
			user: {
				points,
				id: waitlistEntry.userID,
				type: 'OWNER'
			}
		});
		return points;
	}
}

export default waitlist;
