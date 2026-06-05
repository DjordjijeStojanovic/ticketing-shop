import { TicketCreatedEvent } from "@djordjestojanovic/common";
import { natsWrapper } from "../../../natsClient";
import { TicketCreatedListener } from "../ticketCreatedListener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const testSetup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client);

    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 1,
        title: 'Title',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    //@ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { listener, data, message };
};

it('Creates and saves a ticket', async () => {
    const { listener, data, message } = await testSetup();

    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket.title).toEqual(data.title);
    expect(ticket.price).toEqual(data.price);
});

it('Acknowledges a message', async () => {
    const { listener, data, message } = await testSetup();
    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});