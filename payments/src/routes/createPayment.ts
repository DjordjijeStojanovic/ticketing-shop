import { BadHTTPRequestError, OrderStatus, requireAuthToAccessRoutes, RouteNotFoundError, UnauthorizedAccessError, validateRequest } from '@djordjestojanovic/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/paymentCreatedPublisher';
import { natsWrapper } from '../natsClient';

const router = express.Router();

router.post('/api/payments', 
    requireAuthToAccessRoutes, [
        body('orderId').not().isEmpty().withMessage('Order Id is missing')
    ], validateRequest,
    async (req: Request, res: Response) => { 
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if(!order) {
            throw new RouteNotFoundError();
        }

        if(req.currentUser.id !== order.userId) {
            throw new UnauthorizedAccessError();
        }

        if(order.status === OrderStatus.Canceled) {
            throw new BadHTTPRequestError('The order you\'re trying to charge for is canceled.');
        }

        const session = await Payment.createCheckoutSession(order);

        try {
            const payment = Payment.build({ orderId, sessionId: session.id });
            await payment.save();
        } catch {
            throw new BadHTTPRequestError('A payment for this order has already been initiated.');
        }

        res.status(201).json({ url: session.url });
});

export { router as createPaymentRouter };