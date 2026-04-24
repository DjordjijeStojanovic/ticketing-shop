import { app } from "../../app";
import request from 'supertest';

const endpoint = '/api/tickets';

const createTicket = () => {
    return request(app)
        .post(endpoint)
        .set('Cookie', global.fakeAuth())
        .send({
            title: 'New ticket',
            price: '20.0'
        })
}

it('Return a list of all the tickets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get(endpoint)
        .send()
        .expect(200)
    
});