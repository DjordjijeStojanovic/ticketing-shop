import request from 'supertest';
import { Ticket } from "../../models/ticket";
import { app } from '../../app';
import mongoose from 'mongoose';

const endpoint = '/api/tickets';

it('Return 404 if a ticket can\'t\' be found', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .get(`${endpoint}/${ticketId}`)
        .set('Cookie', global.fakeAuth())
        .expect(404)
});

it('Get a ticket by ID', async () => {
    const ticket = await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({
            title: 'New ticket',
            price: 20
        })
        .expect(201)
    
    const ticketId = ticket.body.ticket.id;
    
    const response = await request(app)
        .get(`${endpoint}/${ticketId}`)
        .set('Cookie', global.fakeAuth())
        .send()
        .expect(200)
        

});