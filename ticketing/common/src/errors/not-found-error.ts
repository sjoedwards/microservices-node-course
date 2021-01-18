import { ErrorResponse } from "../types";
import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor(public message = "Route could not be found") {
    super(message);
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): ErrorResponse {
    return [
      {
        message: this.message,
      },
    ];
  }
}
