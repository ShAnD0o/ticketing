import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@shandotickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
