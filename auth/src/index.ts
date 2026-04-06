import mongoose from "mongoose";
import { app } from "./app";

const startUp = async () => {
    if(!process.env.jwt_key) {
        throw new Error('JWT Secret not defined in auth-depl.yaml');
    }
    
    try {
        await mongoose.connect('mongodb://auth-mongo-service:27017');
    } catch (error) {
        console.error(error);
    }
    app.listen(4000, () => {
        console.log('Auth service running on http://ticket-shop.docker. Also, connected to Mongo.');
    });
}

startUp();