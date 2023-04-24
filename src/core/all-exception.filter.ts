import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { CustomHttpExceptionResponse, HttpExceptionResponse } from "./interfaces/http-exception-response.interface";
import { Request } from "express";
import * as fs from "fs";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: HttpStatus;
    let errorMessage: string;

    if (this.isHttpException(exception)) {
      const errorResponse = exception.getResponse() as HttpExceptionResponse;
      status = exception.getStatus();
      errorMessage = errorResponse.message;
      console.log(exception.getResponse(), 'exception.getResponse()');
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Internal server error';
    }

    const errorResponse = this.getErrorResponse(status, errorMessage, request);
    const errorLog = this.getErrorLog(errorResponse);
    this.writeErrorLog(errorLog);

    response.status(status).json(errorResponse);
  }

  private isHttpException(exception: unknown): exception is HttpException {
    return exception instanceof HttpException;
  }

  private getErrorResponse(
    status: HttpStatus,
    errorMessage: string,
    request: Request,
  ): CustomHttpExceptionResponse {
    return {
      statusCode: status,
      error: HttpStatus[status],
      message: errorMessage,
      path: request.url,
      timestamp: new Date(),
      method: request.method,
    };
  }

  private getErrorLog(errorResponse: CustomHttpExceptionResponse) {
    const { statusCode, error, message, path, timestamp, method } =
      errorResponse;
    return `Response Code: ${statusCode} | Error: ${error} | Message: ${message} \n | Path: ${path} | Timestamp: ${timestamp} | Method: ${method}\n\n`;
  }

  private writeErrorLog(errorLog: string) {
    fs.appendFile('error.log', errorLog, 'utf-8', (err) => {
      if (err) throw err;
    });
  }
}
