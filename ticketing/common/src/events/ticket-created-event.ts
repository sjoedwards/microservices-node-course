import { NatEvent } from "./events";
import { Subjects } from "./subjects";

export interface TicketCreatedEvent extends NatEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
