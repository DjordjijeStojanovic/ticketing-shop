import request from 'supertest';
import { app } from '../../app';

const endpoint = '/api/users/signup';

it('Sign up a new user/create a new User document', async () => {
    return request(app)
        .post(endpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(201);
});

it('Returns a status code 400 with an invalid email', async () => {
    return request(app)
        .post(endpoint)
        .send({
            email: '@test.com',
            password: '1234'
        })
        .expect(400)
});

it('Returns a status code 400 with an invalid password', async () => {
    return request(app)
        .post(endpoint)
        .send({
            email: 'test@test.com',
            password: '1'
        })
        .expect(400)
});

it('Returns a status code 400 with missing credentials', async () => {
    return request(app)
        .post(endpoint)
        .send({})
        .expect(400)
});

it('Disallow users to create account twice with the same email', async () => {
    await request(app)
        .post(endpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(201);

    await request(app)
        .post(endpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(400);
});

it('Sets a cookie after a successful HTTP request for a signup', async () => {
    const response = await request(app)
        .post(endpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined();
});