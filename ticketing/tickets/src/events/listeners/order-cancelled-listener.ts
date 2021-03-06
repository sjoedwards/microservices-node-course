import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "./../publishers/ticket-updated-publisher";
import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects } from "@sjoedwards/common";
import { Ticket } from "../../models/ticket";
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    const { id, price, title, userId, orderId, version } = ticket;
    await new TicketUpdatedPublisher(this.client).publish({
      id,
      price,
      title,
      userId,
      orderId,
      version,
    });

    msg.ack();
  }
}
