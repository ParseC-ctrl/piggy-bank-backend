import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from 'src/utils/log4js';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private readonly whitelist: string[] = ['/api/user/captcha'];
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    const url = req.originalUrl;

    // 检查请求的 URL 是否在白名单中
    if (this.whitelist.includes(url)) {
      return next.handle();
    }
    return next.handle().pipe(
      map((data) => {
        const logFormat = `<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        Request original url: ${req.originalUrl}
        Method: ${req.method}
        IP: ${req.ip}
        User: ${JSON.stringify(req.user)}
        Response data:\n ${JSON.stringify(data)}
        <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
        Logger.info(logFormat);
        Logger.access(logFormat);
        return {
          code: 200,
          data: data.info || data || [],
          message: data.message || '操作成功',
        };
      }),
    );
  }
}
