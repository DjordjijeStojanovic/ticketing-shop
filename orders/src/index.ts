import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./natsClient";

const startUp = async () => {
    if (!process.env.jwt_key) {
        throw new Error("JWT Secret not defined in auth-depl.yaml");
    }

    if (!process.env.mongo_uri) {
        throw new Error("Mongo URI has to be defined in tickets-depl.yaml");
    }

    if(!process.env.nats_url) {
        throw new Error('NATS streaming URL has to be defined in tickets-depl.yaml');
    }

    if(!process.env.clusterId) {
        throw new Error('Cluster ID has to be defined in tickets-depl.yaml');
    }

    if(!process.env.clientId) {
        throw new Error('Client ID has to be defined in tickets-depl.yaml');
    }

    try {
        await natsWrapper.onConnect(
            process.env.clusterId,
            process.env.clientId,
            process.env.nats_url
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

        await mongoose.connect(process.env.mongo_uri);
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
