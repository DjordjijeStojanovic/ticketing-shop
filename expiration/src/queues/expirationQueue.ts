import Queue, { Job } from "bull";
import { ExpirationCompletedPublisher } from "../events/publishers/expirationCompletedPublisher";
import { natsWrapper } from "../natsClient";

interface JobPayload {
    orderId: string;

}

const expirationQueue = new Queue<JobPayload>('order-expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
   const orderId = job.data.orderId;
   new ExpirationCompletedPublisher(natsWrapper.client).publish({ orderId });
});

export { expirationQueue };