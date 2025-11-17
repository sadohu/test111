/**
 * Cliente API para conectar con el backend generador-ejercicios
 * Base URL: http://localhost:8001
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import {
  GenerarEjerciciosRequest,
  GenerarEjerciciosResponse,
  ValidarRespuestaRequest,
  ValidarRespuestaResponse,
  HealthCheckResponse,
  ErrorResponse,
  CursoEnum,
} from "@/types/ejercicios";

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

class EjerciciosAPIClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 segundos para generación de ejercicios
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para logging (desarrollo)
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("[API] Request error:", error);
        return Promise.reject(error);
      }
    );

    // Interceptor para manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        console.error("[API] Response error:", error.response?.data || error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Maneja errores de la API
   */
  private handleError(error: AxiosError<ErrorResponse>): Error {
    if (error.response) {
      // Error con respuesta del servidor
      const data = error.response.data;
      return new Error(
        data?.detalle || data?.error || `Error ${error.response.status}`
      );
    } else if (error.request) {
      // Error de red - no hay respuesta
      return new Error(
        "No se puede conectar con el servidor. Verifica que el backend esté corriendo."
      );
    } else {
      // Otro tipo de error
      return new Error(error.message || "Error desconocido");
    }
  }

  // ==========================================================================
  // ENDPOINTS
  // ==========================================================================

  /**
   * Health check del servicio
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await this.client.get<HealthCheckResponse>("/health");
    return response.data;
  }

  /**
   * Generar ejercicios personalizados
   */
  async generarEjercicios(
    request: GenerarEjerciciosRequest
  ): Promise<GenerarEjerciciosResponse> {
    const response = await this.client.post<GenerarEjerciciosResponse>(
      "/api/generar-ejercicios",
      request
    );
    return response.data;
  }

  /**
   * Generar ejercicios de matemáticas
   */
  async generarEjerciciosMatematicas(
    estudianteId: string,
    cantidad: number = 5,
    tipoEspecifico?: string
  ): Promise<GenerarEjerciciosResponse> {
    const request: GenerarEjerciciosRequest = {
      estudiante_id: estudianteId,
      curso: CursoEnum.MATEMATICAS,
      cantidad,
      tipo_especifico: tipoEspecifico,
    };

    const response = await this.client.post<GenerarEjerciciosResponse>(
      "/api/generar-ejercicios/matematicas",
      request
    );
    return response.data;
  }

  /**
   * Generar ejercicios de razonamiento verbal
   */
  async generarEjerciciosVerbal(
    estudianteId: string,
    cantidad: number = 5,
    tipoEspecifico?: string
  ): Promise<GenerarEjerciciosResponse> {
    const request: GenerarEjerciciosRequest = {
      estudiante_id: estudianteId,
      curso: CursoEnum.VERBAL,
      cantidad,
      tipo_especifico: tipoEspecifico,
    };

    const response = await this.client.post<GenerarEjerciciosResponse>(
      "/api/generar-ejercicios/verbal",
      request
    );
    return response.data;
  }

  /**
   * Validar respuesta de un ejercicio
   */
  async validarRespuesta(
    request: ValidarRespuestaRequest
  ): Promise<ValidarRespuestaResponse> {
    const response = await this.client.post<ValidarRespuestaResponse>(
      "/api/validar-respuesta",
      request
    );
    return response.data;
  }

  /**
   * Obtener perfil de un estudiante
   */
  async obtenerPerfil(estudianteId: string): Promise<any> {
    const response = await this.client.get(`/api/perfiles/${estudianteId}`);
    return response.data;
  }

  /**
   * Listar todos los perfiles disponibles
   */
  async listarPerfiles(): Promise<any> {
    const response = await this.client.get("/api/perfiles");
    return response.data;
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

export const apiClient = new EjerciciosAPIClient();

// ============================================================================
// HOOKS DE REACT (para uso en componentes)
// ============================================================================

export interface UseGenerarEjerciciosOptions {
  onSuccess?: (data: GenerarEjerciciosResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook para generar ejercicios con estado de loading
 */
export function useGenerarEjercicios() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<GenerarEjerciciosResponse | null>(null);

  const generar = async (
    request: GenerarEjerciciosRequest,
    options?: UseGenerarEjerciciosOptions
  ) => {
    setLoading(true);
    setError(null);

    try {
      const resultado = await apiClient.generarEjercicios(request);
      setData(resultado);
      options?.onSuccess?.(resultado);
      return resultado;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error desconocido");
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { generar, loading, error, data };
}

/**
 * Hook para validar respuestas con estado de loading
 */
export function useValidarRespuesta() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const validar = async (
    request: ValidarRespuestaRequest
  ): Promise<ValidarRespuestaResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const resultado = await apiClient.validarRespuesta(request);
      return resultado;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error desconocido");
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { validar, loading, error };
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Verifica si el backend está disponible
 */
export async function verificarConexion(): Promise<boolean> {
  try {
    await apiClient.healthCheck();
    return true;
  } catch (error) {
    console.error("Backend no disponible:", error);
    return false;
  }
}

/**
 * Obtiene información del servicio
 */
export async function obtenerInfoServicio(): Promise<HealthCheckResponse | null> {
  try {
    return await apiClient.healthCheck();
  } catch (error) {
    console.error("Error obteniendo info del servicio:", error);
    return null;
  }
}

// Importar React para los hooks
import React from "react";

export default apiClient;
