import { Publisher, OrderCreatedEvent, Subjects } from "@djordjestojanovic/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}