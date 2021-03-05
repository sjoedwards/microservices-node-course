import { ObjectId } from "mongoose";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@sjoedwards/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // Create instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // Create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

test("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket.title).toEqual(data.title);
  expect(ticket.price).toEqual(data.price);
});

test("acks the message", async () => {
  const { listener, data, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // write assertions to make sure ack function was called
  expect(msg.ack).toBeCalledTimes(1);
});
