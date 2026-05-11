import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), { url: 'http://localhost:4222 ' });

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('STAN Listener connection closed.');
        process.exit();
    });

    const options = 
        stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('test-service')

    const subscritpion = stan.subscribe(
        'ticket-created', 
        'test-service-queue', 
        options
    );
    subscritpion.on('message', (message: Message) => {
        console.log(`Received event ${message.getSequence()}, delivered: ${message.isRedelivered()}, with data: 
            ${message.getData()}`);
        message.ack();
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());