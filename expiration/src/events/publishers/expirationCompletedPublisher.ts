import { ExpirationCompletedEvent, Publisher, Subjects } from "@djordjestojanovic/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}