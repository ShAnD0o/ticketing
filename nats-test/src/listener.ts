import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});
stan.on("connect", () => {
  console.log("Listener connected to NATS ...");
  stan.on("close", () => {
    // close event immediately
    console.log("NATS connection closed ...");
    process.exit();
  });
  new TicketCreatedListener(stan).listen();
});
// this two signals => Close event immediately in case (restart or CRL+C) in listenner(Not wait 30 sec)
process.on("SIGINT", () => {
  stan.close();
});
process.on("SIGTERM", () => {
  stan.close();
});
