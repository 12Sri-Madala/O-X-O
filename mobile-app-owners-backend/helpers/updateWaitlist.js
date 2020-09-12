const models = require("../models");
const timber = require("../logs/timber");

/* eslint object-shorthand: 0 */

module.exports = {
  updateWaitlist: async function(id) {
    try {
      const exists = await models.waitlist.count({
        where: {
          userID: id
        }
      });
      let waitlistEntry;
      if (exists > 0) {
        timber.info("Found an existing waitlist entry to update", {
          source: "generated",
          waitlistEntry
        });
        waitlistEntry = await models.waitlist.findOne({
          where: {
            userID: id
          }
        });
      } else {
        const newEntry = {
          userID: id,
          type: "OWNER",
          status: "WAITLISTED",
          points: 0
        };
        waitlistEntry = await models.waitlist.create(newEntry);
        timber.info("Created a new waitlist entry", {
          source: "generated",
          waitlistEntry
        });
      }

      const updatedPointTotal = await calculateTotalPoints(waitlistEntry);

      waitlistEntry = await waitlistEntry.update({ points: updatedPointTotal });
      timber.info("Updated waitlist entry with new point total", {
        source: "generated",
        waitlistEntry
      });
      return true;
    } catch (error) {
      return false;
    }
  }
};

async function calculateTotalPoints(waitlistEntry) {
  const type = waitlistEntry.type === "DRIVER" ? "driver" : "owner";
  let points = 0;
  const user = await models[type].findByPk(waitlistEntry.userID);

  if (user.email) {
    points += 1;
  }

  if (user.profileImage) {
    points += 2;
  }

  const count = await models.match.count({
    where: {
      [`${type}ID`]: waitlistEntry.userID,
      status: "Available"
    }
  });

  if (count > 1) {
    points += 2;
  }

  if (type === "driver") {
    if (user.checkr === "sent") {
      points += 2;
    } else if (user.checkr === "clear") {
      points += 5;
    }
    if (user.license) {
      points += 2;
    }
    if (user.customerID) {
      points += 5;
    }
  } else {
    if (user.accountId) {
      points += 5;
    }
    if (user.addresses) {
      points += 2;
    }
    const vehicles = await models.vehicle.findAll({
      where: {
        ownerID: waitlistEntry.userID
      }
    });
    if (vehicles.length > 0) {
      points += 2;
      const vehicle = vehicles[0]; // seems arbitrary, let's change down the line
      if (vehicle.vehicleImage) {
        points += 2;
      }
      if (vehicle.inspectionImage) {
        points += 2;
      }
      if (vehicle.insuranceImage) {
        points += 2;
      }
    }
  }

  return points;
}
