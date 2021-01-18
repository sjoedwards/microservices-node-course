import { TicketUpdatedEvent, Publisher, Subjects } from "@sjoedwards/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
