// =====================================================
// SERVICIO - EJERCICIOS
// =====================================================
// Servicio para interactuar con la API de ejercicios
// Solo realiza llamadas HTTP, sin dependencia de Supabase
// =====================================================

import { httpClient, buildQueryString } from '@/lib/http-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type {
  GenerarEjerciciosRequest,
  GenerarEjerciciosResponse,
  GuardarRespuestaRequest,
  GuardarRespuestaResponse,
  ValidarRespuestaRequest,
  ValidarRespuestaResponse,
  Ejercicio,
  Curso,
} from '@/types/ejercicios.types';

/**
 * Servicio de Ejercicios
 * Interactúa con las Edge Functions de Supabase (backend)
 */
export class EjerciciosService {
  /**
   * Genera ejercicios personalizados usando Gemini AI
   *
   * @param data - Configuración para generación de ejercicios
   * @returns Lista de ejercicios generados
   *
   * @example
   * ```typescript
   * const result = await EjerciciosService.generarEjercicios({
   *   estudiante_id: 'EST001',
   *   curso: 'matematicas',
   *   cantidad: 5,
   *   tipo_especifico: 'suma'
   * });
   *
   * if (result.success && result.ejercicios) {
   *   console.log('Ejercicios generados:', result.ejercicios.length);
   * }
   * ```
   */
  static async generarEjercicios(
    data: GenerarEjerciciosRequest
  ): Promise<GenerarEjerciciosResponse> {
    const response = await httpClient.post<GenerarEjerciciosResponse>(
      API_ENDPOINTS.generarEjercicios,
      data,
      { timeout: 60000 } // 60 segundos para Gemini AI
    );

    if (response.success && response.data) {
      return response.data;
    }

    return {
      success: false,
      error: response.error || 'Error al generar ejercicios',
    };
  }

  /**
   * Guarda la respuesta de un estudiante a un ejercicio
   *
   * @param data - Datos de la respuesta
   * @returns Resultado de la validación
   *
   * @example
   * ```typescript
   * const result = await EjerciciosService.guardarRespuesta({
   *   estudiante_id: 'EST001',
   *   ejercicio_id: 'MAT_INT_001',
   *   curso: 'matematicas',
   *   respuesta_seleccionada: 'A',
   *   tiempo_respuesta_ms: 15000
   * });
   *
   * if (result.success && result.es_correcta) {
   *   console.log('¡Respuesta correcta!');
   * }
   * ```
   */
  static async guardarRespuesta(
    data: GuardarRespuestaRequest
  ): Promise<GuardarRespuestaResponse> {
    const response = await httpClient.post<GuardarRespuestaResponse>(
      API_ENDPOINTS.guardarRespuesta,
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    return {
      success: false,
      error: response.error || 'Error al guardar respuesta',
    };
  }

  /**
   * Valida una respuesta sin guardarla (para preview)
   *
   * @param data - Ejercicio y respuesta a validar
   * @returns Si la respuesta es correcta o no
   *
   * @example
   * ```typescript
   * const result = await EjerciciosService.validarRespuesta({
   *   ejercicio_id: 'MAT_INT_001',
   *   respuesta: 'A'
   * });
   *
   * if (result.success && result.es_correcta) {
   *   console.log('Respuesta correcta');
   * }
   * ```
   */
  static async validarRespuesta(
    data: ValidarRespuestaRequest
  ): Promise<ValidarRespuestaResponse> {
    const response = await httpClient.post<ValidarRespuestaResponse>(
      API_ENDPOINTS.validarRespuesta,
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    return {
      success: false,
      error: response.error || 'Error al validar respuesta',
    };
  }

  /**
   * Genera ejercicios de matemáticas
   * Wrapper convenience para generar ejercicios de matemáticas
   */
  static async generarMatematicas(
    estudianteId: string,
    cantidad: number = 5,
    tipoEspecifico?: string
  ): Promise<GenerarEjerciciosResponse> {
    return this.generarEjercicios({
      estudiante_id: estudianteId,
      curso: 'matematicas',
      cantidad,
      tipo_especifico: tipoEspecifico,
    });
  }

  /**
   * Genera ejercicios de razonamiento verbal
   * Wrapper convenience para generar ejercicios de verbal
   */
  static async generarVerbal(
    estudianteId: string,
    cantidad: number = 5,
    tipoEspecifico?: string
  ): Promise<GenerarEjerciciosResponse> {
    return this.generarEjercicios({
      estudiante_id: estudianteId,
      curso: 'verbal',
      cantidad,
      tipo_especifico: tipoEspecifico,
    });
  }
}

// Exportar como default también
export default EjerciciosService;
