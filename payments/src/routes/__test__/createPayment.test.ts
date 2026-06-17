import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@djordjestojanovic/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

const endpoint = '/api/payments';

it('Returns 404 if user tries to purchase an order that does not exist', async () => {
    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({
            token: 'token',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
});

it('Returns 401 if unauthenticated user tried to make a payment', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(), 
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({ 
            token: 'token',
            orderId: order._id.toHexString()
        })
        .expect(401)
});

it('Returns 400 if the user tries to purchase a canceled order', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(), 
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    const authenticatedUser = global.fakeAuth(order.userId);

    const fetchedOrder = await Order.findById(order._id.toHexString());

    fetchedOrder.set({
        status: OrderStatus.Canceled
    });

    await fetchedOrder.save();

    const response = await request(app)
        .post(endpoint)
        .set('Cookie', authenticatedUser)
        .send({
            token: 'token',
            orderId: fetchedOrder.id
        })
        .expect(400)
});

it('Creates a successful charge', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(), 
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    const authenticatedUser = global.fakeAuth(order.userId);
    const fetchedOrder = await Order.findById(order._id.toHexString());


    await request(app)
        .post(endpoint)
        .set('Cookie', authenticatedUser)
        .send({
            token: 'tok_visa',
            orderId: fetchedOrder.id
        })
        .expect(204)
    
    const mockUpFunc = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    
    expect(mockUpFunc.source).toEqual('tok_visa');
    expect(mockUpFunc.amount).toEqual(20 * 100);
    expect(mockUpFunc.currency).toEqual('usd');
});
