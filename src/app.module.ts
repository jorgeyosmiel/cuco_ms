import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { AtGuard } from '@common/guards';
import { DatabaseModule } from '@core/database/database.module';
import { appConfig, authConfig, databaseConfig } from './configs';
import { HealthModule } from '@modules/health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ValidatorsModule } from '@common/validators';
import { I18nModule } from '@core/i18n/i18n.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      expandVariables: true,
      load: [appConfig, databaseConfig, authConfig],
    }),
    HealthModule,
    ValidatorsModule,
    I18nModule,
    UserModule,
    AuthModule,
    DatabaseModule,
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('NewRelicExampleApp', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  ],
  providers: [
    {
      // Allow injection reflector
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
