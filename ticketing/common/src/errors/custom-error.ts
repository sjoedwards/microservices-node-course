import { ErrorResponse } from "./../types/index";

// Abstract classes are like interfaces, but they actually exist and be used in instanceOf checks
// When you extend an abstract class, it checks to see whether it contains the abstract properties and methods
abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): ErrorResponse;
}

export { CustomError };

// Usage
// class NotFoundError extends CustomError {
//   statusCode = 404;

//   serializeErrors() {
//     return [
//       {
//         message: "message",
//         field: "field",
//       },
//     ];
//   }
// }
