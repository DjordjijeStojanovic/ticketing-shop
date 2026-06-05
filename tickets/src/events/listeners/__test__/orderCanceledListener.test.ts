import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../natsClient"
import { OrderCanceledListener } from "../orderCanceledListener"
import { OrderCanceledEvent, OrderStatus } from "@djordjestojanovic/common";

const testSetup = async () => {
    const listener = new OrderCanceledListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'New ticket',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    });

    const orderId = new mongoose.Types.ObjectId().toHexString();

    ticket.set({ orderId: orderId });

    await ticket.save();

    const data: OrderCanceledEvent['data'] = {
        id: orderId,
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, data, ticket, message, orderId };
}

it('Updates a ticket', async () => {
    const { listener, data, ticket, message, orderId } = await testSetup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket.orderId).toBeUndefined();
});

it('Acknowledges a message', async () => {
    const { listener, data, message } = await testSetup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it('Published a ticket canceled event', async () => {
    const { listener, data, message } = await testSetup();
    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});