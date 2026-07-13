import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PeriodStatsController } from './presentation/http-server/controllers/period-stats.controller';
import { MongoPeriodStateRepository } from './persistence/mongo/repositories/PeriodState.repository';
import { MongoOperatingPeriodRepository } from './persistence/mongo/repositories/MongoOperatingPeriod.repository';
import { SchemaProvider } from './schema.provider';
import { PeriodStatRepositoriesProvider } from './repositoriesProviders';
import { TAUNTER_SERVICE } from '../shared/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
      name: TAUNTER_SERVICE,
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:ast4tlqo@rabbitmq:5672/taunter-service'],
        queue: 'taunter_queue',
        queueOptions: { durable: true },
    }
  }
    ]),
    MongooseModule.forFeature(SchemaProvider),
    CqrsModule,
  ],
  controllers: [PeriodStatsController],
  providers: [
    MongoPeriodStateRepository,
    MongoOperatingPeriodRepository,
    ...PeriodStatRepositoriesProvider,
  ],
  exports: [
    MongoPeriodStateRepository,
    MongoOperatingPeriodRepository,
    ...PeriodStatRepositoriesProvider,
  ],
})

export class InfrastructureModule {}
