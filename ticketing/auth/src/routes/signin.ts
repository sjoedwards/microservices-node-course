import jwt from "jsonwebtoken";
import { Password } from "./../services/password";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import BadRequestError from "../errors/bad-request-error";
import { validateRequest } from "../middleware/validate-request";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    // Want to give minimal detail as possible as to why sign in didnt succeed

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials +1");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    // I STRONGLY DISAGREE WITH STORING EMAIL ON A JWT - ITS PII AND SHOULD BE ENCRYPTED AT REST
    // could get around this by encrypting the cookie contents or the JWT payload
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY
    );
    // store on the session object
    req.session = {
      jwt: userJwt,
    };

    res.send(existingUser);
  }
);

export { router as signinRouter };
