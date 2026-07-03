import mongoose from "mongoose";
import { stripe } from "../stripe";


interface PaymentAttributes {
    orderId: string;
    sessionId: string;
}

interface PaymentDocument extends mongoose.Document {
    orderId: string;
    sessionId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDocument> {
    build(attributes: PaymentAttributes): PaymentDocument;
    createCheckoutSession(order: CheckoutOrderData): ReturnType<typeof stripe.checkout.sessions.create>
}

interface CheckoutOrderData {
    id: string;
    price: number;
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    }, sessionId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id
        }
    }
});

paymentSchema.statics.build = (attributes: PaymentAttributes) => {
    return new Payment(attributes);
}

paymentSchema.statics.createCheckoutSession = async (order: CheckoutOrderData) => {
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: order.price * 100,
                    product_data: {
                        name: `Order ${order.id}`
                    }
                },
                quantity: 1
            }
        ],
        metadata: { orderId: order.id },
        success_url: `https://ticket-shop.docker/orders/${order.id}?success=true`,
        cancel_url: `https://ticket-shop.docker/orders/${order.id}`
    });
    return session;
}

const Payment = mongoose.model<PaymentDocument, PaymentModel>('Payment', paymentSchema);

export { Payment };