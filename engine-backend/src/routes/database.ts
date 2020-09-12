"use strict";
import Router from "koa-router";
const database = new Router();

// Load environment variables from .env file

require("dotenv").config();
const models = require("../models");
const fs = require("fs");
const timber = require("../logs/timber");

database.get("/", async (ctx, next) => {
	try {

		let dataPromise = new Promise((resolve, reject) => {
			let dataTables = [];
			fs.readdir("src/models", (err, files) => {
				for (let x = 0; x < files.length; x++) {
					const index = files[x].lastIndexOf(".");
					const fileName = files[x].slice(0, index);
					if (fileName === 'index') continue;
					dataTables.push(fileName);
				}
				resolve(dataTables);
			});
		})

		const dataTables = await dataPromise;

		// Logging to Timber
		timber
			.info("list of data tables", {
				created_in: "database",
				source: "generated"
			})
			.catch(error => {
				console.log(
					"There was an error with getting the list of databases: ",
					error
				);
			});

		ctx.body = {
			success: true,
			dataTables
		};
	} catch (error) {
		timber
			.error("error in get database list", {
				error,
				created_in: "database",
				source: "generated"
			})
			.catch(error => {
				console.log(error);
			});

		ctx.status = 500;
		ctx.body = {
			success: false,
			error,
		};
		console.log('what is the error message: ', error.message)
	}
	await next();
});


/*
* Client provides the name of the database they want the data from (table) 
* and for pagination purposes provides the page and pageSize. Currently
* the page and pageSize are not being used, but it is set up for it and it will 
* eventually be dynamically provided by the frontend.
*/
database.get("/tableName/:table/:page/:pageSize", async (ctx, next) => {
	try {
		const { table, page, pageSize } = ctx.params;
		let data: any[];

		// page and pageSize are hardcoded to be 0 for now to just get all the rows of the DB
		if (!page && !pageSize) {
			const offset = page * pageSize;

			const limit = parseInt(pageSize) + offset;

			data = await models[table].findAll({
				limit,
				offset
			});
		} else {
			data = await models[table].findAll()
		}


		// Logging to Timber
		timber
			.info(`rows of ${table} database`, {
				created_in: "database",
				source: "generated"
			})
			.catch(error => {
				console.log(error);
			});

		ctx.body = {
			success: true,
			data
		};
	} catch (error) {
		timber
			.error("error in getting database records", {
				error,
				created_in: "database",
				source: "generated"
			})
			.catch(error => {
				console.log(error);
			});

		ctx.status = 500;
		ctx.body = {
			success: false,
			error
		};

		console.log("what is the error message: ", error.message)
	}
	await next();
});

database.get("/row/:table/:id", async (ctx, next) => {
  try {
    const { table, id } = ctx.params;
    const row = await models[table].findByPk(id); // not changing this for now, since we can just route to (singular) model names
    ctx.body = {
      success: true,
      row
    };
  } catch (error) {
    console.log(error);
    timber
      .error("error in getting database row", {
        error,
        created_in: "database",
        source: "generated"
      })
      .catch(error => {
        console.log(error);
      });
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: "Internal server error"
    };
  }
  await next();
});

export default database;
