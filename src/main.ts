import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
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
import { ValidationConfig } from './configs';
import { join } from 'path';
import { isEnv } from './utils';
import { EnvEnum } from '@models/enums';
import { useContainer } from 'class-validator';
import { ValidatorsModule } from '@common/validators';
import { MessageService } from '@core/i18n/message.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // ------------- Config ---------------
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('port');
  const LISTEN_ON: string = configService.get<string>('LISTEN_ON') || '0.0.0.0';
  const DOMAIN_WHITELIST: string[] = (
    configService.get<string>('DOMAIN_WHITELIST') || '*'
  ).split(',');

  // -------------- Middleware --------------
  app.register(FastifyMultipart);
  // -------------------------------------------

  // -------------- Global filter/pipes --------------
  app.useGlobalPipes(new ValidationPipe(ValidationConfig));
  app.setGlobalPrefix(configService.get<string>('apiPrefix'));
  // -------------------------------------------

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });
  await app.register(fastifyCsrf);
  await app.register(compression);
  await app.register(secureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
    cookie: {
      path: '/',
      httpOnly: isEnv(EnvEnum.Production), // Use httpOnly for all production purposes
      // options for setCookie, see https://github.com/fastify/fastify-cookie
    },
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

  // -----------------Validator-----------------
  useContainer(app.select(ValidatorsModule), { fallbackOnErrors: true });
  // -------------------------------------------

  // -----------MessageService init-------------
  MessageService.init();
  // -------------------------------------------

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(port, LISTEN_ON, async () => {
    Logger.log(`==========================================================`);
    Logger.log(`Server is running on port : ${port}`, 'Server');
    Logger.log(
      `Application is running on : ${await app.getUrl()}`,
      'Application',
    );
    Logger.log(`==========================================================`);
  });
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
