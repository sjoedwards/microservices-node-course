import { buildTicket, createOrder } from "./../../test/utils";
import request from "supertest";
import { app } from "../../app";

test("fetches the order", async () => {
  // Create the ticket
  const ticket = await buildTicket();
  const user = global.signin();
  const { body: order } = await createOrder(app, ticket.id, user);
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder).toEqual(order);
});

test("returns an error if a user tries to fetch another users order", async () => {
  // Create the ticket
  const ticket = await buildTicket();
  const user = global.signin();
  const differentUser = global.signin();
  const { body: order } = await createOrder(app, ticket.id, user);
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", differentUser)
    .send()
    .expect(401);
});
