import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();
// ticketing : is cluster Id
// abc : is the client Id
// url : to actual connect to
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
}); //client===stan(to connect nats streaming server)
stan.on("connect", async () => {
  //listen to all events
  console.log("publisher connected to NATS ...");
  const publisher = new TicketCreatedPublisher(stan); //at this case (data must be at the original type)
  try {
    await publisher.publish({
      id: "asd",
      title: "asd",
      price: 40,
    });
  } catch (err) {
    console.error(err);
  }

  // Old way (Not accurate)
  // const data = JSON.stringify({
  //   //data must be as JSON not Obj
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });
  // stan.publish("ticket:created", data, () => {
  //   //send supject & data to NATS Streaming
  //   console.log("Published ...");
  // });
});
