import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

// TicketCreatedEvent fufills the interface fo Event (has a subject and data)
class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // Readonly specifies that the type cannot be changed in the future
  // Alternatively we have to bind this as subject:Subjects.TicketCreated, as it has to be exactly TicketCreatedEvent["subject"]
  readonly subject = Subjects.TicketCreated;

  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("message parsed", data);
    msg.ack();
  }
}

export { TicketCreatedListener };
