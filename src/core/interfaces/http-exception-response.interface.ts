export interface HttpExceptionResponse {
  statusCode: number;
  error: string;
  message: string;
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  path: string;
  timestamp: Date;
  method: string;
}
