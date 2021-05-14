import { ExpirationCompletePublisher } from "../publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";
// Jobs are similar to an event
import Queue from "bull";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// Job is an object that wraps up the data
// This function is called when a job needs to be processed
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
