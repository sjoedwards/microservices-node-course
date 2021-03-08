import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Subjects, OrderCreatedEvent, Listener } from "@sjoedwards/common";
import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket - throw an error
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // Mark ticket as reserved by setting orderId property
    ticket.set({ orderId: data.id });
    // Save the ticket
    await ticket.save();
    // Ack the message
    msg.ack();
  }
}
