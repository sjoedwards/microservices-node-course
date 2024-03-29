import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../app";

/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  function signup(_id?: string): Promise<string[]>;
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

// Define a global function that creates a test account
global.signup = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password });

  return response.get("Set-Cookie");
};
