import express from 'express';
import 'express-async-errors';
import { currentUserRouter } from './routes/currentUser';
import { signInRouter } from './routes/signIn';
import { signOutRouter } from './routes/signOut';
import { signUpRouter } from './routes/signUp';
import { errorHandler } from './middlewares/errorHandler';
import { RouteNotFoundError } from './errors/routeNotFound';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async (req, res) => {
    throw new RouteNotFoundError();
});

app.use(errorHandler);

const startUp = async () => {
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