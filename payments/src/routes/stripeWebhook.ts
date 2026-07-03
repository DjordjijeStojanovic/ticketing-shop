import express, { Request, Response } from 'express';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/paymentCreatedPublisher';
import { natsWrapper } from '../natsClient';
import { BadHTTPRequestError, RouteNotFoundError } from '@djordjestojanovic/common';

const router = express.Router();

router.post('/api/payments/webhook', async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;

    let event: any;
    let charge: object;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
        throw new BadHTTPRequestError('[Payments] Stripe Webhook signtature process failed.');
    }

    if(event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if(!orderId) {
            throw new RouteNotFoundError();
        }

        const payment = await Payment.findOneAndUpdate(
            { orderId },
            { orderId, sessionId: session.id },
            { upsert: true, new: true }
        );

        await payment.save();

        charge = payment;

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment._id.toHexString(),
            orderId: payment.orderId,
            chargeId: payment.sessionId
        });

        console.log(payment)
    }

    res.status(200).json({ received: true, charge: charge  });
});

export { router as stripeWebhookRouter };
