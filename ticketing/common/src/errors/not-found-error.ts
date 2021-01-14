import { ErrorResponse } from "../types";
import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  reason = "Route could not be found";
  statusCode = 404;
  constructor() {
    super("Route could not be found");
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): ErrorResponse {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
