import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./natsClient";
import { OrderCreatedListener } from "./events/listeners/orderCreatedListener";
import { OrderCanceledListener } from "./events/listeners/orderCanceledListener";

const serverInit = async () => {
    console.log('Starting Payments service');
    
    if (!process.env.JWT_KEY) {
        throw new Error("JWT Secret not defined in tickets-depl.yaml");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("Mongo URI has to be defined in tickets-depl.yaml");
    }

    if(!process.env.NATS_URL) {
        throw new Error('NATS streaming URL has to be defined in tickets-depl.yaml');
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('Cluster ID has to be defined in tickets-depl.yaml');
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('Client ID has to be defined in tickets-depl.yaml');
    }

    try {
        await natsWrapper.onConnect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        
        natsWrapper.client.on("close", () => {
            console.log("[Tickets] NATS streaming connection closed");
            process.exit();
        });

        process.on("SIGINT", () => {
            return natsWrapper.client.close();
        }); 
        process.on("SIGTERM", () => {
            return natsWrapper.client.close();
        });

        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCanceledListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(`[Tickets] ${error}`);
    }
    app.listen(4000, () => {
        console.log(
            "Tickets service running on http://ticket-shop.docker. Also, connected to Mongo."
        );
    });
};

serverInit();
