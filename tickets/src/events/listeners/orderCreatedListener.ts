import { Listener, OrderCreatedEvent, Subjects } from "@djordjestojanovic/common";
import { queueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], message: Message): Promise<void> {
        const { id, ticket } = data;
        const fetchTicket = await Ticket.findById(ticket.id);

        if(!fetchTicket) throw new Error(`Ticket with an ID ${ticket.id} not found`);

        fetchTicket.set({ 
            orderId: id 
        });

        await fetchTicket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: fetchTicket.id,
            version: fetchTicket.version,
            title: fetchTicket.title,
            price: fetchTicket.price,
            userId: fetchTicket.userId,
            orderId: fetchTicket.orderId
        })

        message.ack();
    }
}