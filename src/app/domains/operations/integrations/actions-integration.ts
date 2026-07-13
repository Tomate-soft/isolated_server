import { Injectable } from '@nestjs/common';
import { DataQuery } from 'src/app/data/data.query';

@Injectable()
export class ActionsIntegration {
  constructor(private readonly dataQuery: DataQuery) {}

  async transferTableForUser(id: string, body: any) {
    const response = await this.dataQuery.transferTableForUser.transferTableForUser(id, body);
    return response;
  }
}
