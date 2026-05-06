import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), { url: 'http://localhost:4222 ' });

stan.on('connect', () => {
    console.log('Listener connected to NATS');
    const subscritpion = stan.subscribe('ticket-created');
    subscritpion.on('message', (message: Message) => {
        console.log(message.getData());
    });
});