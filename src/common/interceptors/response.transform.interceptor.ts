import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseResponseDto } from '@core/base/base.dto';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { MessageService } from '@core/i18n/message.service';
import { DEFAULT_LOCALE } from '@config/config';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, BaseResponseDto<T>>
{
  constructor(private i18n: MessageService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponseDto<T>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const lang =
      request?.headers['accept-language']?.split(';')[0]?.split(',')[0] ||
      DEFAULT_LOCALE;
    return next.handle().pipe(
      map((response) => {
        if (response?.message) {
          return {
            ...response,
            message: this.i18n.lang(response?.message, lang),
          };
        }
        return response;
      }),
    );
  }
}
