import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
import nats from "node-nats-streaming";

console.clear();

// Stan is just a client
const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  console.log("publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
      userId: "test",
    });
  } catch (e) {
    console.error(`error`, e);
  }
});
