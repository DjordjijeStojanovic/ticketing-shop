import { Listener, Subjects, TicketCreatedEvent } from "@djordjestojanovic/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id,
            title,
            price
        });

        await ticket.save();

        msg.ack();
    }
}