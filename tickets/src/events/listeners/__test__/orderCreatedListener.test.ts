import { OrderCreatedEvent, OrderStatus } from "@djordjestojanovic/common";
import { natsWrapper } from "../../../natsClient";
import { OrderCreatedListener } from "../orderCreatedListener";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const testSetup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'Test ticket',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { message, data, listener, ticket };
};

it('Sets the userId on the order to the userId from a ticket', async () => {
    const { listener, ticket, data, message } = await testSetup();
    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket.orderId).toEqual(data.id)

});

it('Acknowledges a message', async () => {
    const { listener, data, message } = await testSetup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it('Published a ticket updated event', async () => {
    const { listener, data, message } = await testSetup();
    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedTicket = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    
    expect(data.id).toEqual(updatedTicket.orderId);
});