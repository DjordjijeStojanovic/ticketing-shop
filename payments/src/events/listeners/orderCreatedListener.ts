import { Listener, OrderCreatedEvent, Subjects } from "@djordjestojanovic/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const { id, ticket, status, userId, version } = data;
        const order = Order.build({
            id: id,
            price: ticket.price,
            status: status,
            userId: userId,
            version: version
        });

        await order.save();
        msg.ack();
    }
}