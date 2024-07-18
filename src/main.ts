import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import ms from 'ms';
import passport from "passport"
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  //config view engine
  app.useStaticAssets(join(__dirname, '..', 'src/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('ejs');

  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe);
  app.useGlobalGuards(new JwtAuthGuard(reflector))
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  //config cookies
  app.use(cookieParser());

  //config session
  app.use(session({
    secret: configService.get<string>('EXPRESS_SESSION_SECRET'),
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: ms(configService.get<string>('EXPRESS_SESSION_COOKIE')) },
    store: MongoStore.create({
      mongoUrl: configService.get<string>('MONGODB_URI'),
    })
  }));

  //config passport
  app.use(passport.initialize())
  app.use(passport.session())

  //config CORS
  app.enableCors(
    {
      "origin": true, // cho phép tất cả nơi nào có thể kết nối đến
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      credentials: true,
    }
  );

  // CONFIG VERSIONING
  // ĐÁNH DẤU VERSIONM CỦA API
  // đặt tiền tố global
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI, // khi bật cái này mặc định thêm tiền tố v
    defaultVersion: ['1', '2']
  })

  await app.listen(port);
}
bootstrap();
