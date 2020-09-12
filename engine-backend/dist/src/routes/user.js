'use strict';
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
const user = new koa_router_1.default();
// Load environment variables from .env file
require('dotenv').config();
const models = require('../models');
user.get('/getDriver/:driverID', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let driver = yield models.match.findByPk(ctx.params.driverID);
        ctx.body = {
            success: true,
            driver: driver,
        };
    }
    catch (error) {
        console.log(error);
        ctx.body = { success: false, error: 'Matches database fetch error' };
    }
    yield next();
}));
user.get('/getOwner/:ownerID', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let owner = yield models.match.findByPk(ctx.params.ownerID);
        ctx.body = {
            success: true,
            owner: owner,
        };
    }
    catch (error) {
        console.log(error);
        ctx.body = { success: false, error: 'Matches database fetch error' };
    }
    yield next();
}));
exports.default = user;
//# sourceMappingURL=user.js.map