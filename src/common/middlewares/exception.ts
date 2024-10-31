import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import * as moment from "moment";

@Catch()
export class Exception implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let payload: any = {};
    let status: number;
    let message: string;
    let messagePipe: any;
    try {
      const exceptionResponse: any = exception.getResponse();
      messagePipe = Array.isArray(exceptionResponse["message"])
        ? exceptionResponse["message"]
        : [exceptionResponse["message"]];
    } catch (error) {
      console.log(error.message);
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      payload = exception.cause;
    } else {
      status = exception.status || 500;
      message = exception.message;
    }

    const FailedResponse = {
      success: false,
      status: status,
      message: exception.message,
      payload,
      stack: exception.stack,
      path: request.url,
      timestamp: moment().format("MMMM Do, h:mm a"),
      pipes: messagePipe,
    };

    response.status(status).json(FailedResponse);
  }
}
