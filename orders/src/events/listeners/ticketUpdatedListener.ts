import { Listener, Subjects, TicketUpdatedEvent } from "@djordjestojanovic/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
        const { id, title, price } = data;
        const ticket = await Ticket.findByIdAndPreviousVersion(data);

        if(!ticket) throw new Error(`Ticket with an ID ${id} has not been found`);

        ticket.set({title, price});

        await ticket.save();
        msg.ack();
    }
}