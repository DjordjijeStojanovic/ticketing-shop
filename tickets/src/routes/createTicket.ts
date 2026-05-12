import express, { Request, Response } from 'express';
import { requireAuthToAccessRoutes, validateRequest } from '@djordjestojanovic/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticketCreatedPublisher';
import { natsWrapper } from '../natsClient';

const router = express.Router();

router.post(
    '/api/tickets',
    requireAuthToAccessRoutes,
    [
        body('title').trim().not().isEmpty().withMessage('Please provide a ticket title/name!'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { title, price } = req.body;
        const ticket = Ticket.build({
            title: title,
            price: price,
            userId: req.currentUser.id
        });
        await ticket.save();

        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket._id.toString(),
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });

        return res.status(201).json({ result: 'Ticket succesfully created! ', ticket: ticket });
    });

export { router as createTicketRouter };