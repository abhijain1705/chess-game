// nestjs import
import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

// express
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.status || 500;

    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal Server Error',
      error: exception.name || 'Unknown Error',
    });
  }
}
