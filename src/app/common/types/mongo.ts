import { CashierSession } from 'src/schemas/cashierSession/cashierSession';
import { MoneyMovement } from 'src/schemas/moneyMovements/moneyMovement.schema';

export interface MongoTimestamps {
  createdAt: string;
  updatedAt: string;
  _id: string;
  __v: number;
  __t: string;
}

export type ExtendedMoneyMovement = MoneyMovement & MongoTimestamps;
export type ExtendedCashierSession = CashierSession & MongoTimestamps;
