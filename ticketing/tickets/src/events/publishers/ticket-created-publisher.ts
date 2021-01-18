import { TicketCreatedEvent, Publisher, Subjects } from "@sjoedwards/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
