import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    // Bypass interceptor for static file routes
    if (path.startsWith("/static")) {
      return next.handle();
    }

    return next.handle().pipe(
      map(({ statusCode, ApiMessage, ...rest }) => {
        return new ResponseDTO({
          success: true,
          data: rest,
          statusCode,
          message: ApiMessage || "api default message",
        });
      })
    );
  }
}

class ResponseDTO {
  success: boolean;
  data?: any;
  message?: string;
  statusCode?: number;

  constructor({
    success,
    data,
    message,
    statusCode,
  }: {
    success: boolean;
    data?: any;
    message?: string;
    statusCode?: number;
  }) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
