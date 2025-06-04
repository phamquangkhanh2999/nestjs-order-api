/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, query, params, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = request.ip || request.connection.remoteAddress;

    const startTime = Date.now();

    // Log incoming request
    this.logger.log(
      '======================== INCOMING REQUEST ========================',
    );
    this.logger.log(`📥 ${method} ${url}`);
    this.logger.log(`🌐 IP: ${ip}`);
    this.logger.log(`🖥️  User-Agent: ${userAgent}`);
    this.logger.log(
      `📋 Headers: ${JSON.stringify(this.filterHeaders(headers), null, 2)}`,
    );

    if (Object.keys(query).length > 0) {
      this.logger.log(`🔍 Query Params: ${JSON.stringify(query, null, 2)}`);
    }

    if (Object.keys(params).length > 0) {
      this.logger.log(`🎯 Route Params: ${JSON.stringify(params, null, 2)}`);
    }

    if (body && Object.keys(body).length > 0) {
      this.logger.log(`📦 Request Body:`);
      this.logger.log(JSON.stringify(body, null, 2));

      // Log chi tiết từng field trong body
      this.logger.log(`📊 Body Analysis:`);
      Object.keys(body).forEach((key) => {
        const value = body[key];
        this.logger.log(`  • "${key}": "${value}" (type: ${typeof value})`);
      });
    }

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        this.logger.log(
          '======================== OUTGOING RESPONSE =======================',
        );
        this.logger.log(`📤 ${method} ${url} - ${response.statusCode}`);
        this.logger.log(`⏱️  Duration: ${duration}ms`);
        this.logger.log(`📋 Response Data:`);

        if (data) {
          // Truncate large responses for readability
          const responseStr = JSON.stringify(data, null, 2);
          if (responseStr.length > 2000) {
            this.logger.log(`${responseStr.substring(0, 2000)}... (truncated)`);
          } else {
            this.logger.log(responseStr);
          }
        }
        this.logger.log(
          '===============================================================\n',
        );
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        this.logger.error(
          '======================== ERROR RESPONSE ==========================',
        );
        this.logger.error(`❌ ${method} ${url} - ERROR`);
        this.logger.error(`⏱️  Duration: ${duration}ms`);
        this.logger.error(`🚨 Error Message: ${error.message}`);
        this.logger.error(
          `📋 Error Details: ${JSON.stringify(error, null, 2)}`,
        );
        this.logger.error(`📚 Stack Trace: ${error.stack}`);
        this.logger.error(
          '===============================================================\n',
        );

        throw error;
      }),
    );
  }

  private filterHeaders(headers: any): any {
    // Filter out sensitive headers
    const filtered = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    sensitiveHeaders.forEach((header) => {
      if (filtered[header]) {
        filtered[header] = '***FILTERED***';
      }
    });

    return filtered;
  }
}
