import { Module } from '@nestjs/common';
import { RewritePeriodController } from './rewrite-period.controller';
import { RewritePeriodService } from './rewrite-period.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RewritedPeriod, RewritedPeriodSchema } from '@schema/RewritedPeriod/rewritedPeriod';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RewritedPeriod.name, schema: RewritedPeriodSchema }]),
  ],
  controllers: [RewritePeriodController],
  providers: [RewritePeriodService],
})
export class RewritePeriodModule {}
