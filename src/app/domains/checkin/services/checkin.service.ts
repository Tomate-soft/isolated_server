import { Injectable } from '@nestjs/common';
import { Integration } from '../integration/integration';
import { CheckInRegister } from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SocketEvents } from '../../broadcast/broadcast.gateway';

@Injectable()
export class CheckinService {
  constructor(
    private readonly integration: Integration,
    private eventEmitter: EventEmitter2,
  ) {}

  async getPeriodTableRegister() {
    const data = await this.integration.getPeriodTableRegister();
    return data;
  }

  async addTableCheckinRegisters(checkinRegisters: CheckInRegister[]) {
    const data = await this.integration.addTableCheckinRegisters(checkinRegisters);
    return data;
  }

  async tableApertureCheckin(tableId: string, diners: number) {
    const response = await this.integration.tableApertureCheckin(tableId, diners);
    if (response) {
      this.eventEmitter.emit(SocketEvents.TABLE_OPENED, response);
    }
    return response;
  }
  async getWaitList() {
    const data = await this.integration.getWaitList();
    return data.registers;
  }

  async createWaitListRegister(register: CheckInRegister) {
    const data = await this.integration.createWaitListRegister(register);
    if (data) {
      this.eventEmitter.emit(SocketEvents.CHECKIN_ADDED, data);
    }
    return data;
  }

  async deleteWaitListRegister(idempotencyKey: string) {
    const data = await this.integration.deleteWaitListRegister(idempotencyKey);
    if (data) {
      this.eventEmitter.emit(SocketEvents.DELETE_WAITLIST_ENTRY, data);
    }
    return data;
  }

  async updateWaitListRegister(idempotencyKey: string, register: Partial<CheckInRegister>) {
    const data = await this.integration.updateWaitListRegister(idempotencyKey, register);
    if (data) {
      this.eventEmitter.emit(SocketEvents.EDIT_WAITLIST_ENTRY, data);
    }
    return data;
  }

  async approveWaitlistEntry(idempotencyKey: string, tableId: string, diners: number) {
    const data = await this.integration.approveWaitlistEntry(idempotencyKey, tableId, diners);

    if (data) {
      this.eventEmitter.emit(SocketEvents.WAITLIST_ENTRY_APPROVED, data);
    }
    return data;
  }
}
