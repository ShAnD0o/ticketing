import { Publisher, OrderCreatedEvent, Subjects } from "@shandotickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
