import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success?: boolean;
  statusCode?: number;
  data: T;
  pagination?: any;
}

@Injectable()
export class ResponseTransformerInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => {
      if (data) {
        const message = data?.message || ''
        delete data.message
        const { count, total, page, pageCount } = data
        data = data.data ? data.data : data
        if (data)
          return ({
            success: true,
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: message,
            data: data,
            pagination: { count, total, page, pageCount }
          })
      }
      else {
        return ({ data })
      }
    }));
  }
}