import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { config } from 'dotenv';
import { v4 as uuidV4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { IncomingRequest } from '../types/incoming-request.type';
import { responseSuccess } from '../utils/helpers.util';

config();

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  private logger = new Logger(GlobalInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const configService = new ConfigService();
    const request = context.switchToHttp().getRequest<IncomingRequest>();
    const response = context
      .switchToHttp()
      .getResponse<Response & { requestId: string }>();
    const requestId = uuidV4();
    request.requestId = requestId;
    response.setHeader('request-id', requestId);
    const blacklistPaths = configService
      .get<string>('BLACKLIST_REQUEST_LOG_PATHS', '/health')
      .split(',');
    if (blacklistPaths.includes(request.path)) {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      map((data) => {
        return responseSuccess(data);
      }),
      catchError((err) => {
        this.logger.error(
          `Request ${requestId} failed after ${Date.now() - startTime} ms`,
        );

        return throwError(() => err);
      }),
      tap(() => {}),
    );
  }
}
