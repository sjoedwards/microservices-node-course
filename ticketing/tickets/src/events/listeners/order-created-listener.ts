import { TicketUpdatedPublisher } from "./../publishers/ticket-updated-publisher";
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

    // Client is protected - it resides on the instance of Listener when it is created
    const { id, price, title, userId, orderId, version } = ticket;
    await new TicketUpdatedPublisher(this.client).publish({
      id,
      price,
      title,
      userId,
      orderId,
      version,
    });
    // Ack the message
    msg.ack();
  }
}
