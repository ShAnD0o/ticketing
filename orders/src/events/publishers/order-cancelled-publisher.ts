import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@shandotickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
