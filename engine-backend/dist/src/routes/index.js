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
const matches_1 = __importDefault(require("./matches"));
const user_1 = __importDefault(require("./user"));
const waitlist_1 = __importDefault(require("./waitlist"));
const router = new koa_router_1.default();
router.use('/matches', matches_1.default.routes());
router.use('/user', user_1.default.routes());
router.use('/waitlist', waitlist_1.default.routes());
router.get('/', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = "Hello, World!  This is the OXO API";
    yield next();
}));
exports.default = router;
//# sourceMappingURL=index.js.map