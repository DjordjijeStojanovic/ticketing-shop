import { OrderCanceledEvent, OrderStatus } from "@djordjestojanovic/common";
import { natsWrapper } from "../../../natsClient"
import { OrderCanceledListener } from "../orderCanceledListener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const testSetup = async () => {
    const listener = new OrderCanceledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    const data: OrderCanceledEvent['data'] = {
        id: order._id.toHexString(),
        version: order.version + 1,
        userId: order.userId,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: order.price
        }
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, data, message, order };
}

it('Listens for the order staus changing to canceled', async () => {
    const { listener, data, message } = await testSetup();
    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder.status).toEqual(OrderStatus.Canceled);
});

it('Acknowledges a message', async () => {
    const { listener, data, message } = await testSetup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();

});