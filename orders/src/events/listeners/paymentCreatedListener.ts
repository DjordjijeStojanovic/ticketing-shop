import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@djordjestojanovic/common";
import { SubdocsToPOJOs } from "mongoose";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {
        const { id, orderId, chargeId } = data;
        const order = await Order.findById(orderId);

        if(!order) {
            throw new Error(`Order ${orderId} has not been found`);
        }

        order.set({ status: OrderStatus.Completed });
        await order.save();

        msg.ack();
    }
}