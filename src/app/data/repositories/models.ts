import { OrderCancel, OrderCancelSchema } from '@schema/cancellations/order-cancel.schema';
import { RewritedPeriod, RewritedPeriodSchema } from '@schema/RewritedPeriod/rewritedPeriod';
import { Bills, BillSchema } from '@schema/sales/bills.schema';
import { EmployeeOrder, EmployeeOrderSchema } from '@schema/sales/employee-order.schema';
import { Branch, BranchSchema } from 'src/schemas/business/branchSchema';
import { Dishes, DishesSchema } from 'src/schemas/catalogo/dishes.schema';
import { Modifier, ModifierSchema } from 'src/schemas/catalogo/modifiers.Schema';
import { Products, ProductSchema } from 'src/schemas/catalogo/products.schema';
import {
  SubCategoryOne,
  SubCategoryOneSchema,
} from 'src/schemas/catalogo/subcategories/subCategoryOne.Schema';
import {
  OperatingPeriod,
  OperatingPeriodSchema,
} from 'src/schemas/operatingPeriod/operatingPeriod.schema';
import { Table, TableSchema } from 'src/schemas/tables/tableSchema';
import { User, UserSchema } from 'src/schemas/users.schema';
import { PhoneOrder, PhoneOrderSchema } from 'src/schemas/ventas/orders/phoneOrder.schema';
import { RappiOrder, RappiOrderSchema } from 'src/schemas/ventas/orders/rappiOrder.schema';
import { ToGoOrder, ToGoOrderSchema } from 'src/schemas/ventas/orders/toGoOrder.schema';
import { Payment, PaymentSchema } from 'src/schemas/ventas/payment.schema';

export const repositoriesModels = [
  { name: Bills.name, schema: BillSchema },
  { name: ToGoOrder.name, schema: ToGoOrderSchema },
  { name: RappiOrder.name, schema: RappiOrderSchema },
  { name: PhoneOrder.name, schema: PhoneOrderSchema },
  { name: Payment.name, schema: PaymentSchema },
  { name: OperatingPeriod.name, schema: OperatingPeriodSchema },
  { name: RewritedPeriod.name, schema: RewritedPeriodSchema },
  { name: OrderCancel.name, schema: OrderCancelSchema },
  { name: Table.name, schema: TableSchema },
  { name: SubCategoryOne.name, schema: SubCategoryOneSchema },
  { name: Dishes.name, schema: DishesSchema },
  { name: Modifier.name, schema: ModifierSchema },
  { name: Products.name, schema: ProductSchema },
  { name: User.name, schema: UserSchema },
  { name: Branch.name, schema: BranchSchema },
  { name: EmployeeOrder.name, schema: EmployeeOrderSchema },
];
