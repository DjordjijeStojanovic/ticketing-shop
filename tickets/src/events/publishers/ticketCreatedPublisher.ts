import { Publisher, Subjects, TicketCreatedEvent } from "@djordjestojanovic/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}