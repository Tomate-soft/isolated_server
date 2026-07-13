import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { exportsRepositoriesModule, providersRepositoriesModule } from '.';
import { repositoriesModels } from './models';

@Module({
  imports: [MongooseModule.forFeature(repositoriesModels)],
  providers: providersRepositoriesModule,
  exports: exportsRepositoriesModule,
})
export class RepositoriesModule {}
