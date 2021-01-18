// Create random string with numbers and letters
import { randomBytes } from "crypto";
import nats, { Message, Stan } from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  stan.on("close", () => {
    console.log("Closing client");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// Intercepting...
// If interrupted or terminated, close the stan client before you exit
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
