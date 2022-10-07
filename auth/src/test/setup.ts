import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
// tell TS that (there are global function called signup)
// promise : guarantee that in future will get => callBack function is array of string
declare global {
  var signup: () => Promise<string[]>;
}
let mongo: any;
// the First thing run at this file(before any test)
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  const mongo = await MongoMemoryServer.create(); //create MongoMemoryServer
  const mongoUri = mongo.getUri(); // get URL to connect to MongoMemoryServer
  await mongoose.connect(mongoUri, {}); // request from mongoose to connect to MongoMemoryServer
});
// the Second thing run at this file(before any test)
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});
//// the Last thing run at this file
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
// global function (make test is easier(instead of duplicate at test))
global.signup = async () => {
  const email = "test@test.com";
  const password = "123456789";
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);
  const cookie = response.get("Set-Cookie");
  return cookie;
};
