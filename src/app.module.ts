import { ConfigModule } from '@nestjs/config';

// https://stackoverflow.com/a/71045457/6132438
// Moved here to fix a bug (env not being loaded early enough)
import * as Joi from 'joi';

const envModule = ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    // APP
    PORT: Joi.number().port().default(3000),

    // DB
    DB_HOST: Joi.string(),
    DB_NAME: Joi.string(),
    DB_PORT: Joi.number().port().default(3306),
    DB_USERNAME: Joi.string(),
    // DB_PASSWORD: ,

    // AUTH
    JWT_SECRET: Joi.string(),
    REFRESH_TOKEN_SECRET: Joi.string(),

    // S3
    AWS_S3_BUCKET_NAME: Joi.string(),
    AWS_S3_ACCESS_KEY_ID: Joi.string(),
    AWS_S3_SECRET_ACCESS_KEY: Joi.string(),
    AWS_S3_REGION: Joi.string(),
  }),
  envFilePath: '.env',
  isGlobal: true
})

import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Role } from './role/role.entity';
import { Permission } from './permission/permission.entity';
import { CustomNamingStrategy } from './common/helpers/CustomNamingStrategy';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AuthModule } from './auth/auth.module';
import { RefreshToken } from './refresh_token/refresh_token.entity';
import { RefreshTokenModule } from './refresh_token/refresh_token.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/auth.constants';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './common/guard/permission.guard';
import { UserSuspensionModule } from './user_suspensions/user_suspensions.module';
import { UserSuspension } from './user_suspensions/user_suspensions.entity';
import { PasswordResetToken } from './password_reset_tokens/password_reset_tokens.entity';
import { PasswordResetTokenModule } from './password_reset_tokens/password_reset_tokens.module';
import { ThrottlerModule } from '@nestjs/throttler';
import AuthenticationMiddleware from './common/middleware/AuthenticationMiddleware';

@Module({
  imports: [
    envModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) ?? 3306,
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME,
      entities: [
        // Don't add intermediate tables, or it will throw an error about only one key
        User,
        Role,
        Permission,
        RefreshToken,
        UserSuspension,
        PasswordResetToken
      ],
      dropSchema: process.env.NODE_ENV === 'test',
      synchronize: process.env.DB_HOST === 'localhost',
      namingStrategy: new CustomNamingStrategy(),
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
      global: true
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    RefreshTokenModule,
    UserSuspensionModule,
    PasswordResetTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    { provide: APP_GUARD, useClass: PermissionGuard },],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: '/', method: RequestMethod.ALL },
        { path: 'auth/sign-up', method: RequestMethod.POST },
        { path: 'auth/sign-in', method: RequestMethod.POST },
        { path: 'properties(.*)', method: RequestMethod.POST },
        { path: 'mailer/(.*)', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
