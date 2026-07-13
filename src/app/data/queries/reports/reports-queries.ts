import { Injectable } from '@nestjs/common';
import { TotalCancelsReport } from './provider/cancellations/total-cancels-report/total-cancels-report';
import { SelltypeUserSales } from './provider/sales/selltype-user-sales';
import { CourtesiesDetailsByPeriod } from './provider/courtesies/courtesies-details-by-period';
import { OrderAttentionTime } from './provider/time/order-attention-time';

@Injectable()
export class ReportsQueries {
  constructor(
    private readonly totalCancelsReport: TotalCancelsReport,
    private readonly sellTypeUserSales: SelltypeUserSales,
    private readonly courtesiesDetailsByPeriod: CourtesiesDetailsByPeriod,
    private readonly orderAttentionTime: OrderAttentionTime,
  ) {}
  async getTotalCancelsReport(period: string) {
    return this.totalCancelsReport.getTotalCancelsReport(period);
  }

  async getAuthCancellationDetailsReport(period: string) {
    return this.totalCancelsReport.getAuthCancellationDetailsReport(period);
  }

  async getCancelsOrdersByPeriod(period: string) {
    return this.totalCancelsReport.getCancelsOrdersByPeriod(period);
  }

  async getProductCancelsDetailsReport(period: string) {
    return this.totalCancelsReport.getAllProductCancellationsByPeriod(period);
  }

  async getTotalSellTypeUserSalesReport(period: string, sellType: string) {
    return this.sellTypeUserSales.getTotalSellsReport(period, sellType);
  }

  async getAllCourtesiesDetailsByPeriod(period: string) {
    return this.courtesiesDetailsByPeriod.getAllCourtesiesDetailsByPeriod(period);
  }
  async getProductsCourtesiesDetailsByPeriod(period: string) {
    return this.courtesiesDetailsByPeriod.getProductsCourtesiesDetailsByPeriod(period);
  }

  async getProductSalesByCategory(period: string, sellType: string) {
    return this.sellTypeUserSales.getProductsSalesQuantity(period, sellType);
  }

  async getOrdersAttentionTime(period: string) {
    return this.orderAttentionTime.getOrderAttentionTime(period);
  }
}
