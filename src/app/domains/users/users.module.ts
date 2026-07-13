import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersIntegrations } from './integrations/users-integrations';
import { DataModule } from 'src/app/data/data.module';
import { WriteUsersService } from './services/write-users.service';
import { Integrations } from './integrations/integrations';

@Module({
  imports: [DataModule],
  controllers: [UsersController],
  providers: [UsersService, UsersIntegrations, WriteUsersService, Integrations],
})
export class UsersModule {}
