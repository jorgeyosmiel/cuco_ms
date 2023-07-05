import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import {
  ForbiddenException,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import FastifyMultipart from '@fastify/multipart';
import fastifyCsrf from '@fastify/csrf-protection';
import compression from '@fastify/compress';
import secureSession from '@fastify/secure-session';
import { appConfig } from '@config/app.config';
import { DOMAIN_WHITELIST, ValidationConfig } from './configs';
import { join } from 'path';
import { isEnv } from './utils';
import { EnvEnum } from '@models/enums';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // -------------- Middleware --------------
  app.register(FastifyMultipart);
  // -------------------------------------------

  // -------------- Global filter/pipes --------------
  app.useGlobalPipes(new ValidationPipe(ValidationConfig));
  app.setGlobalPrefix(appConfig().apiPrefix);
  // -------------------------------------------

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });
  await app.register(fastifyCsrf);
  await app.register(compression);
  await app.register(secureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: `${appConfig().bcryptSalt}`,
  });

  // -------------- Setup Cors --------------
  if (isEnv(EnvEnum.Dev)) {
    app.enableCors({
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    // -----------Setup Swagger-------------
    await ConfigDocument(app);
    // -------------------------------------------
  } else {
    app.enableCors({
      origin: (origin, callback) => {
        if (
          DOMAIN_WHITELIST.indexOf('*') !== -1 ||
          DOMAIN_WHITELIST.indexOf(origin) !== -1
        ) {
          callback(null, true);
        } else {
          callback(
            new ForbiddenException(
              `The CORS policy for this site does not allow access from the specified Origin.`,
            ),
            false,
          );
        }
      },
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    await app.register(helmet);
  }
  // -------------------------------------------

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(appConfig().port);
}

async function ConfigDocument(app: INestApplication): Promise<void> {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addTag('Document For API')
    .addBearerAuth({
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  Logger.log(`==========================================================`);
  Logger.log(`Swagger Init: /docs`, ConfigDocument.name);
  Logger.log(`==========================================================`);
}

bootstrap();
