import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { HttpExecptionFilter } from './filters/http-execption/http-execption.filter';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { TransformInterceptor } from './interceptor/transform/transform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const serverPort = configService.get('app.port');
  const prefix = configService.get('app.prefix');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExecptionFilter());
  app.use(
    session({
      secret: 'cby',
      name: 'cby.session',
      rolling: true,
      cookie: { maxAge: 3600000 }, // 设置会话过期时间为1小时
    }),
  );
  await app.listen(serverPort);
}
bootstrap();
