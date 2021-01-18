import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Attempted to obtain client prior to initialisation");
    } else {
      return this._client;
    }
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this._client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this._client.on("error", (error) => {
        reject(error);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
