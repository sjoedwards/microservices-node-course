import { NatEvent } from "./events";
import { Stan } from "node-nats-streaming";
export abstract class Publisher<T extends NatEvent> {
  abstract subject: T["subject"];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        } else {
          console.log("Event Published");
          return resolve();
        }
      });
    });
  }
}
