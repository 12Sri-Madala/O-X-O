// Move make connection to matching engine when that is built
const dotenv = require("dotenv");

dotenv.config();
const Router = require("koa-router");
const verifyOwner = require("./verifyId");

const connection = new Router();
const models = require("../models");
const timber = require("../logs/timber");

const LOCATION_DEFAULT = {
  locale: "San Francisco, CA 94108",
  street: "650 California St",
  latitude: 37.792912,
  longitude: -122.405211
};

/*
 * Returns: date formatted in mm/dd/yyyy format, will pad with 0 for singular months or days.
 */
function format(d) {
  const month = d.getMonth() >= 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`;
  const day = d.getDate() >= 10 ? d.getDate() : `0${d.getDate()}`;
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

/*
 * Creates a connection between the matches specified by ownerMatchID and driverMatchID
 * Will be called by our matching engine
 * TODO: Add validation that the matches haven't already been made
 * Validate that they fall in reasonable time ranges
 * Remove pickStart and dropStart when we replace in frontend with pickupTime and dropoffTime
 */
connection.post("/makeConnection", async (ctx, next) => {
  try {
    // NOT SECURE
    const { ownerMatchID } = ctx.request.body;
    const { driverMatchID } = ctx.request.body;
    const ownerMatch = await models.match.findByPk(ownerMatchID);
    const driverMatch = await models.match.findByPk(driverMatchID);

    const vehicles = await models.vehicle.findAll({
      where: {
        ownerID: ownerMatch.ownerID
      }
    });
    const vehicle = vehicles[0];
    // Validate that these matches have not already been matched
    const newConnection = {
      status: "UNCONFIRMED",
      pickupTime: ownerMatch.pickStart, // Change when dashboard is updated
      dropoffTime: ownerMatch.dropStart, // Change when dashboard is updated
      date: ownerMatch.date,
      pickupLocation: ownerMatch.pickupLocation,
      dropoffLocation: ownerMatch.dropoffLocation,
      ownerID: ownerMatch.ownerID,
      driverID: driverMatch.driverID,
      ownerMatchID: ownerMatch.id,
      driverMatchID: driverMatch.id,
      carID: vehicle.id,
      carRating: ownerMatch.carRating,
      driverRating: driverMatch.driverRating,
      driverConfirmation: "UNCONFIRMED",
      ownerConfirmation: "CONFIRMED"
    };
    const instance = await models.connection.create(newConnection);
    const connectionID = instance.id;
    // Write the newConnectionID back to both matches
    ownerMatch.update({
      connectionID,
      status: "Confirmed",
      pickupLocation: LOCATION_DEFAULT,
      dropoffLocation: LOCATION_DEFAULT,
      driverID: driverMatch.driverID,
      carID: vehicle.id
    });

    driverMatch.update({
      connectionID,
      status: "Matched",
      pickupLocation: LOCATION_DEFAULT,
      dropoffLocation: LOCATION_DEFAULT,
      carID: vehicle.id,
      ownerID: ownerMatch.ownerID
    });

    // Logging to timber
    timber
      .info("connection created", {
        created_in: "connections",
        connection_created: instance
      })
      .catch(error => {
        console.log("There was an error with logging in connections", error);
      });

    ctx.body = { success: true, status: 200 };
  } catch (error) {
    // Logging to timber
    timber
      .error("error in connections", {
        error,
        created_in: "connections",
        source: "generated",
        user: {
          id: ctx.params.id
        }
      })
      .catch(err => {
        console.log(err);
      });
    ctx.body = { success: false, error, status: 500 };
  }
  await next();
});

/*
 * Returns the active connection for the user (currently only one per day)
 * checks the id and date field to determine if a Connection is current
 */
connection.get("/getActiveConnection/:id/:token", async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.params.id, ctx.params.token))) {
      ctx.body = { success: false, error: "Unauthorized" };
      ctx.status = 401;
      return;
    }
    const today = new Date();
    const instance = await models.connection.findAll({
      where: {
        ownerID: ctx.params.id,
        date: format(today)
      }
    });
    if (instance.length !== 1) {
      console.log("There is more than one connection... something is wrong.");
    }
    const conn = instance[0];
    console.log("what is the connection itself: ", conn);
    if (conn) {
      const vehicle = await models.vehicle.findOne({
        where: {
          id: conn.carID
        },
        attributes: ["id", "make", "model", "plateNumber", "color", "year"]
      });
      const owner = await models.owner.findOne({
        where: {
          id: ctx.params.id
        }
      });
      const driver = await models.driver.findOne({
        where: {
          id: conn.driverID
        }
      });

      console.log(
        "what is the owner from owners backend getActiveConnection: ",
        owner
      );
      console.log(
        "what is the driver from owners backend getActiveConnection: ",
        driver
      );
      console.log(
        "what is the vehicle from owners backend getActiveConnection: ",
        vehicle
      );
      timber
        .info("fetched connection", {
          conn,
          user: {
            id: ctx.params.id
          },
          source: "generated",
          created_in: "connections_getActiveConnection"
        })
        .catch(error => {
          console.log(error);
        });
      ctx.body = {
        success: true,
        data: {
          connection: conn,
          vehicle,
          driver,
          owner
        }
      };
    } else {
      ctx.body = {
        success: true,
        data: {}
      };
    }
  } catch (error) {
    timber
      .error("Error in connections", {
        user: {
          created_in: "connections_getActiveConnection",
          id: ctx.params.id
        },
        error
      })
      .catch(err => {
        console.log("There was an error with logging in connections", err);
      });
    ctx.body = { success: false, error, status: 500 };
  }
  await next();
});

/*
 * Updates the status of the given connection
 * connection is specified by connectionID, status is specified by status
 */
connection.post("/updateConnectionStatus", async (ctx, next) => {
  try {
    if (!(await verifyOwner(ctx.request.body.id, ctx.request.body.token))) {
      ctx.body = { success: false, error: "Unauthorized" };
      ctx.status = 401;
      return;
    }
    let driverMatch;
    let ownerMatch;
    let newConnection;

    const connection = await models.connection.findByPk(
      ctx.request.body.connectionID
    );

    if (ctx.request.body.connectionStatus === "CANCELED") {
      newConnection = await connection.update({
        status: ctx.request.body.connectionStatus,
        canceledBy: "OWNER"
      });
    } else {
      newConnection = await connection.update({
        status: ctx.request.body.connectionStatus
      });
    }

    timber
      .info("updated connection", {
        newConnection,
        user: {
          id: ctx.request.body.id
        },
        source: "generated",
        created_in: "connections_updateConnection"
      })
      .catch(error => {
        console.log(error);
      });

    if (ctx.request.body.matchStatus) {
      driverMatch = await models.match.findOne({
        where: {
          id: connection.driverMatchID,
          type: "DRIVER"
        }
      });

      driverMatch = await driverMatch.update({
        status: ctx.request.body.matchStatus
      });

      ownerMatch = await models.match.findOne({
        where: {
          id: connection.ownerMatchID,
          type: "OWNER"
        }
      });

      ownerMatch = await ownerMatch.update({
        status: ctx.request.body.matchStatus
      });
    }

    ctx.body = {
      payload: {
        connection: newConnection,
        ownerMatch: ownerMatch || null
      },
      success: true
    };
  } catch (error) {
    ctx.body = {
      error,
      success: false
    };
    ctx.status = 500;
  }
  next();
});

module.exports = connection;
