import jwt from "jsonwebtoken";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../app";

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  // Setup mongodb in memory
  mongo = new MongoMemoryServer();

  // Get uri of the mongo server
  const mongoUri = await mongo.getUri();

  // Connect to the mongo server using mongoose
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  // Before each test tear down the collections in mongodb
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  //After each test stop the in memory MongoDB and close the connection
  await mongo.stop();
  await mongoose.connection.close;
});

// This is not really 'signing in', its more generating
// the cookie that the client would expect to send in the request
global.signin = () => {
  const id = "test";
  const email = "test@test.com";
  const userJwt = jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_KEY
  );

  const session = JSON.stringify({ jwt: userJwt });
  const b64Session = Buffer.from(session).toString("base64");

  return [`express:sess=${b64Session}`];
};
