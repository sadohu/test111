// =====================================================
// TIPOS - ESTADÍSTICAS
// =====================================================
// Tipos TypeScript para estadísticas y reportes
// =====================================================

/**
 * Estadísticas por materia
 */
export interface EstadisticasMateria {
  materia: string;
  total_ejercicios: number;
  ejercicios_correctos: number;
  porcentaje_acierto: number;
  tiempo_promedio_ms: number;
}

/**
 * Actividad diaria
 */
export interface ActividadDiaria {
  fecha: string;
  ejercicios_completados: number;
  ejercicios_correctos: number;
  tiempo_total_ms: number;
  materias: string[];
}

/**
 * Racha de días
 */
export interface Racha {
  racha_actual: number;
  racha_maxima: number;
  ultimo_dia_activo: string;
}

/**
 * Estadísticas globales del estudiante
 */
export interface EstadisticasGlobales {
  total_ejercicios: number;
  ejercicios_correctos: number;
  ejercicios_incorrectos: number;
  porcentaje_acierto_global: number;
  tiempo_total_ms: number;
  tiempo_promedio_por_ejercicio_ms: number;
  racha: Racha;
  por_materia: EstadisticasMateria[];
  actividad_reciente: ActividadDiaria[];
}

/**
 * Respuesta de obtener estadísticas
 */
export interface ObtenerEstadisticasResponse {
  success: boolean;
  estadisticas?: EstadisticasGlobales;
  error?: string;
  mensaje?: string;
}

/**
 * Filtros para estadísticas
 */
export interface FiltrosEstadisticas {
  estudiante_id: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  curso?: string;
}
