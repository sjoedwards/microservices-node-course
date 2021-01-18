import { Subjects, TicketCreatedEvent, Publisher } from "@sjoedwards/common";
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
