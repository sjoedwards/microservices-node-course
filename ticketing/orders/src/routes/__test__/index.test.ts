import { buildTicket, createOrder } from "./../../test/utils";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

test("fetches order for a particular user", async () => {
  // Create three tickets using the ticket model directly

  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOneCookie = global.signin();
  const userTwoCookie = global.signin();

  // Create one order as user 1
  const { body: orderOne } = await createOrder(
    app,
    ticketOne.id,
    userOneCookie
  );

  // Create two orders as user 2
  const { body: orderTwo } = await createOrder(
    app,
    ticketTwo.id,
    userTwoCookie
  );
  const { body: orderThree } = await createOrder(
    app,
    ticketThree.id,
    userTwoCookie
  );

  // Make request for orders for user 2

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwoCookie)
    .send()
    .expect(200);
  // Make sure we dont have the orders for user 1
  expect(response.body.length).toEqual(2);
  expect(response.body).toContainEqual(orderTwo);
  expect(response.body).toContainEqual(orderThree);
  expect(response.body).not.toContainEqual(orderOne);
});
