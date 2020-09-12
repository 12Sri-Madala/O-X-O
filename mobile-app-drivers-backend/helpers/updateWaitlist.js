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
          type: "DRIVER",
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
      console.log("Error in updating the waitlist: ", error);
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

  return points;
}
