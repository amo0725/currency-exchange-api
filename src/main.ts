import 'dotenv/config';
import 'dotenv-safe/config';
import * as pack from '../package.json';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const { SERVICE_HOST, SERVICE_PORT, NODE_ENV, SERVICE_NAME, SERVICE_API_URL } =
  process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      NODE_ENV === 'production' || NODE_ENV === 'development'
        ? ['error', 'warn', 'debug']
        : null,
  });
  app.enableCors();
  app.enableVersioning({ type: VersioningType.URI });
  const config = new DocumentBuilder()
    .setTitle(pack.name)
    .setDescription(`The ${SERVICE_NAME} API ${pack.description}`)
    .setVersion(pack.version)
    .addServer(SERVICE_API_URL)
    .addServer(`http://${SERVICE_HOST}:${SERVICE_PORT}/api`)
    .addServer(`http://localhost:${SERVICE_PORT}/api`)
    .build();
  if (NODE_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  app.setGlobalPrefix('api');

  await app.listen(SERVICE_PORT);
  Logger.log(`app is running at ${SERVICE_PORT}`);
}
bootstrap();
