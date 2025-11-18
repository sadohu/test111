/**
 * Configuración base de la API
 */

/**
 * Configuración de la API
 */
export const API_CONFIG = {
  // URL base de la API - ajustar según entorno
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',

  // Timeout en milisegundos
  timeout: 30000,

  // Headers por defecto
  headers: {
    'Content-Type': 'application/json',
  },

  // Endpoints
  endpoints: {
    clasificarPerfil: '/api/clasificar-perfil',
    validarRespuesta: '/api/validar-respuesta',
    obtenerFormulario: '/api/formulario',
    guardarPerfil: '/api/perfil',
    obtenerPerfil: '/api/perfil/:id',
  },
};

/**
 * Clase para manejar errores de API de manera consistente
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Response genérico de la API
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}
