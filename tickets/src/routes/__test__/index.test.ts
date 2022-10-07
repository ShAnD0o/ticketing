import request from "supertest";
import { app } from "../../app";
const newTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "anyThing", price: 20 });
};
it("can fetch a list of tickets ...", async () => {
  await newTicket();
  await newTicket();
  await newTicket();
  const response = await request(app).get("/api/tickets").send().expect(200);
  expect(response.body.length).toEqual(3);
});
