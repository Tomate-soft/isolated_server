import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePeriodStatsCommand } from '../createPeriodStatsCommand';
import { PeriodStatCommandService } from '../../../services/PeriodStatCommandService';
import { PERIOD_STATS_COMMAND_SERVICE } from '../../../../../shared/constants';
import { Inject } from '@nestjs/common';

@CommandHandler(CreatePeriodStatsCommand)
export class CreatePeriodStatsHandler implements ICommandHandler<CreatePeriodStatsCommand> {
  constructor(@Inject(PERIOD_STATS_COMMAND_SERVICE) private commandService: PeriodStatCommandService) {}

  async execute(command: CreatePeriodStatsCommand): Promise<void> {
    const { periodId } = command;
    await this.commandService.create(periodId);
  }
}
