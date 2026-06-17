import { requireAuthToAccessRoutes, RouteNotFoundError, UnauthorizedAccessError } from '@djordjestojanovic/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderStatus } from '@djordjestojanovic/common';
import { OrderCanceledPublisher } from '../events/publishers/orderCanceledPublisher';
import { natsWrapper } from '../natsClient';

const router = express.Router();

router.put('/api/orders/:id', 
    requireAuthToAccessRoutes,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        
        const order =  await Order.findById(id).populate('ticket');

        if(!order) { 
            throw new RouteNotFoundError();
        }

        if(order.userId !== req.currentUser.id) {
            throw new UnauthorizedAccessError();
        }

        order.status = OrderStatus.Canceled;
        await order.save();

        await new OrderCanceledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            userId: order.userId,
            ticket: {
                id: order.ticket._id.toString(),
                price: order.ticket.price
            }
        })

    res.status(204).json({ result: 'Order succesfully canceled', order });
});

export { router as cancelOrderRouter };