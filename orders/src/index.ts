import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./natsClient";
import { TicketCreatedListener } from "./events/listeners/ticketCreatedListener";
import { TicketUpdatedListener } from "./events/listeners/ticketUpdatedListener";
import { ExpirationCompletedListener } from "./events/listeners/expirationCompletedListener";

const startUp = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT Secret not defined in auth-depl.yaml");
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
            console.log("NATS streaming connection closed");
            process.exit();
        });

        process.on("SIGINT", () => {
            return natsWrapper.client.close();
        });
        process.on("SIGTERM", () => {
            return natsWrapper.client.close();
        });

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();

        new ExpirationCompletedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(error);
    }
    app.listen(4000, () => {
        console.log(
            "Orders service running on http://ticket-shop.docker. Also, connected to Mongo."
        );
    });
};

startUp();
