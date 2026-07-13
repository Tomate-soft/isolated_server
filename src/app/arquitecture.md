src/
├── app.module.ts                    # Módulo raíz simplificado
├── app.controller.ts               # Controller principal
├── main.ts                         # Punto de entrada
├── core/                          # Funcionalidad core/compartida
│   ├── auth/                      # Autenticación y autorización
│   ├── database/                  # Configuraciones de DB
│   ├── guards/                    # Guards personalizados  
│   ├── interceptors/             # Interceptors globales
│   ├── pipes/                    # Pipes de validación
│   └── core.module.ts            # Módulo core
├── shared/                       # Recursos compartidos globalmente
│   ├── dto/                      # DTOs compartidos
│   ├── interfaces/               # Interfaces comunes
│   ├── constants/               # Constantes globales
│   ├── utils/                   # Utilidades
│   └── decorators/              # Decoradores personalizados
├── config/                      # Configuraciones
│   ├── database.config.ts       # Config de DB
│   ├── app.config.ts           # Config de app
│   └── redis.config.ts         # Config de Redis
└── domains/                    # Dominios de negocio
    ├── catalogo/               # Dominio: Catálogo de productos
    ├── ventas/                # Dominio: Ventas y facturación
    ├── usuarios/              # Dominio: Gestión de usuarios
    ├── caja/                  # Dominio: Caja y dinero
    ├── configuracion/         # Dominio: Configuraciones del sistema
    ├── reportes/              # Dominio: Reportes y analytics
    └── operaciones/           # Dominio: Operaciones diarias
