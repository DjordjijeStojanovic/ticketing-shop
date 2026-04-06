import request from 'supertest';
import { app } from '../../app';

const endpoint = '/api/users/me';

it('Get details (object) about the current user', async () => {
    const cookie = await global.signup();
    
    const response = await request(app)
        .get(endpoint)
        .set('Cookie', cookie)
        .send()
        .expect(200)
});

it('Returns null if user is not authenticated', async () => {
    const response = await request(app)
        .get(endpoint)
        .send({})
        .expect(200)
    
    expect(response.body.user === null);
})