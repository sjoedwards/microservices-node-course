import request from "supertest";
import { app } from "../../app";

test("Has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

test("Can only be accessed if the user is signed in", async () => {});

test("Returns an error if an invalid title is provided", async () => {});

test("Returns an error if an invalid price is provided", async () => {});

test("Creates a ticket with valid inputs", async () => {});
