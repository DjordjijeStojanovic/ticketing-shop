import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../natsClient"
import { OrderCreatedListener } from "../orderCreatedListener"
import { OrderCreatedEvent, OrderStatus } from "@djordjestojanovic/common";
import { Message } from "node-nats-streaming";

const testSetup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 20
        }
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, data, message };
}

it('Replicates the order information', async () => {
    const { listener, data, message } = await testSetup();
    await listener.onMessage(data, message);

    const order = await Order.findById(data.id);
    
    expect(order.price).toEqual(data.ticket.price);
});

it('Acknowledges a message', async () => {
    const { listener, data, message } = await testSetup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});