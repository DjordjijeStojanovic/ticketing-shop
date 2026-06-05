import { app } from "../../app";
import request from 'supertest';
import mongoose from "mongoose";
import { natsWrapper } from "../../natsClient";
import { Ticket } from "../../models/ticket";

const endpoint = '/api/tickets';

it('Return 401 if the user is not authenticated and tries to update a ticket', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .put(`${endpoint}/${ticketId}`)
        .send({
            title: 'New title',
            price: 30.0
        })
        .expect(401)
});

it('Return 401 if the user does not own a ticket', async () => {
    const newTicket = await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({
            title: 'New ticket',
            price: 20.0
        })

    const ticketId = newTicket.body.ticket.id;

    const response = await request(app)
        .put(`${endpoint}/${ticketId}`)
        .set('Cookie', global.fakeAuth())
        .send({
            title: 'New title',
            price: 30.0
        })
        .expect(401)
});
it('Return 404 if the ticket ID does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`${endpoint}/${ticketId}`)
        .set('Cookie', global.fakeAuth())
        .send({
            title: 'New title',
            price: 40.0
        })
        .expect(404)
});
it('Return 400 if the user provides wrong title or price', async () => {
    const cookie = global.fakeAuth();
    const newTicket = await request(app)
        .post(endpoint)
        .set('Cookie', cookie)
        .send({
            title: 'New ticket',
            price: 20.0
        })

    const ticketId = newTicket.body.ticket.id;
    await request(app)
        .put(`${endpoint}/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 30.0
        })
        .expect(400)

    await request(app)
        .put(`${endpoint}/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: 'New title',
            price: ''
        })
        .expect(400)
});
it('Return 200 if the user succesfully updates a ticket', async () => {
    const cookie = global.fakeAuth();
    const newTicket = await request(app)
        .post(endpoint)
        .set('Cookie', cookie)
        .send({
            title: 'New ticket',
            price: 20.0
        })
        .expect(201)
    

    const ticketId = newTicket.body.ticket.id;

    const updatedTicket = await request(app)
        .put(`${endpoint}/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: 'New title',
            price: 30.0
        })
        .expect(200)
    
    expect(updatedTicket.body.title).toEqual('New title');
    expect(updatedTicket.body.price).toEqual(30.0);

});

it('Emits an event once the ticket is updated', async () => {
    const cookie = global.fakeAuth();
    const newTicket = await request(app)
        .post(endpoint)
        .set('Cookie', cookie)
        .send({
            title: 'New ticket',
            price: 20.0
        })
        .expect(201)
    

    const ticketId = newTicket.body.ticket.id;

    await request(app)
        .put(`${endpoint}/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: 'New title',
            price: 30.0
        })
        .expect(200)
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('Rejects an update if the ticket is reserved', async () => {
    const cookie = global.fakeAuth();
    const newTicket = await request(app)
        .post(endpoint)
        .set('Cookie', cookie)
        .send({
            title: 'New ticket',
            price: 20.0
        })
        .expect(201)
    

    const ticket = await Ticket.findById(newTicket.body.ticket.id);
    ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket.save();

    await request(app)
        .put(`${endpoint}/${newTicket.body.ticket.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'New title',
            price: 30.0
        })
        .expect(400)
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});