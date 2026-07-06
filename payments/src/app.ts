//App configuration file

import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler } from '@djordjestojanovic/common';
import { RouteNotFoundError } from '@djordjestojanovic/common';
import { currentUser } from '@djordjestojanovic/common';
import { createPaymentRouter } from './routes/createPayment';
import { stripeWebhookRouter } from './routes/stripeWebhook';

const app = express();

app.set('trust proxy', true);

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: false
}));

app.use(currentUser);
app.use(createPaymentRouter);
app.use(stripeWebhookRouter);

app.all('*', async (req, res) => {
    throw new RouteNotFoundError();
});

app.use(errorHandler);

export { app };