import { app } from "../../app";
import request from 'supertest';
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus } from "@djordjestojanovic/common";
import { natsWrapper } from "../../natsClient";
import mongoose from "mongoose";

const endpoint = '/api/orders';

it('Cancels an order succesfully', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'New ticket',
        price: 20.0
    });

    await ticket.save();

    const user = global.fakeAuth();

    const { body: order } = await request(app)
        .post(endpoint)
        .set('Cookie', user)
        .send({ ticketId: ticket._id })
        .expect(201);

    await request(app)
        .put(`${endpoint}/${order.order.id}`)
        .set('Cookie', global.fakeAuth())
        .send({})
        .expect(401);

    await request(app)
        .put(`${endpoint}/${order.order.id}`)
        .set('Cookie', user)
        .send({})
        .expect(204);

    const updatedOrder = await Order.findById(order.order.id);
    expect(updatedOrder.status).toEqual(OrderStatus.Canceled);
});

it('Emits an event once the order is canceled', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'New ticket',
        price: 20.0
    });

    await ticket.save();

    const user = global.fakeAuth();

    const { body: order } = await request(app)
        .post(endpoint)
        .set('Cookie', user)
        .send({ ticketId: ticket._id })
        .expect(201);
    
    await request(app)
        .put(`${endpoint}/${order.order.id}`)
        .set('Cookie', user)
        .send({})
        .expect(204);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});