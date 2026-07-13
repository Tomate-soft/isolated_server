import { CancelOnsiteQuery } from '../../providers/cancel-onsite-query';

export class CancelOnSiteOrder {
  constructor(private service: CancelOnsiteQuery) {}

  cancel(id: string, body: any): Promise<any> {
    return this.service.cancelOnSiteOrder(id, body);
  }
}
