import { ExpirationCompletedEvent, Listener, OrderStatus, Subjects } from "@djordjestojanovic/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCanceledPublisher } from "../publishers/orderCanceledPublisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
    queueGroupName = queueGroupName;
    async onMessage(data: ExpirationCompletedEvent['data'], msg: Message): Promise<void> {
        const { orderId } = data;

        const order = await Order.findById(orderId).populate('ticket');

        if(!order) throw new Error(`Order with an id ${orderId} could not be found.`);

        order.set({ status: OrderStatus.Canceled });
        await order.save();

        new OrderCanceledPublisher(this.client).publish({ 
            id: order.id,
            version: order.version,
            userId: order.userId,
            ticket: {
                id: order.ticket._id.toHexString(),
                price: order.ticket.price
            }
         });

         msg.ack();
    }
}