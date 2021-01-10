import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import BadRequestError from "../errors/bad-request-error";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middleware/validate-request";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be within 4 and 20"),
  ],
  // Middleware to validate the request!
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();
    // Generate JWT

    // I STRONGLY DISAGREE WITH STORING EMAIL ON A JWT - ITS PII AND SHOULD BE ENCRYPTED AT REST
    // could get around this by encrypting the cookie contents or the JWT payload
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY
    );
    // store on the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
