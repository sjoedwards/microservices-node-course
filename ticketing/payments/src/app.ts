import { NotFoundError, currentUser, errorHandler } from "@sjoedwards/common";
import cookieSession from "cookie-session";
import express, { Response, Request } from "express";
// Means we can throw errors inside of async functions
import "express-async-errors";
import { json } from "body-parser";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: false })
);
app.use(currentUser);
app.use(createChargeRouter);

// Because we've imported express-async-errors, that means we can throw errors async
app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
