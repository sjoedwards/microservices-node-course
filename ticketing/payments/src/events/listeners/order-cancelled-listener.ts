import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {
  Subjects,
  OrderCancelledEvent,
  Listener,
  OrderStatus,
} from "@sjoedwards/common";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    /*
      Only find the order if the version is current - 1
      Its -1 because we're looking to UPDATE a version in the database
      (i.e. the version we're updating in the db has to be the version in the event -1)
    */
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}
