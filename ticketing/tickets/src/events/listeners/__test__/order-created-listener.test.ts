import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@sjoedwards/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "./../../../nats-wrapper";
import { OrderCreatedListener } from "./../order-created-listener";
const setup = async () => {
  // Create instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // Create and save a ticket

  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "asdf",
  });

  // Create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    userId: "asdasd",
    status: OrderStatus.Created,
    expiresAt: "asdasd",
    version: 0,
    ticket: {
      id: ticket.id
      price: ticket.price
    }
  };
};
