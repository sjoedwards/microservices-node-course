import { CustomError } from "./custom-error";
import { ErrorResponse } from "./../types/index";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not Authorized");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): ErrorResponse {
    return [{ message: "Not Authorized" }];
  }
}
