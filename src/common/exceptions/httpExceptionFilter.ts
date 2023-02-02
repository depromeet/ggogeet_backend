import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';
import { TelegramMonitoringService } from 'src/monitoring/monitoring.telegram';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const errorTime = new Date().toLocaleString();
    const monitoring = new TelegramMonitoringService();

    if (!(exception instanceof HttpException) || res.statusCode >= 500) {
      const errorMsg = `[${req.method}] ${req.url} ${res.statusCode} - ${exception} - ${errorTime}`;
      monitoring.sendAlert(errorMsg);
      this.logger.error(errorMsg);

      return res.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      });
    }

    const response = (exception as HttpException).getResponse();
    const status = (exception as HttpException).getStatus();

    const httpErrorMsg = `[${req.method}] ${req.url} ${status} - ${exception} - ${errorTime}`;
    this.logger.error(httpErrorMsg);

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
