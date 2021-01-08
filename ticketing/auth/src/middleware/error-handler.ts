import { RequestValidationError } from "./../errors/request-validation-error";
import { DatabaseConnectionError } from "./../errors/database-connection-error";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Creating common response structure
  if (err instanceof RequestValidationError) {
  }

  if (err instanceof DatabaseConnectionError) {
    console.log("DB connection error");
  }
  res.status(400).send({
    message: err.message,
  });
};
