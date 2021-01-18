import { Subjects } from "./subjects";
import { Message, Stan } from "node-nats-streaming";

interface Event {
  subject: Subjects;
  data: any;
}

// Have to provide an event!
abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;

  // TODO define type
  abstract onMessage(data: T["data"], msg: Message): void;

  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        // 'Set deliver all available' will receive all events
        .setDeliverAllAvailable()
        // Set the manual acknowledgement to true - so if theres no ack it will try again with a different listener member
        // Pretty much always want to set this
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        // Means that only un-ack'd events will get sent over to the listener
        .setDurableName(this.queueGroupName)
    );
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      // By subscribing to a queue group, means messages will
      // only be sent to one queue group member.
      // If 5 replicas of a listener, only one will receive it
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}

export { Listener };
