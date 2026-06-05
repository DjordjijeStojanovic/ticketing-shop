import { Ticket } from "../ticket";

it('Implements concurrency control', async () => {
    const ticket = Ticket.build({
        title: 'New ticket',
        price: 20.0,
        userId: '123'
    });

    await ticket.save();

    const ticketOne = await Ticket.findById(ticket._id);
    const ticketTwo = await Ticket.findById(ticket._id);

    ticketOne.set({
        price: 10.0
    });

    ticketTwo.set({
        price: 30.0
    });

    await ticketOne.save();
    
    try {
        await ticketTwo.save();
    } catch (error) {
        return;
    }

    throw new Error('This should not be reached by this test');
});

it('Increments the version number after save', async () => {
    const ticket = Ticket.build({
        title: 'New ticket',
        price: 5.0,
        userId: '123'
    });

    await ticket.save();

    expect(ticket.version).toEqual(0);

    await ticket.save();

    expect(ticket.version).toEqual(1);
});