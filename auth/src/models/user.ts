import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
}
// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; //to return id in request ( NOT (_id) ), all DBs have (id Not _id)
        delete ret._id;
        delete ret.password;
        delete ret.__v; // __V => thing depend on DB
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
// Ex : add newUser
// const user=User.build({
//   email: "",
//   password: "",
// });
// user.email
// user.password

/* Note
TS not directly access to schema of DB where,
if we add NewUser(email, password)with another dataType (No Error Occurs)
(TS not check mongoDB Schema)
Ex:
new User({
    email:123456789,
    password:134567
})
=>(No Error Occurs)
To Solve this Problem (write them at monoose schema file)
		1- write three inerface 
		2- write function instade of new User (build)
*/
