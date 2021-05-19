import { Message } from "node-nats-streaming";
import { ExpirationCompleteListener } from "./../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { Types } from "mongoose";
import { OrderStatus, ExpirationCompleteEvent } from "@sjoedwards/common";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "123",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { listener, order, ticket, data, message };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, data, message } = await setup();

  await listener.onMessage(data, message);
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it("emits an Order Cancelled event", async () => {
  const { listener, order, data, message } = await setup();
  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventOrderId = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  ).id;
  expect(eventOrderId).toEqual(order.id);
});

it("acks the message", async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
