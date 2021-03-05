import { NatEvent } from "./events";
import { Subjects } from "./subjects";

export interface TicketUpdatedEvent extends NatEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
  };
}
