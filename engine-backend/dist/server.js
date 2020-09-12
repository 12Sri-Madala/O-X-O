"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("@koa/cors"));
const PORT = process.env.PORT || 5000;
const app = new koa_1.default();
app
    .use(koa_logger_1.default())
    .use(cors_1.default())
    .use(koa_bodyparser_1.default())
    // .use(checkJwt)
    .use(routes_1.default.routes())
    .use(routes_1.default.allowedMethods());
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
//# sourceMappingURL=server.js.map