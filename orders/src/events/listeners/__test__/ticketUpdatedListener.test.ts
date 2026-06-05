import { TicketUpdatedEvent } from "@djordjestojanovic/common";
import { natsWrapper } from "../../../natsClient";
import { TicketUpdatedListener } from "../ticketUpdatedListener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const testSetup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'new ticket',
        price: 20
    });

    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket._id.toHexString(),
        version: ticket.version+1,
        title: 'Updated title',
        price: 5,
        userId: new mongoose.Types.ObjectId().toHexString(),
        orderId: new mongoose.Types.ObjectId().toHexString()
    }

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { ticket, listener, data, message };
};

it('Updates and saves a ticket', async () => {
    const { ticket, listener, data, message} = await testSetup();

    await listener.onMessage(data, message);

    const fetchTicket = await Ticket.findById(ticket._id);

    expect(fetchTicket.title).toEqual(data.title);
    expect(fetchTicket.price).toEqual(data.price);

});

it('Acknowledges a message', async () => {
    const { data, message, listener } = await testSetup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it('Doesn\'t\ acknowledge an event if the version is in the future', async () => {
    const { message, data, listener, ticket } = await testSetup();

    data.version = 5;

    try {
        await listener.onMessage(data, message);
    } catch (error) {
        
    }

    expect(message.ack).not.toHaveBeenCalled();
});