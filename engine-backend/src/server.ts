import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import router from "./routes";
import cors from "@koa/cors";
import checkJwt from "./jwt";

const PORT = process.env.PORT || 5000;

const app = new Koa();

app
	.use(logger())
	.use(cors())
	.use(bodyParser())
	.use(checkJwt)
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(PORT);

console.log(`Server running on port ${PORT}`);
