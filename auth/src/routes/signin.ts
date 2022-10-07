import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@shandotickets/common";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid ..."),
    body("password").trim().notEmpty().withMessage("must add password ..."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const exitingUser = await User.findOne({ email });
    if (!exitingUser) {
      throw new BadRequestError("invalid Credentials ...");
    }
    const passwordsMatch = Password.compare(exitingUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError("invalid  Credential ...");
    }
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: exitingUser.id,
        email: exitingUser.email,
      },
      // "asdf" // signing key (it is more impo, so must be hash) (updated in the second line)
      process.env.JWT_KEY! // exclamation mark(!), say to TS , dont warry , we know that (this line is %100 define), (we defined it in index.ts)
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };
    res.status(200).send(exitingUser);
  }
);

export { router as signinRouter };
