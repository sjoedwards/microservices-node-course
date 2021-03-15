import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Listener, Subjects, OrderCreatedEvent } from "@sjoedwards/common";
import { expirationQueue } from "../../queues/expiration.queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    console.log(data);
    await expirationQueue.add({ orderId: data.id });

    msg.ack();
  }
}
