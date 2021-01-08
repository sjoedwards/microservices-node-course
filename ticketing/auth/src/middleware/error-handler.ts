import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  // Can do this because its an abstract class and not an interface - it gets transpiled to JS
  if (err instanceof CustomError)
    res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
};
