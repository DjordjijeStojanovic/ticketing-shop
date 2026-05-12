import { Publisher } from "./basePublisher";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticketCreatedEvent";
import { Subjects } from "./subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    
}
