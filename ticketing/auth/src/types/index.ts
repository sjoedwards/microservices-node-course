export interface ErrorResponse {
  [index: number]: {
    message: string;
    field?: string;
  };
}
