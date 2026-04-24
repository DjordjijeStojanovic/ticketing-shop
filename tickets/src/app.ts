//App configuration file

import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler } from '@djordjestojanovic/common';
import { RouteNotFoundError } from '@djordjestojanovic/common';
import { currentUser } from '@djordjestojanovic/common';
import { createTicketRouter } from './routes/createTicket';
import { getTicketRouter } from './routes/getTicket';
import { listTicketsRouter } from './routes/listTickets';
import { updateTicketRouter } from './routes/updateTicket';

const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production'
}));

app.use(currentUser);
app.use(createTicketRouter);
app.use(getTicketRouter);
app.use(listTicketsRouter);
app.use(updateTicketRouter)

app.all('*', async (req, res) => {
    throw new RouteNotFoundError();
});

app.use(errorHandler);

export { app };