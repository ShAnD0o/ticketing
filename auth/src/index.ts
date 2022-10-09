import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
  console.log("Starting up ......");

  //TS know that (process.env.JWT_KEY) is undefined So, to guarntee that (process.env.JWT_KEY) is string to TS (source code at signup.ts)
  if (!process.env.JWT_KEY) {
    throw new Error("JWT must be define ...");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined ...");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000 ...!");
  });
};

start();
// mongoose
//   .connect("mongodb://auth-mongo-srv:27017/auth", {
//     retryWrites: true,
//     w: "majority",
//   })
//   .then(() => {
//     console.log("MongoDB connected successfully.");
//     app.listen(3000, () => {
//       console.log("Listening on 3000");
//     });
//   })
//   .catch((error) => console.error(error));
