import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

//readonly :we cant change it in the future (like (final in java) & (const in JS))
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated; // name of channel that listen for.
  queueGroupName = "payments-service"; // its queue group to make one listener ,listen to publisher
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    //TicketCreatedEvent["data"] : data must be (id,title,price) any thing Error
    console.log("Event data", data);
    msg.ack();
  }
}
