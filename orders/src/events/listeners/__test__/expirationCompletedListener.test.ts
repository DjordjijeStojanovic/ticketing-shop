import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../natsClient";
import { ExpirationCompletedListener } from "../expirationCompletedListener";
import { Order } from "../../../models/order";
import { ExpirationCompletedEvent, OrderStatus } from "@djordjestojanovic/common";

const testSetup = async () => {
    const listener = new ExpirationCompletedListener(natsWrapper.client);
    
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'New ticket',
        price: 20.0
    });

    await ticket.save();

    const order = Order.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    });

    await order.save();

    const data: ExpirationCompletedEvent['data'] = {
        orderId: order._id.toHexString()
    }

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { message, order, data, ticket, listener };
};

it('Updates the order status to canceled', async () => {
    const { listener, order, data, message } = await testSetup();

    await listener.onMessage(data, message);

    const fetchOrder = await Order.findById(order._id.toHexString());

    expect(fetchOrder.status).toEqual(OrderStatus.Canceled);
});

it('Emitted an orderCanceled event', async () => {
    const { listener, order, data, message } = await testSetup();

    await listener.onMessage(data, message);

    expect(JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]).id).toEqual(order._id.toHexString());

});

it('Acknowledges a message', async () => {
    const { data, message, listener } = await testSetup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});