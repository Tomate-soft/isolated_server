import { Injectable } from '@nestjs/common';
import { CancellationTypes } from '@schema/cancellations/order-cancel.schema';
import { CancellationProductTypes } from '@schema/cancellations/product-cancel.schema';
import { DataQuery } from 'src/app/data/data.query';
import { DataRepository } from 'src/app/data/data.repository';
import { CreateOrderCancelDto } from 'src/app/data/dto/cancellations/order-cancel/create-order-cancel.dto';

@Injectable()
export class CancellationsIntegrations {
  constructor(
    private readonly dataRepository: DataRepository,
    private readonly dataQuery: DataQuery,
  ) {}

  async createOrderCancel(body: CreateOrderCancelDto) {
    const repository = this.dataRepository.writeCancellationsRepository;
    const response = await repository.createOrderCancel(body);
    return response;
  }

  async cancelEvent(type: CancellationTypes | CancellationProductTypes, id: string, body: any) {
    const response = await this.dataQuery.cancellationsQuery.cancelEvent(type, id, body);
    return response;
  }
}
