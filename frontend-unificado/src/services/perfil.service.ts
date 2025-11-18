// =====================================================
// SERVICIO - PERFILES
// =====================================================
// Servicio para interactuar con la API de perfiles
// Solo realiza llamadas HTTP, sin dependencia de Supabase
// =====================================================

import { httpClient, buildQueryString } from '@/lib/http-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type {
  ClasificarPerfilRequest,
  ClasificarPerfilResponse,
  ObtenerPerfilResponse,
  Perfil,
} from '@/types/perfil.types';

/**
 * Servicio de Perfiles
 * Interactúa con las Edge Functions de Supabase (backend)
 */
export class PerfilService {
  /**
   * Clasifica un perfil de estudiante basado en sus respuestas
   *
   * @param data - Datos del estudiante y respuestas del formulario
   * @returns Perfil clasificado con recomendaciones
   *
   * @example
   * ```typescript
   * const result = await PerfilService.clasificarPerfil({
   *   estudiante_id: 'EST001',
   *   grado: '3-4',
   *   nombre: 'Juan',
   *   apellido: 'Pérez',
   *   respuestas: {
   *     P1: 'A', P2: 'B', ...
   *   }
   * });
   *
   * if (result.success && result.data?.perfil) {
   *   console.log('Categoría:', result.data.perfil.categoria_principal);
   * }
   * ```
   */
  static async clasificarPerfil(
    data: ClasificarPerfilRequest
  ): Promise<ClasificarPerfilResponse> {
    const response = await httpClient.post<ClasificarPerfilResponse>(
      API_ENDPOINTS.clasificarPerfil,
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    return {
      success: false,
      error: response.error || 'Error al clasificar perfil',
    };
  }

  /**
   * Obtiene el perfil activo de un estudiante
   *
   * @param estudianteId - ID del estudiante
   * @returns Perfil del estudiante
   *
   * @example
   * ```typescript
   * const result = await PerfilService.obtenerPerfil('EST001');
   *
   * if (result.success && result.perfil) {
   *   console.log('Perfil encontrado:', result.perfil.categoria_principal);
   * }
   * ```
   */
  static async obtenerPerfil(
    estudianteId: string
  ): Promise<ObtenerPerfilResponse> {
    const queryString = buildQueryString({ estudiante_id: estudianteId });

    const response = await httpClient.get<ObtenerPerfilResponse>(
      `${API_ENDPOINTS.obtenerPerfil}${queryString}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    return {
      success: false,
      error: response.error || 'Error al obtener perfil',
    };
  }

  /**
   * Verifica si un estudiante tiene un perfil activo
   *
   * @param estudianteId - ID del estudiante
   * @returns true si tiene perfil, false si no
   */
  static async tienePerfil(estudianteId: string): Promise<boolean> {
    const result = await this.obtenerPerfil(estudianteId);
    return result.success && !!result.perfil;
  }
}

// Exportar como default también
export default PerfilService;
