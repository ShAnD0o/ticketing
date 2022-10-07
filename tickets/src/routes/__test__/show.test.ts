import request from "supertest";
import { app } from "../../app";

it("return 404 if ticket Not found ...", async () => {
  await request(app).get("/api/tickets/fbvdfbdf").send();
  expect(404);
});
it("return Ok if Ticket founded ...", async () => {
  const title = "post";
  const price = 20;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title,
      price,
    })
    .expect(201);
  const newResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  expect(newResponse.body.title).toEqual(title);
  expect(newResponse.body.price).toEqual(price);
});
