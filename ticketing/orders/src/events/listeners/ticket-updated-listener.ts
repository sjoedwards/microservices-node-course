import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@sjoedwards/common";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { title, price } = data;

    // Find a ticket in the orders database with a version one below the one coming in in the event...
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found!");
    }

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
    return;
  }
}
