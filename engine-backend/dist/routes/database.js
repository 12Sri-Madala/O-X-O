"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const database = new koa_router_1.default();
// Load environment variables from .env file
require("dotenv").config();
const models = require("../models");
const fs = require("fs");
const timber = require("../logs/timber");
database.get("/", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dataPromise = new Promise((resolve, reject) => {
            let dataTables = [];
            fs.readdir("src/models", (err, files) => {
                for (let x = 0; x < files.length; x++) {
                    const index = files[x].lastIndexOf(".");
                    const fileName = files[x].slice(0, index);
                    if (fileName === 'index')
                        continue;
                    dataTables.push(fileName);
                }
                resolve(dataTables);
            });
        });
        const dataTables = yield dataPromise;
        // Logging to Timber
        timber
            .info("list of data tables", {
            created_in: "database",
            source: "generated"
        })
            .catch(error => {
            console.log("There was an error with getting the list of databases: ", error);
        });
        ctx.body = {
            success: true,
            dataTables
        };
    }
    catch (error) {
        timber
            .error("error in get database list", {
            error,
            created_in: "database",
            source: "generated"
        })
            .catch(error => {
            console.log(error);
        });
        ctx.body = {
            success: false,
            error,
            status: 500
        };
        console.log('what is the error message: ', error.message);
    }
    yield next();
}));
/*
* Client provides the name of the database they want the data from (table)
* and for pagination purposes provides the page and pageSize. Currently
* the page and pageSize are not being used, but it is set up for it and it will
* eventually be dynamically provided by the frontend.
*/
database.get("/tableName/:table/:page/:pageSize", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { table, page, pageSize } = ctx.params;
        let data;
        // page and pageSize are hardcoded to be 0 for now to just get all the rows of the DB
        if (!page && !pageSize) {
            const offset = page * pageSize;
            const limit = parseInt(pageSize) + offset;
            data = yield models[table].findAll({
                limit,
                offset
            });
        }
        else {
            data = yield models[table].findAll();
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
    }
    catch (error) {
        timber
            .error("error in getting database records", {
            error,
            created_in: "database",
            source: "generated"
        })
            .catch(error => {
            console.log(error);
        });
        ctx.body = {
            success: false,
            error,
            status: 500
        };
        console.log("what is the error message: ", error.message);
    }
    yield next();
}));
database.get("/row/:table/:id", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { table, id } = ctx.params;
        const row = models[table].findByPk(id);
        ctx.body = {
            success: true,
            row
        };
    }
    catch (error) {
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
    yield next();
}));
exports.default = database;
//# sourceMappingURL=database.js.map