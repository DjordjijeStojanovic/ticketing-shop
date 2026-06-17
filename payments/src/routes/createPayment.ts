import { BadHTTPRequestError, OrderStatus, requireAuthToAccessRoutes, RouteNotFoundError, UnauthorizedAccessError, validateRequest } from '@djordjestojanovic/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';

const router = express.Router();

router.post('/api/payments', 
    requireAuthToAccessRoutes, [
        body('token').not().isEmpty().withMessage('Token from Stripe is missing'),
        body('orderId').not().isEmpty().withMessage('Order Id is missing')
    ], validateRequest,
    async (req: Request, res: Response) => { 
        const { orderId, token } = req.body;

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

        const response = await stripe.charges.create({
            amount: order.price * 100,
            currency: 'usd',
            source: token
        });

        res.status(204).json({ success: true, result: response });
});

export { router as createPaymentRouter };