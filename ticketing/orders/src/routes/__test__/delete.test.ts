import { OrderStatus } from "@sjoedwards/common";
import { buildTicket, createOrder } from "./../../test/utils";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";

test("marks an order as cancelled", async () => {
  // Create a ticket with the ticket model
  const ticket = await buildTicket();
  const user = global.signin();
  // Make a request to create an order
  const { body: order } = await createOrder(app, ticket.id, user);
  // Make a request to cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);
  // Expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

test.todo("It publishes an order cancelled event");
