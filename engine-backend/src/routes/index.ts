import Router from "koa-router";
import matches from "./matches";
import user from "./user";
import connection from "./connection";
import database from "./database";

const router = new Router();

router.use("/matches", matches.routes());
router.use("/user", user.routes());
router.use("/connection", connection.routes());
router.use("/database", database.routes());

router.get("/", async (ctx, next) => {
  ctx.body = "Hello, World!  This is the OXO API";
  await next();
});

export default router;
