import request from 'supertest';
import { app } from '../../app';

const endpoint = '/api/users/signout';
const signUpEndpoint = '/api/users/signup';

it('Removes the cookie from a session', async () => {
    await request(app)
        .post(signUpEndpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(201)

    const response = await request(app)
        .post(endpoint)
        .send({})
        .expect(200)

    expect(response.get('Set-Cookie')[0]).toBeDefined();
});