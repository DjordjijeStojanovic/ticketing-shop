import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { get } from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

let mongo: any;

declare global {
    namespace NodeJS {
        interface Global {
            fakeAuth(): string[]
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

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.fakeAuth = () => {
    //Building a fake JWT for test suite with { id, email, iat }
    const user = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const userJwt = jwt.sign(user, process.env.jwt_key);
    const session = JSON.stringify({ jwt: userJwt });
    const encodedJWT = Buffer.from(session).toString('base64');

    return [ `session=${encodedJWT}` ];
}