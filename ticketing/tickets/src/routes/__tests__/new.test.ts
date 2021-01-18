import { natsWrapper } from "./../../nats-wrapper";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

test("Has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

test("Can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

test("Returns a status of not 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

test("Returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ price: 10 })
    .expect(400);
});

test("Returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "test", price: -10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "test" })
    .expect(400);
});

test("Creates a ticket with valid inputs", async () => {
  const ticketsPre = await Ticket.find({});

  expect(ticketsPre).toHaveLength(0);

  const title = "asdas";
  const price = 20;
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  const ticketsPost = await Ticket.find({ title, price });

  expect(ticketsPost).toHaveLength(1);
});

test("publishes an event", async () => {
  const title = "asfasfsd";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price: 20 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  expect(natsWrapper.client.publish).toHaveBeenLastCalledWith(
    "ticket:created",
    expect.any(String),
    expect.any(Function)
  );
});
