export interface CreateOrderCancelProps {
  cancelBy: string;
  cancellationReason: string;
  description: string;
  operatingPeriod: string;
}

export interface CreateProductCancelProps {
  cancelBy: string;
  cancellationReason: string;
  description: string;
  operatingPeriod: string;
  product: string;
  orderTotal: number;
}
