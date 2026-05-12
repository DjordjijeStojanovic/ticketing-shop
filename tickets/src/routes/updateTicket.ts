import express, { Request, Response } from 'express';
import { Ticket } from "../models/ticket";
import { body } from 'express-validator';
import {
    requireAuthToAccessRoutes,
    validateRequest,
    RouteNotFoundError,
    UnauthorizedAccessError
} from '@djordjestojanovic/common';
import { TicketUpdatedPublisher } from '../events/publishers/ticketUpdatedPublisher';
import { natsWrapper } from '../natsClient';

const router = express.Router();

router.put('/api/tickets/:id',
    requireAuthToAccessRoutes,
    [
        body('title').trim().not().isEmpty().withMessage('Please provide a ticket title/name!'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { title, price } = req.body;
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            throw new RouteNotFoundError();
        }

        const currentUser = req.currentUser.id;

        if (ticket.userId !== currentUser) {
            throw new UnauthorizedAccessError();
        }

        ticket.set({
            title: title,
            price: price
        });

        await ticket.save();

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });

        res.json(ticket);
    });

export { router as updateTicketRouter };