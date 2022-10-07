import request from "supertest"; // supertest => make a virtual request
import { app } from "../../app";
it("returns a 201 on successful signup ", async () => {
  const cookie = await global.signup();
});
//test of validateRequest
it("returns a 400 on invalid email ", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@testcom",
      password: "123456789",
    })
    .expect(400);
});
//test of validateRequest
it("returns a 400 on invalid password ", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1",
    })
    .expect(400);
});
//test of validateRequest
it("returns a 400 on invalid email & password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "t",
      password: "1",
    })
    .expect(400);
});
//test of validateRequest
it("returns a 400 on empty data ", async () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});
//test of BadRequestError
it("returns a 400 on Email already use ...", async () => {
  const cookie = await global.signup();
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456789",
    })
    .expect(400);
});
//test cookie
it("sets a coockie after successful signup .. ", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456789",
    })
    .expect(201);
  /*we make jwt is secure(https)(at app.ts) & test is not secure(http)
    So, must make it secure at any thing like (production and development)environment exept test
  */
  expect(response.get("Set-Cookie")).toBeDefined();
});
