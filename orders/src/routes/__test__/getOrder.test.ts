import { app } from "../../app";
import request from 'supertest';
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const endpoint = '/api/orders';

it('Returns an order by ID', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Test ticket',
        price: 20.0
    });

    await ticket.save();

    const user = global.fakeAuth();

    const { body: order } = await request(app)
        .post(endpoint)
        .set('Cookie', user)
        .send({ ticketId: ticket._id })
        .expect(201);

    const orderId = order.order.id;

    await request(app)
        .get(`${endpoint}/${orderId}`)
        .set('Cookie', user)
        .send()
        .expect(200);
});

it('Returns a 401 if trying to access someone else\'s order', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Test ticket',
        price: 20.0
    });

    await ticket.save();

    const user = global.fakeAuth();

    const { body: order } = await request(app)
        .post(endpoint)
        .set('Cookie', user)
        .send({ ticketId: ticket._id })
        .expect(201);

    const orderId = order.order.id;

    await request(app)
        .get(`${endpoint}/${orderId}`)
        .set('Cookie', global.fakeAuth())
        .send()
        .expect(401);
});