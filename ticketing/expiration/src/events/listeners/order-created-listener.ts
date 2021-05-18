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
    // Takes the expiray ISO and then turns it into a no of milliseconds
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay} milliseconds to process the job`);
    await expirationQueue.add({ orderId: data.id });

    msg.ack();
  }
}
