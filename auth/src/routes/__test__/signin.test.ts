import request from "supertest";
import { app } from "../../app";
it("returns a 200 on successful loggin & responds with cookies ", async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "123456789",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
it("returns a 400 on invalid email  ", async () => {
  const cookie = await global.signup();
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test1@test.com",
      password: "123456789",
    })
    .expect(400);
});
it("returns a 400 incorrect password  ", async () => {
  const cookie = await global.signup();
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "",
    })
    .expect(400);
});
