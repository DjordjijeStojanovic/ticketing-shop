import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { get } from 'mongoose';
import jwt from 'jsonwebtoken';
jest.mock('../natsClient')

let mongo: any;

declare global {
    namespace NodeJS {
        interface Global {
            fakeAuth(): string[]
        }
    }
}

process.env.STRIPE_KEY = 'sk_test_51Tgns3C1v2gTabft6hA2PvPJ86F8O2ydOeittRsznN2B5DG9YRv1b8sA9gscUgyq78bgyn15vMxll4aqAyUBlNpT00mM0HjPn1';

beforeAll(async () => {
    process.env.JWT_KEY = 'test_secret';
    mongo = await MongoMemoryServer.create();
    const getUri = mongo.getUri();

    await mongoose.connect(getUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.fakeAuth = (id?: string) => {
    //Building a fake JWT for test suite with { id, email, iat }
    const user = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const userJwt = jwt.sign(user, process.env.JWT_KEY);
    const session = JSON.stringify({ jwt: userJwt });
    const encodedJWT = Buffer.from(session).toString('base64');

    return [ `session=${encodedJWT}` ];
}