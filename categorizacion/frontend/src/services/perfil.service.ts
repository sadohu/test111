/**
 * Servicio para clasificación de perfiles estudiantiles
 * Maneja toda la comunicación con la API relacionada con perfiles
 */

import { apiClient } from './api.client';
import { API_CONFIG, APIResponse } from './api.config';
import type {
  ClasificarPerfilRequest,
  PerfilEstudiante,
  ValidarRespuestaRequest,
  Grado,
  RespuestasFormulario,
} from '@/models';

/**
 * Servicio de Perfiles
 */
class PerfilService {
  /**
   * Clasifica las respuestas del formulario y genera un perfil completo
   *
   * @param request - Datos de la solicitud (respuestas, grado, estudiante_id)
   * @returns Perfil del estudiante clasificado
   */
  async clasificarPerfil(
    request: ClasificarPerfilRequest
  ): Promise<APIResponse<PerfilEstudiante>> {
    try {
      console.log('📤 Enviando request para clasificar perfil:', request);

      const response = await apiClient.post<PerfilEstudiante>(
        API_CONFIG.endpoints.clasificarPerfil,
        request
      );

      if (response.success && response.data) {
        console.log('✅ Perfil clasificado exitosamente:', response.data.categoria_principal);
      }

      return response;
    } catch (error) {
      console.error('❌ Error al clasificar perfil:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Clasifica un perfil usando los parámetros directamente
   * Método de conveniencia
   */
  async clasificarPerfilSimple(
    respuestas: RespuestasFormulario,
    grado: Grado,
    estudianteId: string
  ): Promise<APIResponse<PerfilEstudiante>> {
    return this.clasificarPerfil({
      respuestas,
      grado,
      estudiante_id: estudianteId,
    });
  }

  /**
   * Valida una respuesta individual del formulario
   *
   * @param pregunta - ID de la pregunta (P1, P2, etc.)
   * @param respuesta - ID de la respuesta (A, B, C, etc.)
   * @param grado - Grado del estudiante
   * @returns Validación de la respuesta
   */
  async validarRespuesta(
    request: ValidarRespuestaRequest
  ): Promise<APIResponse<{ valida: boolean; mensaje?: string }>> {
    try {
      const response = await apiClient.post<{ valida: boolean; mensaje?: string }>(
        API_CONFIG.endpoints.validarRespuesta,
        request
      );

      return response;
    } catch (error) {
      console.error('❌ Error al validar respuesta:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Obtiene un perfil previamente guardado por ID
   *
   * @param estudianteId - ID del estudiante
   * @returns Perfil del estudiante
   */
  async obtenerPerfil(estudianteId: string): Promise<APIResponse<PerfilEstudiante>> {
    try {
      const endpoint = API_CONFIG.endpoints.obtenerPerfil.replace(':id', estudianteId);

      const response = await apiClient.get<PerfilEstudiante>(endpoint);

      return response;
    } catch (error) {
      console.error('❌ Error al obtener perfil:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Guarda un perfil en la base de datos
   *
   * @param perfil - Perfil del estudiante a guardar
   * @returns Confirmación del guardado
   */
  async guardarPerfil(perfil: PerfilEstudiante): Promise<APIResponse<{ id: string }>> {
    try {
      const response = await apiClient.post<{ id: string }>(
        API_CONFIG.endpoints.guardarPerfil,
        perfil
      );

      if (response.success) {
        console.log('💾 Perfil guardado exitosamente');
      }

      return response;
    } catch (error) {
      console.error('❌ Error al guardar perfil:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Actualiza un perfil existente
   *
   * @param estudianteId - ID del estudiante
   * @param perfilParcial - Datos parciales del perfil a actualizar
   * @returns Perfil actualizado
   */
  async actualizarPerfil(
    estudianteId: string,
    perfilParcial: Partial<PerfilEstudiante>
  ): Promise<APIResponse<PerfilEstudiante>> {
    try {
      const endpoint = API_CONFIG.endpoints.obtenerPerfil.replace(':id', estudianteId);

      const response = await apiClient.put<PerfilEstudiante>(endpoint, perfilParcial);

      if (response.success) {
        console.log('🔄 Perfil actualizado exitosamente');
      }

      return response;
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}

// Exportar instancia única (singleton)
export const perfilService = new PerfilService();

// Exportar también la clase para testing
export { PerfilService };
