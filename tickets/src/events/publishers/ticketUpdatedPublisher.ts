import { Publisher, Subjects, TicketUpdatedEvent } from '@djordjestojanovic/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}