//App configuration file

import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler } from '@djordjestojanovic/common';
import { RouteNotFoundError } from '@djordjestojanovic/common';
import { currentUser } from '@djordjestojanovic/common';
import { createPaymentRouter } from './routes/createPayment';

const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production'
}));

app.use(currentUser);
app.use(createPaymentRouter);

app.all('*', async (req, res) => {
    throw new RouteNotFoundError();
});

app.use(errorHandler);

export { app };