import { Stan, Message } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void;  

    private client: Stan;
    protected ackWait = 5 * 1000;

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setManualAckMode(true)
            .setDeliverAllAvailable()
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', (message: Message) => {
            console.log(`
                Message received. Subject: ${this.subject} / ${this.queueGroupName}`);
            const parsedData = this.parseMessage(message);
            this.onMessage(parsedData, message);
        })
    }

    parseMessage(message: Message) {
        const data = message.getData();

        return typeof data === 'string' 
            ? JSON.parse(data) 
            : JSON.parse(data.toString(
                'utf8'
            ));
    }

    constructor(client: Stan) {
        this.client = client;
    }
} 