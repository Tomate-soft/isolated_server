# Nuevo Endpoint: Get Operating Periods by Month

## Descripción
Nuevo endpoint que recupera todos los `OperatingPeriod` de un mes específico usando query parameters.

## Endpoint
- **URL**: `GET /period-stats/by-month?month=YYYY-MM`
- **Método**: GET
- **Query Parameter**: 
  - `month` (requerido): Mes en formato `YYYY-MM` (ej: `2026-05`)

## Respuesta
```json
{
  "month": "2026-05",
  "count": 5,
  "data": [
    {
      "_id": "...",
      "status": true,
      "dailyRegisters": [],
      "sellProcess": [],
      "withdrawals": "0.00",
      "cashIn": {
        "init": false,
        "amount": "$0.00"
      },
      "moneyMovements": [],
      "createdAt": "2026-05-12T10:30:00.000Z",
      ...
    }
  ]
}
```

## Estructura Implementada

### 1. Query
- **Archivo**: `core/application/entrypoint/queries/GetOperatingPeriodsByMonth.query.ts`
- **Descripción**: Define el query command que recibe el mes como parámetro

### 2. Handler
- **Archivo**: `core/application/entrypoint/queries/handler/GetOperatingPeriodsByMonthHandler.ts`
- **Descripción**: Procesa el query y llama al repositorio para recuperar los datos

### 3. Repositorio
- **Archivo**: `core/domain/ports/outbound/OperatingPeriodRepository.ts`
- **Cambios**: Agregado método `findByMonth(month: string): Promise<OperatingPeriod[]>`
- **Implementación**: `infrastructure/persistence/mongo/repositories/MongoOperatingPeriod.repository.ts`
  - Filtra por rango de fechas usando `createdAt` field
  - Soporta formato de mes `YYYY-MM`

### 4. Controlador
- **Archivo**: `infrastructure/presentation/http-server/controllers/period-stats.controller.ts`
- **Endpoint**: `GET /period-stats/by-month`
- **Query Param**: `month` (formato: YYYY-MM)

### 5. Providers
- **handlers.provider.ts**: Registrado el nuevo handler

## Uso
```bash
# Ejemplo de request
curl "http://localhost:3000/period-stats/by-month?month=2026-05"
```

## Validaciones
- El parámetro `month` es requerido
- El formato debe ser `YYYY-MM`
- Si el formato es inválido, se lanzará un error

## Notas
- Se utiliza la arquitectura hexagonal ya existente en el proyecto
- El filtrado se realiza sobre el campo `createdAt` automático de Mongoose
- La respuesta incluye un contador (`count`) de registros encontrados
