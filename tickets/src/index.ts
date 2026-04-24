import mongoose from "mongoose";
import { app } from "./app";

const startUp = async () => {
    if(!process.env.jwt_key) {
        throw new Error('JWT Secret not defined in auth-depl.yaml');
    }
    if(!process.env.mongo_uri) {
        throw new Error('Mongo URI has to be defined in tickets-depl.yaml');
    }
    try { 
        await mongoose.connect(process.env.mongo_uri);
    } catch (error) {
        console.error(error);
    }
    app.listen(4000, () => {
        console.log('Tickets service running on http://ticket-shop.docker. Also, connected to Mongo.');
    });
}

startUp();