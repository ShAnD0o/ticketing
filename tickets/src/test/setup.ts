import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
// tell TS that (there are global function called signup)
// promise : guarantee that in future will get => callBack function is array of string
declare global {
  var signup: () => string[]; //deleted the promise , because definded it before at auth(array of string(array of cookies))
}
// the file that we want to jest it.
jest.mock("../nats-wrapper");
let mongo: any;
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
global.signup = () => {
  //1. build a JWT payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(), //generate new cookie after any call
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

//#############################
//#############################

// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// import request from "supertest";
// import { app } from "../app";
// import jwt from "jsonwebtoken";

// declare global {
//   var signup: () => string[];
// }

// let mongo: any;
// beforeAll(async () => {
//   process.env.JWT_KEY = "asdf";
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//   mongo = new MongoMemoryServer();
//   const mongoURI = await mongo.getUri();
//   await mongoose.connect(mongoURI);
// });

// beforeEach(async () => {
//   const collections = await mongoose.connection.db.collections();

//   for (let collection of collections) {
//     await collection.deleteMany({});
//   }
// });

// afterAll(async () => {
//   await mongo.stop();
//   await mongoose.connection.close();
// });

// global.signup = () => {
//   // Build a JWT payload.  { id, email }
//   const payload = {
//     id: "1lk24j124l",
//     email: "test@test.com",
//   };

//   // Create the JWT!
//   const token = jwt.sign(payload, process.env.JWT_KEY!);

//   // Build session Object. { jwt: MY_JWT }
//   const session = { jwt: token };

//   // Turn that session into JSON
//   const sessionJSON = JSON.stringify(session);

//   // Take JSON and encode it as base64
//   const base64 = Buffer.from(sessionJSON).toString("base64");

//   // return a string thats the cookie with the encoded data
//   return [`session=${base64}`];
// };

//###################
//###################
// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// import request from "supertest";
// import { app } from "../app";
// import jwt from "jsonwebtoken";
// // tell TS that (there are global function called signup)
// // promise : guarantee that in future will get => callBack function is array of string
// declare global {
//   var signup: () => string[];
// }
// let mongo: any;
// // the First thing run at this file(before any test)
// beforeAll(async () => {
//   process.env.JWT_KEY = "asdfasdf";
//   const mongo = await MongoMemoryServer.create(); //create MongoMemoryServer
//   const mongoUri = await mongo.getUri(); // get URL to connect to MongoMemoryServer
//   await mongoose.connect(mongoUri, {}); // request from mongoose to connect to MongoMemoryServer
// });
// // the Second thing run at this file(before any test)
// beforeEach(async () => {
//   const collections = await mongoose.connection.db.collections();

//   for (let collection of collections) {
//     await collection.deleteMany({});
//   }
// });
// //// the Last thing run at this file
// afterAll(async () => {
//   if (mongo) {
//     await mongo.stop();
//   }
//   await mongoose.connection.close();
// });
// // global function (make test is easier(instead of duplicate at test))
// global.signup = () => {
//   // Build a JWT payload.  { id, email }
//   const payload = {
//     id: "1lk24j124l",
//     email: "test@test.com",
//   };

//   // Create the JWT!
//   const token = jwt.sign(payload, process.env.JWT_KEY!);

//   // Build session Object. { jwt: MY_JWT }
//   const session = { jwt: token };

//   // Turn that session into JSON
//   const sessionJSON = JSON.stringify(session);

//   // Take JSON and encode it as base64
//   const base64 = Buffer.from(sessionJSON).toString("base64");

//   // return a string thats the cookie with the encoded data
//   return [`express:sess=${base64}`];
// };
