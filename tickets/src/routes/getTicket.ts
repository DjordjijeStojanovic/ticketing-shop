import express, { Request, Response } from 'express';
import { RouteNotFoundError, requireAuthToAccessRoutes, validateRequest } from '@djordjestojanovic/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id',
    validateRequest, requireAuthToAccessRoutes, 
    async (req: Request, res: Response) => {
    
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if(!ticket) {
        throw new RouteNotFoundError();
    }

    return res.status(200).json({ ticket: ticket });
});

export { router as getTicketRouter };