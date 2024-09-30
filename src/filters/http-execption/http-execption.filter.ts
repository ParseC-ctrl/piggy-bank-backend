import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Logger } from 'src/utils/log4js';
@Catch(HttpException)
export class HttpExecptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;
    const req = ctx.getRequest<Request>();
    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
    Status code: ${status}
    Response: ${exception.toString()} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    if (status >= 500) {
      Logger.error(logFormat);
    }
    Logger.info(logFormat);
    const exceptionResp: any = exception.getResponse();
    let validatorMessage = exceptionResp;

    if (typeof validatorMessage === 'object') {
      if (Array.isArray(validatorMessage.message)) {
        validatorMessage = exceptionResp.message[0];
      } else {
        validatorMessage = exceptionResp.message;
      }
    }

    resp.status(status).json({
      code: status,
      message: validatorMessage || message,
    });
  }
}
