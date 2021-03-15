import { natsWrapper } from "./../../nats-wrapper";
import { createTicket } from "./../../test/utils";
import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";

jest.mock("../../nats-wrapper.ts");

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

// Start here - getting 200 but need a 400!
test("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = await global.signin();
  const response = await createTicket(app, { cookie });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "test" })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ price: -5 })
    .expect(400);
});
test("updates the ticket given valid inputs", async () => {
  const cookie = await global.signin();
  const response = await createTicket(app, { cookie });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 100 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});

test("publishes an event", async () => {
  const cookie = await global.signin();
  const response = await createTicket(app, { cookie });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 100 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
  expect(natsWrapper.client.publish).toHaveBeenLastCalledWith(
    "ticket:updated",
    expect.any(String),
    expect.any(Function)
  );
});

test.only("rejects updates if ticket is reserved", async () => {
  const cookie = await global.signin();
  const response = await createTicket(app, { cookie });
  const ticket = await Ticket.findById(response.body.id);
  ticket.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 100 })
    .expect(400);
});
