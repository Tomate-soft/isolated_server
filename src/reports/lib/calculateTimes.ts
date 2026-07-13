import { DailyRegister } from 'src/schemas/dailyRegister/createDailyRegister';

interface Data extends DailyRegister {
  createdAt?: string;
}

interface ProcessedEmployeeData extends Data {
  workedTime?:
    | {
        tiempoTotal: string;
        tiempoDescanso: string;
      }
    | '--';
}

export function calculateTempo(obj: Data) {
  const { firstTime, secondTime, thirdTime, fourthTime, createdAt } = obj;

  // Extraer la fecha base de `createdAt`
  const fechaBase = new Date(createdAt).toISOString().split('T')[0]; // "YYYY-MM-DD"

  // Función auxiliar para construir Date con la fecha base
  const construirFecha = (horaString: string | null): Date | null =>
    horaString && horaString !== '--' ? new Date(`${fechaBase} ${horaString}`) : null;

  // Convertir tiempos a objetos Date
  const inicio = construirFecha(firstTime);
  let descansoInicio = construirFecha(secondTime);
  let descansoFin = construirFecha(thirdTime);
  let fin = construirFecha(fourthTime);

  // Verificar el estado del registro
  const tiempos = [firstTime, secondTime, thirdTime, fourthTime];
  const tiemposCompletos = tiempos.filter((t) => t && t !== '--').length;

  const estado =
    tiemposCompletos === 4 ? 'completo' : tiemposCompletos === 0 ? 'sin_registro' : 'incompleto';

  // Si no tiene al menos entrada y salida, retornar objeto con valores por defecto
  if (!inicio || !fin) {
    return {
      tiempoTrabajado: '0h 0m',
      tiempoDescanso: '0h 0m',
      tiempoTotal: '0h 0m',
      estado,
    };
  }

  // 🔥 Ajustar si alguna hora "cruza" al día siguiente
  if (fin < inicio) {
    fin.setDate(fin.getDate() + 1);
  }
  if (descansoInicio && descansoInicio < inicio) {
    descansoInicio.setDate(descansoInicio.getDate() + 1);
  }
  if (descansoFin && descansoFin < inicio) {
    descansoFin.setDate(descansoFin.getDate() + 1);
  }

  // Calcular tiempo total en empresa (entrada a salida)
  const tiempoTotalEnEmpresa = fin.getTime() - inicio.getTime();

  let tiempoDescansoMs = 0;
  let tiempoTrabajadoMs = tiempoTotalEnEmpresa;

  // Si hay tiempos de descanso, calcularlos
  if (descansoInicio && descansoFin) {
    tiempoDescansoMs = descansoFin.getTime() - descansoInicio.getTime();
    tiempoTrabajadoMs = tiempoTotalEnEmpresa - tiempoDescansoMs;
  }

  return {
    tiempoTrabajado: convertirMilisegundosAHorasMinutos(tiempoTrabajadoMs),
    tiempoDescanso: convertirMilisegundosAHorasMinutos(tiempoDescansoMs),
    tiempoTotal: convertirMilisegundosAHorasMinutos(tiempoTotalEnEmpresa),
    estado,
  };
}

// Función auxiliar para convertir milisegundos a horas y minutos legibles
function convertirMilisegundosAHorasMinutos(ms: number): string {
  if (ms <= 0) return '0h 0m';
  const horas = Math.floor(ms / (1000 * 60 * 60));
  const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${horas}h ${minutos}m`;
}

/**
 * Procesa un empleado individual y calcula su tiempo trabajado si tiene datos completos
 * @param employee - Datos del empleado
 * @returns Empleado con workedTime calculado
 */
export function processEmployee(employee: Data): ProcessedEmployeeData {
  const { firstTime, secondTime, thirdTime, fourthTime } = employee;

  // Verificar si tiene los 4 registros completos (no son "--")
  const hasCompleteRecord =
    firstTime &&
    firstTime !== '--' &&
    secondTime &&
    secondTime !== '--' &&
    thirdTime &&
    thirdTime !== '--' &&
    fourthTime &&
    fourthTime !== '--';

  if (hasCompleteRecord) {
    // Calcular tiempo trabajado
    const calculatedTime = calculateTempo(employee);

    return {
      ...employee,
      workedTime: calculatedTime,
    };
  }

  // Si no tiene registro completo, mantener "--"
  return {
    ...employee,
    workedTime: '--',
  };
}

/**
 * Procesa una lista de empleados y calcula tiempos trabajados
 * @param employees - Array de empleados
 * @returns Array de empleados procesados con workedTime
 */
export function processEmployeesData(employees: Data[]): ProcessedEmployeeData[] {
  return employees.map((employee) => processEmployee(employee));
}

/**
 * Función principal del servicio que retorna el JSON completo
 * @param rawEmployeesData - Datos crudos de empleados
 * @param period - Período del reporte
 * @returns JSON procesado con tiempos calculados
 */
export function getProcessedWorkData(rawEmployeesData: Data[], period: string) {
  // Procesar todos los empleados
  const processedWorkData = processEmployeesData(rawEmployeesData);

  // Estadísticas adicionales (opcional)
  const stats = {
    totalEmployees: processedWorkData.length,
    employeesWithCompleteRecord: processedWorkData.filter(
      (emp) => typeof emp.workedTime === 'object' && emp.workedTime !== null,
    ).length,
    employeesWithIncompleteRecord: processedWorkData.filter((emp) => emp.workedTime === '--')
      .length,
  };

  return {
    workData: processedWorkData,
    period,
    stats, // Opcional: incluir estadísticas
  };
}
