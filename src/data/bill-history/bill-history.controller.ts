import { Controller, Get, Post, Body } from '@nestjs/common';
import { BillHistoryService } from './bill-history.service';
import { Bills } from '@schema/sales/bills.schema';

@Controller('bill-history')
export class BillHistoryController {
  constructor(private readonly billHistoryService: BillHistoryService) {}

  // GET /bill-history
  @Get()
  async findAll(): Promise<void> {
    return this.billHistoryService.findAll();
  }

  // POST /bill-history
  @Post()
  async create(@Body() bills: Partial<Bills> | Partial<Bills>[]): Promise<void> {
    return this.billHistoryService.create(bills);
  }

  // 🔹 POST /bill-history/sync -> sincroniza rs0 a rs_historical
  @Post('sync')
  async sync(): Promise<void> {
    return this.billHistoryService.syncFromRS0Safe();
  }
}
