import { OrderCreatedListener } from "./events/listeners/orderCreatedListener";
import { natsWrapper } from "./natsClient";

const serverInit = async () => {
    console.log('Starting Expiration service up!');
    
    if(!process.env.NATS_URL) {
        throw new Error('NATS streaming URL has to be defined in expiration-depl.yaml');
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('Cluster ID has to be defined in expiration-depl.yaml');
    }
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('Client ID has to be defined in expiration-depl.yaml');
    }

    try {
        await natsWrapper.onConnect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on('close', () => {
            console.log('[Expiration] NATS streaming connection closed');
            process.exit();
        });

        process.on('SIGINT', () => {
            return natsWrapper.client.close();
        });
        process.on('SIGTERM', () => {
            return natsWrapper.client.close();
        });

        new OrderCreatedListener(natsWrapper.client).listen();

    } catch (error) {
        console.error(`[Expiration] ${error}`)
    }
};

serverInit();