import { createTicket } from "./../../test/utils";
import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";

let id: string;
beforeEach(() => {
  id = new mongoose.Types.ObjectId().toHexString();
});
test("returns a 404 if the id doesn't exist", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "asfasf", price: 20 })
    .expect(404);
});
test("returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "asfasf", price: 20 })
    .expect(401);
});
test("returns a 401 if the user does not own the ticket", async () => {
  const response = await createTicket(app);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "asfasf", price: 20 })
    .expect(401);
});

// Start here - getting 400 but need a 200!
test("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = await global.signin();
  const response = await createTicket(app, { cookie });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(400);
});
test("updates the ticket given valid inputs", async () => {});
