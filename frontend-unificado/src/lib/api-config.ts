// =====================================================
// CONFIGURACIÓN DE API
// =====================================================
// Configuración centralizada para llamadas a la API backend
// =====================================================

/**
 * URL base de la API (Supabase Edge Functions)
 * Se obtiene de las variables de entorno
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:54321/functions/v1';

/**
 * API Key opcional para autenticación
 * Solo si tu backend requiere autenticación
 */
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * Endpoints de la API
 */
export const API_ENDPOINTS = {
  // Autenticación (TODO: Implementar en el backend si es necesario)
  authLogin: '/auth/login',
  authRegister: '/auth/register',
  authLogout: '/auth/logout',
  authVerify: '/auth/verify',

  // Perfiles
  clasificarPerfil: '/clasificar-perfil',
  obtenerPerfil: '/obtener-perfil',

  // Ejercicios
  generarEjercicios: '/generar-ejercicios',
  guardarRespuesta: '/guardar-respuesta',
  validarRespuesta: '/validar-respuesta',

  // Estadísticas
  obtenerEstadisticas: '/obtener-estadisticas',
} as const;

/**
 * Headers por defecto para todas las peticiones
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
};

/**
 * Timeout por defecto (30 segundos)
 */
export const DEFAULT_TIMEOUT = 30000;

/**
 * Configuración de reintentos
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 segundo
};
