import { app } from "../../app";
import request from 'supertest';
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import e from "express";

const endpoint = '/api/orders';

const createTicket = async () => {
    const ticket = Ticket.build({
        title: 'Test ticket',
        price: 20.0
    });

    await ticket.save();

    return ticket;
};

it('Returns 401 if the user is not authenticated', async () => {

});

it('Succesfully fetches order by user ID', async () => {
    const ticketOne = await createTicket();
    const ticketTwo = await createTicket();
    const ticketThree = await createTicket();

    const firstUser = global.fakeAuth();
    const secondUser = global.fakeAuth();

    const { body: orderOne } = await request(app)
        .post(endpoint)
        .set('Cookie', firstUser)
        .send({
            ticketId: ticketOne._id
        })
        .expect(201);

    const { body: orderTwo } = await request(app)
        .post(endpoint)
        .set('Cookie', secondUser)
        .send({
            ticketId: ticketTwo._id
        })
        .expect(201)

     const { body: orderThree } = await request(app)
        .post(endpoint)
        .set('Cookie', secondUser)
        .send({
            ticketId: ticketThree._id
        })
        .expect(201)

    const response = await request(app)
        .get(endpoint)
        .set('Cookie', secondUser)
        .expect(200);
    
    expect(response.body.length).toEqual(2);

    expect(response.body[0].id).toEqual(orderTwo.order.id);
    expect(response.body[1].id).toEqual(orderThree.order.id);
    
    expect(response.body[0].ticket.id).toEqual(ticketTwo._id.toString());
    expect(response.body[1].ticket.id).toEqual(ticketThree._id.toString());

});