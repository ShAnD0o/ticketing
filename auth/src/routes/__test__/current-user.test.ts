import request from "supertest"; // supertest => make a virtual request
import { app } from "../../app";
it("responds with detail about current user ... ", async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  //   console.log(response.body);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});
it("respond with null if not authinticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
