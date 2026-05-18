import { requireAuthToAccessRoutes } from '@djordjestojanovic/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', 
    requireAuthToAccessRoutes, 
    async (req: Request, res: Response) => {
        const orders = await Order.find({
            userId: req.currentUser.id
        }).populate('ticket');

    res.status(200).json(orders);
});

export { router as listOrdersRouter };