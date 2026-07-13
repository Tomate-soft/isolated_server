import { OperatingPeriod, OperatingPeriodSchema } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { PeriodStatSchema, MongoPeriodStat } from './persistence/mongo/schemas/PeriodStat.schema';


export const SchemaProvider = [
    { name: MongoPeriodStat.name, schema: PeriodStatSchema },
    { name: OperatingPeriod.name, schema: OperatingPeriodSchema }
]