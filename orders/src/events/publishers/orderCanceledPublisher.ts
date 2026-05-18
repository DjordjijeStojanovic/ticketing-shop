import { Publisher, OrderCanceledEvent, Subjects } from "@djordjestojanovic/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
    subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
}