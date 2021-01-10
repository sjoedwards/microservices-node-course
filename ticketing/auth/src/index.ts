import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middleware/error-handler";
import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import mongoose from "mongoose";

const app = express();
// Telling the app that even though traffic is coming from the nginx proxy, to trust it as secure
app.set("trust proxy", true);

// Create the session
app.use(cookieSession({ signed: false, secure: true }));
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Only works because we've got express-async-errors imported, otherwise would need to pass
// NotFoundError() to next()
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("error", e);
  }
};

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

start();
