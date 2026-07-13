interface Price {
  name: string;
  price: number;
}

export interface InternProduct {
  _id: string;
  code: string;
  category: string;
  subcategory: string;
  productName: string;
  status: string;
  quantity: number;
  active: boolean;
  prices: Price[];
  createdAt: Date;
  updatedAt: Date;
  group: string;
}
