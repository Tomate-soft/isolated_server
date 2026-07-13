import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LicenseHistoryEntry } from '../../../core/domain/ports/types/LicenseKey';

export const LICENSE_AUDIT_EVENT = 'tenant-management.license.audit';

@Injectable()
export class LicenseAuditPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publish(entry: LicenseHistoryEntry): void {
    this.eventEmitter.emit(LICENSE_AUDIT_EVENT, entry);
  }
}
