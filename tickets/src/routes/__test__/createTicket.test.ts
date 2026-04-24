import { app } from "../../app";
import request from 'supertest';
import { Ticket } from "../../models/ticket";

const endpoint = '/api/tickets';

it('Validate POST /api/tickets exist', async () => {
    const response = await request(app)
        .post(endpoint)
        .send({})
    expect(response.status).not.toEqual(404);
});

it('Only an authenticated user can make POST /api/tickets request', async () => {
    const response = await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({})
    expect(response.status).toEqual(400);
});

it('Returns status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({})
    expect(response.status).not.toEqual(401);
});

it('Returns 400 if the title is faulty', async () => {
    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({
            title: '',
            price: 20
        })
        .expect(400)
    
    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({
            price: 20
        })
        .expect(400)
});

it('Returns 400 if the price is faulty', async () => {
    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({
            title: 'New ticket',
            price: -10
        })
        .expect(400)
    
    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({
            title: 'New ticket'
        })
        .expect(400)
});

it('Creates a ticket with valid inputs', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({
            title: 'New ticket',
            price: 20
        })
        .expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual('New ticket');
    expect(tickets[0].price).toEqual('20');
});