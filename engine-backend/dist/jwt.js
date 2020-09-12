"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_jwt_1 = __importDefault(require("koa-jwt"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const checkJwt = koa_jwt_1.default({
    // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
    secret: jwks_rsa_1.default.koaJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://joinoxo.auth0.com/.well-known/jwks.json`
    }),
    debug: true,
    // Validate the audience and the issuer
    audience: "https://engine.joinoxo.com/",
    issuer: "https://joinoxo.auth0.com/",
    algorithms: ["RS256"]
});
exports.default = checkJwt;
//# sourceMappingURL=jwt.js.map