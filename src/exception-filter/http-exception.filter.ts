import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    console.log(exception);
    const errors = exception.hasOwnProperty('response') ? exception.getResponse() : exception
    let message = exception.message || 'Internal Server Error'

    response
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .status(status)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .json({
        success: false,
        statusCode: status,
        message,
        errors: errors["errors"]
      });
  }
}