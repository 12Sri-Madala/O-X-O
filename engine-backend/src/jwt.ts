import jwt from "koa-jwt";
import jwksRsa from "jwks-rsa";

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.koaJwtSecret({
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

export default checkJwt;
