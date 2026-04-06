import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { get } from 'mongoose';
import { app } from '../app';
import request from 'supertest';

let mongo: any;
const endpoint = '/api/users/signup';

declare global {
    namespace NodeJS {
        interface Global {
            signup(): Promise<string[]>
        }
    }
}

beforeAll(async () => {
    process.env.jwt_key = 'test_secret';
    mongo = await MongoMemoryServer.create();
    const getUri = mongo.getUri();

    await mongoose.connect(getUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    
    for(const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signup = async () => {
    const email = 'test@test.com', password = '1234';
    
    const response = await request(app)
        .post(endpoint)
        .send({
            email, password
        })
        .expect(201)

    const cookie = response.get('Set-Cookie');
    return cookie;
}