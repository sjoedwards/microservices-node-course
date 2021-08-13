import { PaymentCreatedEvent, Publisher, Subjects } from "@sjoedwards/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
