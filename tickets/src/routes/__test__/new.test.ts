import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({});

  expect(response.status).not.toEqual(401); //401
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "",
      price: 10,
    })
    .expect(400); //400

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      price: 10,
    })
    .expect(400); //400
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "asldkjf",
      price: -10,
    })
    .expect(400); //400

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "laskdfj",
    })
    .expect(400); //400
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "asldkfj", price: 20 })
    .expect(201); //201

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
});

it("publishes an event", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "asldkfj", price: 20 })
    .expect(201); //201
  // console.log(natsWrapper);
  // expect that mocks natsWrapper called & no problem occure.
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
