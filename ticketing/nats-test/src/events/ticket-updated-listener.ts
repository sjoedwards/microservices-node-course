import { Message } from "node-nats-streaming";
import { Subjects, TicketUpdatedEvent, Listener } from "@sjoedwards/common";

// TicketCreatedEvent fufills the interface fo Event (has a subject and data)
class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  // Readonly specifies that the type cannot be changed in the future
  // Alternatively we have to bind this as subject:Subjects.TicketCreated, as it has to be exactly TicketCreatedEvent["subject"]
  readonly subject = Subjects.TicketUpdated;

  queueGroupName = "payments-service";

  onMessage(data: TicketUpdatedEvent["data"], msg: Message): void {
    console.log("message parsed", data);
    msg.ack();
  }
}

export { TicketUpdatedListener };
