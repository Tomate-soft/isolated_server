import { Module } from '@nestjs/common';
import { RepositoriesModule } from './repositories/repositories.module';
import { DataRepository } from './data.repository';
import { QueriesModule } from './queries/queries.module';
import { DataQuery } from './data.query';
import { ReadDataRepository } from './data-read.repository';

@Module({
  imports: [RepositoriesModule, QueriesModule],
  providers: [DataRepository, DataQuery, ReadDataRepository],
  exports: [DataRepository, DataQuery, ReadDataRepository],
})
export class DataModule {}
