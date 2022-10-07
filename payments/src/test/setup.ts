import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
// tell TS that (there are global function called signup)
// promise : guarantee that in future will get => callBack function is array of string
declare global {
  var signup: (id?: string) => string[]; //deleted the promise , because definded it before at auth(array of string(array of cookies))
}
// the file that we want to jest it.
jest.mock("../nats-wrapper");
let mongo: any;

process.env.STRIPE_KEY =
  "sk_test_51Lq0PyGhzmikHq67gjszEXAL9iJTaIiPDopomAR0SPvGEgY59KaiWxN2ufSPD5oO17De3gQToHBiH0OJ5zPrO1Ei00Ezh627OX";
// the First thing run at this file(before any test)
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  const mongo = await MongoMemoryServer.create(); //create MongoMemoryServer
  const mongoUri = await mongo.getUri(); // get URL to connect to MongoMemoryServer
  await mongoose.connect(mongoUri); // request from mongoose to connect to MongoMemoryServer
});
// the Second thing run at this file(before any test)
beforeEach(async () => {
  // to reset that data in mocks between every single test
  jest.clearAllMocks();
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
global.signup = (id?: string) => {
  //1. build a JWT payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(), //if not recieve Id then generate one.
    email: "test@test.com",
  };
  //2. create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //3. build session Object {jwt:MY_JWT}
  const session = { jwt: token };
  //4. turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  //5. take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //6. return a string that the cookie with the encoded data
  return [`express:sess=${base64}`];
};
