import { EmailService } from 'src/v2/modules/shared/notifications/email/infrastructure/adapters/EmailForPeriodStat.adapter';
import { PeriodStat } from '../../domain/entities/PeriodStat';
import { DomainEventSubscriber } from '../../domain/shared/DomainEventSubscriber';
import { DomainEvent } from '../../shared/DomainEvent';
import { Email } from 'src/v2/modules/shared/notifications/email/application/Email.vo';
import { PeriodStatsCreated } from '../../domain/events/statsCreated';

export class NotifyCreatedStat implements DomainEventSubscriber<PeriodStat> {
  constructor(private readonly emailService: EmailService) {}

  async onEvent(event: DomainEvent<PeriodStat>): Promise<void> {
    const periodStat = event.getData();

    await this.emailService.send({
      to: new Email('example@example.com'),
      message: `Solicitud de estadisticas de periodo: ${periodStat.descript.getValue()}`,
      sent: new Date(),
    });
  }

  suscribeTo(): string {
    return PeriodStatsCreated.EVENT_NAME;
  }
}
