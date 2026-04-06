import request from 'supertest';
import { app } from '../../app';

const endpoint = '/api/users/signin';
const signUpEndpoint = '/api/users/signup';

it('Fails when the email does not exist in the DB', async () => {
    await request(app)
        .post(endpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(400)
});

it('Succesfully signed the user in after creating an account first', async () => {
    await request(app)
        .post(signUpEndpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(201)

    await request(app)
        .post(endpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(200)
});

it('Fails when the user provides incorrect Email', async () => {
    await request(app)
        .post(signUpEndpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(201)

    await request(app)
        .post(endpoint)
        .send({
            email: '@test.com',
            password: '1234'
        })
        .expect(400)
});

it('Fails when the user provides incorrect Password', async () => {
    await request(app)
        .post(signUpEndpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(201)

    await request(app)
        .post(endpoint)
        .send({
            email: 'test@test.com',
            password: '123456'
        })
        .expect(400)
});

it('Cookie (JWT) is properly set in the response header', async () => {
    await request(app)
        .post(signUpEndpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(201)
    
    const response = await request(app)
        .post(endpoint)
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(200)
    expect(response.get('Set-Cookie')).toBeDefined();

})