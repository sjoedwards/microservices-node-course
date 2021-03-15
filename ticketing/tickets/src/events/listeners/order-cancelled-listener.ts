import { Message } from "node-nats-streaming";
import { queueGroupName } from "./../../../../orders/src/events/listeners/queue-group-name";
import { Subjects } from "./../../../../common/src/events/subjects";
import { Listener, OrderCancelledEvent } from "@sjoedwards/common";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {}
}
