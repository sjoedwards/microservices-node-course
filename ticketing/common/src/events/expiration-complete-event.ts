import { Subjects } from "./subjects";

export interface ExpirationCompleteEvent {
  subject: Subjects.ExpriationComplete;
  data: {
    id: string;
  };
}
