import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@sjoedwards/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpriationComplete = Subjects.ExpriationComplete;
}