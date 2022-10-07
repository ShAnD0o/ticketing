import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@shandotickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // find ticket that order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // if no ticket found
    if (!ticket) {
      throw new Error("Ticket not found  ...");
    }
    //mark the ticket that being reserved by setting its orderId
    ticket.set({ orderId: data.id });
    // save the ticket
    await ticket.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    //ack the message
    msg.ack();
  }
}
