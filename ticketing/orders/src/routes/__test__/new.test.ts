import { buildTicket } from "./../../test/utils";
import request from "supertest";

import { app } from "../../app";

import mongoose from "mongoose";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@sjoedwards/common";

test("returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

test("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({ title: "title", price: 20 });

  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "asdas",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

test("reserves a ticket", async () => {
  const ticket = await buildTicket();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

test.todo("emits an order created event");
