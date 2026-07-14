import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
// update ser

import { machineIdentifier } from './utils/chargeFiles/excel/machineIdentifier';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: [
      'http://localhost:5174',
      'https://app.tomatesoft.com',
      'http://localhost:5173',
      'http://localhost:3000',
      'https://tomatesoft.com',
      'https://checkin.tomatesoft.com',
      'https://dev.client.tomatesoft.com',
      'https://history.tomatesoft.com',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 8001, '0.0.0.0');
}
machineIdentifier();
bootstrap();
