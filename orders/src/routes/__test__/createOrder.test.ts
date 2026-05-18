import { app } from "../../app";
import request from 'supertest';
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@djordjestojanovic/common";
import { natsWrapper } from "../../natsClient";

const endpoint = '/api/orders';

it('Return an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({
            ticketId: ticketId
        })
        .expect(404);
});

it('Returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'New ticket',
        price: 20.0
    });

    await ticket.save();

    const order = Order.build({
        ticket: ticket,
        userId: '1',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();

    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({ ticketId: ticket._id })
        .expect(400);
});

it('Reserves a ticket succesfully', async () => {
    const ticket = Ticket.build({
        title: 'New ticket',
        price: 20.0
    });

    await ticket.save();

    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({ ticketId: ticket._id })
        .expect(201);
});

it('Emits an event once the order is created', async () => {
    const ticket = Ticket.build({
        title: 'New ticket',
        price: 20.0
    });

    await ticket.save();

    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({ ticketId: ticket._id })
        .expect(201);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});