import { ClassSerializerInterceptor, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import { validationOptions } from './utils/validators/validation-options';
import { ResponseTransformerInterceptor } from './interceptors/response-transformer.interceptor';
import { HttpExceptionFilter } from './exception-filter/http-exception.filter';
import { ToLowerCasePipe } from './interceptors/toLowerCase.pipe';
import * as session from 'express-session';
import { join } from 'path';
import { IgnoreDoubleForwardSlashInReqPath } from './interceptors/ignore-double-forward-slash.middleware';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);

  app.set('trust proxy', 1); // trust first proxy

  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(IgnoreDoubleForwardSlashInReqPath);

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  app.useGlobalPipes(new ToLowerCasePipe());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // use global interceptor for changing response format
  app.useGlobalInterceptors(new ResponseTransformerInterceptor());

  // use global http exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'files'));

  const options = new DocumentBuilder()
    .setTitle('Open Advisor API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .setExternalDoc('Postman Collection', '/docs-json')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const sessionOptions = {
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
  }

  app.useStaticAssets(join(__dirname, '..', 'files'));
  app.useStaticAssets(join(__dirname, '..', 'logo'), { prefix: '/logo/' });

  app.use(session(sessionOptions),);

  const port = configService.get('app.port');
  await app.listen(port, () => {
    Logger.log('------');
    console.log();
    console.log(`App running at     http://localhost:${port}`);
    console.log(`Docs at            http://localhost:${port}/docs`);
    console.log(`OpenApi Doc at     http://localhost:${port}/docs-json`);
    console.log(`Health at          http://localhost:${port}/api/health`);
    console.log();
    Logger.log('------');
  });
}

void bootstrap();
