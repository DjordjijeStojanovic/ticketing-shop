import express, { Request, Response } from 'express';
import { BadHTTPRequestError, OrderStatus, requireAuthToAccessRoutes, RouteNotFoundError, validateRequest } from '@djordjestojanovic/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/orderCreatedPublisher';
import { natsWrapper } from '../natsClient';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/api/orders', 
    requireAuthToAccessRoutes, [ 
        body('ticketId')
        .notEmpty()
        .custom((input: string) => {
            return mongoose.Types.ObjectId.isValid(input)
        })
        .withMessage('Ticket ID has to be provided')
    ], validateRequest, 
    async (req: Request, res: Response) => {

    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    
    if(!ticket) {
        throw new RouteNotFoundError();
    }

    const ticketReserved = await ticket.isReserved();

    if(ticketReserved) {
        throw new BadHTTPRequestError('The ticket you are trying to purchase is currently reserved. Please try again in 15 minutes');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
        userId: req.currentUser.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    });

    await order.save();

    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order._id.toString(),
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });

    res.status(201).json({
        result: 'Order succesfully created',
        order
    });
});

export { router as createOrderRouter };