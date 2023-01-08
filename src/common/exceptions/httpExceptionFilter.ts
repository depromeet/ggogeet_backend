import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';

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

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
      this.logger.error(
        `[${req.method}] ${req.url} ${res.statusCode} - ${exception}}`,
      );
    }

    const response = (exception as HttpException).getResponse();
    const status = (exception as HttpException).getStatus();

    this.logger.error(`[${req.method}] ${req.url} ${status} - ${exception}}`);

    res.status((exception as HttpException).getStatus()).json(response);
  }
}
