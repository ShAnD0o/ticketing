import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}
export abstract class Listener<T extends Event> {
  abstract subject: T["subject"]; //ticketName(from type subject=>(fromtype Subjects=>(TC or OC)))
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  protected ackWait = 5 * 1000; //can define it if i want that
  private client: Stan; //type of Stan because must pre connect to server & Stan make this(used at community)

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // setDeliverAllAvailable : reSend all events at all access in listener(to check previos events)
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject, //ticketName
      this.queueGroupName, // its queue group to make one listener ,listen to publisher
      this.subscriptionOptions() //all previos options
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData(); //msg.getData : return actual data
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8")); //if buffer
  }
}
