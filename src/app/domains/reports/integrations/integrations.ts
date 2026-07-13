import { Injectable } from '@nestjs/common';
import { PeriodIntegration } from './period-integration';
import { ProductSalesIntegrations } from './product-sales-integrations';
import { EmployeeOrdersIntegrations } from './employee-orders-integrations';
import { CancelsIntegration } from './cancels-integration';
import { SalesIntegration } from './sales-integration';
import { CourtesiesIntegration } from './courtesies-integration';
import { TimeIntegration } from './time-integration';

@Injectable()
export class ReportsIntegrations {
  constructor(
    private readonly periodIntegration: PeriodIntegration,
    private readonly productSalesIntegration: ProductSalesIntegrations,
    private readonly employeeOrdersIntegration: EmployeeOrdersIntegrations,
    private readonly cancelsIntegration: CancelsIntegration,
    private readonly salesIntegration: SalesIntegration,
    private readonly courtesiesIntegration: CourtesiesIntegration,
    private readonly timeIntegration: TimeIntegration,
  ) {}

  async getPeriodById(id: string) {
    const response = await this.periodIntegration.getPeriodById(id);
    return response;
  }

  async getMoneyMovementsByPeriodId(id: string) {
    const response = await this.periodIntegration.getMoneyMovementsByPeriodId(id);
    return response;
  }

  // products sales
  async getProductSalesByPeriodId(period: string) {
    const response = await this.productSalesIntegration.getProductSalesByPeriodId(period);
    return response;
  }

  // orders-reports
  async getEmployeeOrderReport(id: string) {
    return this.employeeOrdersIntegration.getEmployeeOrdersForReport(id);
  }

  // cancels-reports
  async getTotalCancelsReport(period: string) {
    return this.cancelsIntegration.getTotalCancelsReport(period);
  }

  async getAuthCancellationDetailsReport(period: string) {
    return this.cancelsIntegration.getAuthCancellationDetailsReport(period);
  }

  async getCancelsOrdersByPeriod(period: string) {
    return this.cancelsIntegration.getCancelsOrdersByPeriod(period);
  }

  async getAllProductCancellationsByPeriod(period: string) {
    return this.cancelsIntegration.getAllProductCancellationsByPeriod(period);
  }
  async getSellTypeUserSales(period: string, sellType: string) {
    return this.salesIntegration.getSellTypeUserSales(period, sellType);
  }

  async getAllCourtesiesDetailsByPeriod(period: string) {
    return this.courtesiesIntegration.getCourtesiesReport(period);
  }

  async getProductsCourtesiesDetailsByPeriod(period: string) {
    return this.courtesiesIntegration.getProductsCourtesiesReport(period);
  }

  async getProductSalesByCategory(period: string, sellType: string) {
    return this.productSalesIntegration.getProductSalesByCategory(period, sellType);
  }

  async getOrdersAttentionTime(period: string) {
    return this.timeIntegration.getOrdersAttentionTime(period);
  }
}
