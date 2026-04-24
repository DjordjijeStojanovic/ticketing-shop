import express, { Request, Response } from 'express';
import { requireAuthToAccessRoutes, validateRequest } from '@djordjestojanovic/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/tickets', [
    body('title').trim().not().isEmpty().withMessage('Please provide a ticket title/name!'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
], 
validateRequest, 
requireAuthToAccessRoutes, 
    async (req: Request, res: Response) => {

    const { title, price } = req.body;
    const ticket = Ticket.build({
        title: title, 
        price: price, 
        userId: req.currentUser.id 
    });
    await ticket.save();

    return res.status(201).json({ result: 'Ticket succesfully created! ', ticket: ticket });
});

export { router as createTicketRouter };