import { requireAuthToAccessRoutes, RouteNotFoundError, UnauthorizedAccessError } from '@djordjestojanovic/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:id', 
    requireAuthToAccessRoutes,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const order = await Order.findById(id).populate('ticket');
        
        if(!order) {
            throw new RouteNotFoundError();
        }

        if(order.userId !== req.currentUser.id) {
            throw new UnauthorizedAccessError();
        }

    res.json(order);
});

export { router as getOrderRouter };