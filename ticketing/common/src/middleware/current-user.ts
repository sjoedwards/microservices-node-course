import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// How to add a value to the request object of an external library!

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    // If no jwt - just carry onto the next middleware
    return next();
  }

  // TODO Need to dependency inject this
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key is undefined!");
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY
      // Tell typescript the shape of the data returned is a UserPayload
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    next();
  }

  next();
};
