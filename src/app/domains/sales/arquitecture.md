src/domains/ventas/
├── ventas.module.ts
├── bills/                          # Entidad: Facturas
│   ├── controllers/
│   │   ├── bills-basic.controller.ts
│   │   ├── bills-payment.controller.ts
│   │   ├── bills-history.controller.ts
│   │   └── bills-reports.controller.ts
│   ├── services/
│   │   ├── bills-basic.service.ts         # Orquestador principal
│   │   ├── core/
│   │   │   ├── bills-crud.service.ts
│   │   │   ├── bills-validation.service.ts
│   │   │   ├── bills-cache.service.ts
│   │   │   └── bills-transform.service.ts
│   │   ├── business/
│   │   │   ├── bills-calculation.service.ts # Cálculos de facturas
│   │   │   ├── bills-payment.service.ts    # Lógica de pagos
│   │   │   ├── bills-taxes.service.ts      # Cálculo de impuestos
│   │   │   └── bills-discount.service.ts   # Aplicación de descuentos
│   │   └── utils/
│   │       ├── bills-number-generator.service.ts
│   │       └── bills-pdf-generator.service.ts
│   ├── dto/
│   ├── schemas/
│   └── bills.module.ts
├── orders/                         # Entidad: Órdenes
│   ├── shared/                    # Compartido entre tipos de orden
│   │   ├── dto/
│   │   ├── interfaces/
│   │   └── enums/
│   ├── togo-order/                # Sub-entidad: Órdenes para llevar
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── togo-order.module.ts
│   ├── rappi-order/               # Sub-entidad: Órdenes Rappi
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── rappi-order.module.ts
│   ├── phone-order/               # Sub-entidad: Órdenes telefónicas
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── phone-order.module.ts
│   └── orders.module.ts           # Módulo que agrupa todas las órdenes
├── payments/                      # Entidad: Pagos
│   ├── controllers/
│   │   ├── payments-basic.controller.ts
│   │   ├── payments-methods.controller.ts
│   │   └── payments-reconciliation.controller.ts
│   ├── services/
│   │   ├── payments-basic.service.ts      # Orquestador principal
│   │   ├── core/
│   │   ├── business/
│   │   │   ├── payments-processing.service.ts
│   │   │   ├── payments-validation.service.ts
│   │   │   └── payments-refund.service.ts
│   │   └── integrations/
│   │       ├── stripe-payment.service.ts
│   │       ├── paypal-payment.service.ts
│   │       └── cash-payment.service.ts
│   ├── dto/
│   ├── schemas/
│   └── payments.module.ts
├── discounts/                     # Entidad: Descuentos
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   └── discounts.module.ts
├── cancellations/                 # Entidad: Cancelaciones
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   └── cancellations.module.ts
└── shared/                        # Compartido en el dominio
    ├── dto/
    │   ├── base-transaction.dto.ts
    │   └── payment-method.dto.ts
    ├── enums/
    │   ├── order-status.enum.ts
    │   ├── payment-status.enum.ts
    │   └── transaction-type.enum.ts
    ├── interfaces/
    │   ├── transaction.interface.ts
    │   └── payment-method.interface.ts
    └── constants/
        └── ventas.constants.ts