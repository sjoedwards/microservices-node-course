import { OrderStatus } from "@sjoedwards/common";
import { Types } from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";

it("returns a 404 when purchasing an order that doesn`t exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ token: "12334", orderId: Types.ObjectId().toHexString() })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesn`t belong to the user", async () => {
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId: Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ token: "12334", orderId: order.id })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    userId: Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    price: 20,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(order.userId))
    .send({ token: "12334", orderId: order.id })
    .expect(400);
});
