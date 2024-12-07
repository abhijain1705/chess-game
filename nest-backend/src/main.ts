// nest imports
import { NestFactory } from '@nestjs/core';

// modules
import { AppModule } from './app.module';

// express
import * as bodyParser from 'body-parser';

// interceptor
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

// filters
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // apply the interceptor globally
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Apply exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  // body parser
  app.use(
    bodyParser.json({
      limit: '50mb',
      //  type: 'application/json'
    }),
  );
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      // type: 'application/x-www-form-urlencoded',
      extended: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
