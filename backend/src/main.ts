import { ClassSerializerInterceptor, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import * as express from 'express';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { setupSwagger } from './common/swagger';
import { CustomValidationPipe } from './common/pipes/custom-validation.pipe';
import { useContainer } from 'class-validator';

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

  const configService = app.get<ConfigService>(ConfigService);
  const reflector = app.get(Reflector);

  // Global Middlewares
  app.enableCors({
    credentials: true,
    origin: configService.get('ORIGIN'),
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,POST,DELETE',
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  // const rediesIoAdapter = new RedisIoAdapter(app);

  // app.useWebSocketAdapter(redis)

  if (configService.get('NODE_ENV') === 'development') {
    setupSwagger(app);
  }

  app.setGlobalPrefix(configService.get('API_PREFIX') || '/api');
  app.useGlobalPipes(new CustomValidationPipe());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(Number(configService.get('APP_PORT')));
  return app;
}

void bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
