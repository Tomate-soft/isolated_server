src/domains/catalogo/
├── catalogo.module.ts              # Módulo principal del dominio
├── categories/                     # Entidad: Categorías
│   ├── controllers/
│   │   ├── categories-basic.controller.ts     # CRUD básico
│   │   ├── categories-reports.controller.ts   # Reportes
│   │   ├── categories-financial.controller.ts # Operaciones financieras
│   │   └── categories-operations.controller.ts # Operaciones especiales
│   ├── services/
│   │   ├── categories-basic.service.ts        # Orquestador principal
│   │   ├── core/
│   │   │   ├── categories-crud.service.ts     # Solo operaciones DB
│   │   │   ├── categories-validation.service.ts # Solo validaciones
│   │   │   ├── categories-cache.service.ts    # Solo cache
│   │   │   └── categories-transform.service.ts # Solo transformaciones
│   │   ├── business/
│   │   │   ├── categories-rules.service.ts    # Reglas de negocio
│   │   │   ├── categories-hierarchy.service.ts # Lógica de jerarquías
│   │   │   └── categories-relations.service.ts # Manejo de relaciones
│   │   └── utils/
│   │       ├── categories-query-builder.service.ts
│   │       └── categories-formatter.service.ts
│   ├── dto/
│   │   ├── basic/                             # DTOs para CRUD
│   │   │   ├── create-category.dto.ts
│   │   │   ├── update-category.dto.ts
│   │   │   ├── query-category.dto.ts
│   │   │   └── index.ts
│   │   ├── reports/                           # DTOs para reportes
│   │   │   ├── category-report.dto.ts
│   │   │   ├── analytics-query.dto.ts
│   │   │   └── index.ts
│   │   ├── financial/                         # DTOs financieros
│   │   │   ├── transfer-account.dto.ts
│   │   │   ├── balance-adjustment.dto.ts
│   │   │   ├── cost-allocation.dto.ts
│   │   │   └── index.ts
│   │   └── operations/                        # DTOs operaciones
│   │       ├── bulk-operations.dto.ts
│   │       ├── sync-inventory.dto.ts
│   │       └── index.ts
│   ├── schemas/
│   │   └── category.schema.ts
│   ├── interfaces/
│   │   └── category.interface.ts
│   └── categories.module.ts
├── dishes/                         # Entidad: Platillos
│   ├── controllers/
│   │   ├── dishes-basic.controller.ts
│   │   ├── dishes-menu.controller.ts          # Gestión de menús
│   │   ├── dishes-recipes.controller.ts       # Gestión de recetas
│   │   └── dishes-nutrition.controller.ts     # Información nutricional
│   ├── services/
│   │   ├── dishes-basic.service.ts            # Orquestador principal
│   │   ├── core/
│   │   │   ├── dishes-crud.service.ts
│   │   │   ├── dishes-validation.service.ts
│   │   │   ├── dishes-cache.service.ts
│   │   │   └── dishes-transform.service.ts
│   │   ├── business/
│   │   │   ├── dishes-recipes.service.ts      # Lógica de recetas
│   │   │   ├── dishes-nutrition.service.ts    # Cálculos nutricionales
│   │   │   ├── dishes-pricing.service.ts      # Cálculo de precios
│   │   │   └── dishes-availability.service.ts # Disponibilidad
│   │   └── utils/
│   │       └── dishes-calculator.service.ts
│   ├── dto/
│   │   ├── basic/
│   │   ├── recipes/
│   │   ├── nutrition/
│   │   └── menu/
│   ├── schemas/
│   │   ├── dish.schema.ts
│   │   ├── recipe.schema.ts
│   │   └── ingredient.schema.ts
│   └── dishes.module.ts
├── products/                       # Entidad: Productos
│   ├── controllers/
│   │   ├── products-basic.controller.ts
│   │   ├── products-inventory.controller.ts   # Inventario
│   │   ├── products-pricing.controller.ts     # Precios
│   │   └── products-suppliers.controller.ts   # Proveedores
│   ├── services/
│   │   ├── products-basic.service.ts          # Orquestador principal
│   │   ├── core/
│   │   │   ├── products-crud.service.ts
│   │   │   ├── products-validation.service.ts
│   │   │   ├── products-cache.service.ts
│   │   │   └── products-transform.service.ts
│   │   ├── business/
│   │   │   ├── products-inventory.service.ts  # Lógica inventario
│   │   │   ├── products-pricing.service.ts    # Lógica precios
│   │   │   ├── products-suppliers.service.ts  # Lógica proveedores
│   │   │   └── products-categories.service.ts # Relación categorías
│   │   └── utils/
│   │       ├── products-barcode.service.ts
│   │       └── products-import.service.ts
│   ├── dto/
│   ├── schemas/
│   └── products.module.ts
├── modifications/                  # Entidad: Modificaciones
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   ├── schemas/
│   └── modifications.module.ts
├── menus-yrecetas/                # Entidad: Menús y Recetas
│   ├── controllers/
│   ├── services/
│   ├── dto/
│   ├── schemas/
│   └── menus-yrecetas.module.ts
└── shared/                        # Compartido en el dominio
    ├── dto/
    │   ├── base-catalog-item.dto.ts
    │   └── pagination-catalog.dto.ts
    ├── interfaces/
    │   └── catalog-base.interface.ts
    ├── enums/
    │   ├── category-status.enum.ts
    │   └── product-type.enum.ts
    └── utils/
        └── catalog-helpers.ts