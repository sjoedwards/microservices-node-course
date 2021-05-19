import { Publisher, OrderCancelledEvent, Subjects } from "@sjoedwards/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
