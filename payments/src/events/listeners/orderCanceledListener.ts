import { Listener, OrderCanceledEvent, OrderStatus, Subjects } from "@djordjestojanovic/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { Error } from "mongoose";

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
    async onMessage(data: OrderCanceledEvent['data'], msg: Message): Promise<void> {
        const { id, version } = data;
        const order = await Order.findOne({ 
            _id: id,
            version: version - 1
        });

        if(!order) {
            throw new Error(`Order with an id ${id} has not been found`);
        }

        order.set({
            status: OrderStatus.Canceled
        });
        await order.save();
        
        msg.ack();
    }
}