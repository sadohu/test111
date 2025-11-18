// =====================================================
// SERVICIO - ESTADÍSTICAS
// =====================================================
// Servicio para obtener estadísticas del sistema
// Solo realiza llamadas HTTP, sin dependencia de Supabase
// =====================================================

import { httpClient, buildQueryString } from '@/lib/http-client';
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * Estadísticas de un estudiante
 */
export interface EstadisticasEstudiante {
  estudiante_id: string;
  nombre?: string;
  apellido?: string;
  grado?: string;
  categoria_principal?: string;
  nivel_riesgo?: string;
  total_respuestas: number;
  respuestas_correctas: number;
  porcentaje_acierto: number;
  total_sesiones: number;
  sesiones_completadas: number;
}

/**
 * Estadísticas generales del sistema
 */
export interface EstadisticasGenerales {
  total_estudiantes: number;
  total_perfiles_activos: number;
  total_ejercicios_generados: number;
  total_respuestas: number;
  por_categoria: Record<string, number>;
  por_nivel_riesgo: Record<string, number>;
}

/**
 * Response de estadísticas
 */
export interface EstadisticasResponse {
  success: boolean;
  tipo?: 'estudiante' | 'general';
  estudiante_id?: string;
  estadisticas?: EstadisticasEstudiante | EstadisticasGenerales;
  error?: string;
}

/**
 * Servicio de Estadísticas
 * Interactúa con las Edge Functions de Supabase (backend)
 */
export class EstadisticasService {
  /**
   * Obtiene estadísticas de un estudiante específico
   *
   * @param estudianteId - ID del estudiante
   * @returns Estadísticas del estudiante
   *
   * @example
   * ```typescript
   * const result = await EstadisticasService.obtenerEstadisticasEstudiante('EST001');
   *
   * if (result.success && result.estadisticas) {
   *   const stats = result.estadisticas as EstadisticasEstudiante;
   *   console.log('Acierto:', stats.porcentaje_acierto + '%');
   * }
   * ```
   */
  static async obtenerEstadisticasEstudiante(
    estudianteId: string
  ): Promise<EstadisticasResponse> {
    const queryString = buildQueryString({ estudiante_id: estudianteId });

    const response = await httpClient.get<EstadisticasResponse>(
      `${API_ENDPOINTS.obtenerEstadisticas}${queryString}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    return {
      success: false,
      error: response.error || 'Error al obtener estadísticas',
    };
  }

  /**
   * Obtiene estadísticas generales del sistema
   *
   * @returns Estadísticas generales
   *
   * @example
   * ```typescript
   * const result = await EstadisticasService.obtenerEstadisticasGenerales();
   *
   * if (result.success && result.estadisticas) {
   *   const stats = result.estadisticas as EstadisticasGenerales;
   *   console.log('Total estudiantes:', stats.total_estudiantes);
   * }
   * ```
   */
  static async obtenerEstadisticasGenerales(): Promise<EstadisticasResponse> {
    const response = await httpClient.get<EstadisticasResponse>(
      API_ENDPOINTS.obtenerEstadisticas
    );

    if (response.success && response.data) {
      return response.data;
    }

    return {
      success: false,
      error: response.error || 'Error al obtener estadísticas',
    };
  }
}

// Exportar como default también
export default EstadisticasService;
