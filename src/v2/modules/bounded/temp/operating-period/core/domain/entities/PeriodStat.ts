import { CreatePeriodStatDomainDto } from '../../shared/CreatePeriodStat.dto';
import { PeriodStatsCreated } from '../events/statsCreated';
import { Entity } from '../shared/Entity';
import { PeriodDescript } from '../vo/PeriodDescript';
import { Id } from '../vo/PeriodId.vo';
import { PeriodState } from '../vo/PeriodState';

export interface PeriodStatDto {
  id: string;
  state: string;
  descript: string;
}

export class PeriodStat extends Entity<PeriodStat> {
  state: PeriodState;
  descript: PeriodDescript;

  static create(data: CreatePeriodStatDomainDto): PeriodStat {
    const statsCreated = new this.builder()
      .setId(Id.generate())
      .setState(data.state)
      .setDescript(data.descript)
      .build();

    statsCreated.record(new PeriodStatsCreated(statsCreated));

    return statsCreated;
  }

  equalsTo(entity: PeriodStat): boolean {
    return this.state === entity.state;
  }

  private static builder = class {
    private periodStat = new PeriodStat();

    constructor() {}

    setId(id: Id | string): this {
      this.periodStat.id = typeof id === 'string' ? new Id(id) : id;
      return this;
    }

    setState(state: PeriodState | string): this {
      this.periodStat.state = typeof state === 'string' ? new PeriodState(state) : state;
      return this;
    }

    setDescript(descript: PeriodDescript | string): this {
      this.periodStat.descript =
        typeof descript === 'string' ? new PeriodDescript(descript) : descript;
      return this;
    }

    build(): PeriodStat {
      return this.periodStat;
    }
  };

  toJSON(): PeriodStatDto {
    return {
      id: this.id.toString(),
      state: this.state.getValue(),
      descript: this.descript.getValue(),
    };
  }
}
