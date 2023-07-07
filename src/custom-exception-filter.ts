import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(CustomExceptionFilter.name);
  }
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const initialMsg = 'Something went wrong';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = initialMsg;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = res?.['message'] ?? exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (message !== initialMsg && status === HttpStatus.INTERNAL_SERVER_ERROR)
      status = HttpStatus.BAD_REQUEST;
    this.logger.error({ status, message });
    response.status(status).json({ message });
  }
}
