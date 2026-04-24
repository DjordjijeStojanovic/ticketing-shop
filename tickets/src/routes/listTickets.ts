import express, { Request, Response } from 'express';
import { RouteNotFoundError, requireAuthToAccessRoutes, validateRequest } from '@djordjestojanovic/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
    res.status(200).json(tickets);
});

export { router as listTicketsRouter };