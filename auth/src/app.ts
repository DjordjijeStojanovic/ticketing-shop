//App configuration file

import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/currentUser';
import { signInRouter } from './routes/signIn';
import { signOutRouter } from './routes/signOut';
import { signUpRouter } from './routes/signUp';
import { errorHandler } from './middlewares/errorHandler';
import { RouteNotFoundError } from './errors/routeNotFound';

const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production'
}));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async (req, res) => {
    throw new RouteNotFoundError();
});

app.use(errorHandler);

export { app };