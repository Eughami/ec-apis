import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from './core-configs/app-logger';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorrelationIdMiddleware } from './middlewares/correlation-id.middleware';
import { middleware } from 'express-ctx';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });
  // const config = app.get(ConfigService);

  const logger = app.get(Logger);

  app.enableCors();

  // app.use(
  // helmet({
  // crossOriginResourcePolicy: false
  // })
  // );
  app.use(middleware);
  app.use(CorrelationIdMiddleware());
  app.useLogger(logger);
  // app.use(json({ limit: '50mb' }));
  // app.use(urlencoded({ extended: true, limit: '50mb' }));

  // const appPrefix = `${config.get('host.globalPrefix')}/admin`;
  // const port = config.get('host.adminPort') || process.env.PORT;
  // const host = config.get('host.url') || 'http://localhost';
  // const environment = config.get('host.nodeEnv') || 'development';

  const appPrefix = 'api/v1';
  app.setGlobalPrefix(appPrefix);

  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dahabo APIs')
    .setDescription('REST APIs for Dahabo Platform')
    .setVersion('build 20230217.1')
    // .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    //deepScanRoutes: false,
    //include: [AppModule, DOwnload]
  });

  SwaggerModule.setup(`${appPrefix}/swagger`, app, document);

  await app.listen(3500);
}
bootstrap();
