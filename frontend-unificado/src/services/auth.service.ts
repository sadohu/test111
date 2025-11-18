// =====================================================
// SERVICIO - AUTENTICACIÓN
// =====================================================
// Servicio para autenticación de usuarios
// Maneja login, registro, logout y verificación de token
// =====================================================

import { httpClient } from '@/lib/http-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  LogoutResponse,
  VerifyTokenResponse,
} from '@/types/auth.types';

/**
 * Clave para almacenar el token en localStorage
 */
const TOKEN_KEY = 'auth_token';
const ESTUDIANTE_ID_KEY = 'estudiante_id';
const TIENE_PERFIL_KEY = 'tiene_perfil';

/**
 * Servicio de Autenticación
 *
 * NOTA: Este servicio asume que el backend tiene endpoints de autenticación.
 * Si tu backend de Supabase usa Row Level Security y autenticación nativa,
 * deberás ajustar estos métodos para usar Supabase Auth directamente.
 */
export class AuthService {
  /**
   * Inicia sesión con email y contraseña
   *
   * @param credentials - Email y contraseña del usuario
   * @returns Respuesta con token y datos del usuario
   *
   * @example
   * ```typescript
   * const result = await AuthService.login({
   *   email: 'usuario@example.com',
   *   password: 'mi-password'
   * });
   *
   * if (result.success && result.token) {
   *   console.log('Login exitoso:', result.user);
   * }
   * ```
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.authLogin,
        credentials
      );

      if (response.success && response.data?.token) {
        // Guardar token y datos en localStorage
        this.setToken(response.data.token);

        if (response.data.estudiante_id) {
          localStorage.setItem(ESTUDIANTE_ID_KEY, response.data.estudiante_id);
        }

        if (response.data.tiene_perfil !== undefined) {
          localStorage.setItem(TIENE_PERFIL_KEY, String(response.data.tiene_perfil));
        }

        return response.data;
      }

      return {
        success: false,
        error: response.error || 'Error al iniciar sesión',
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Registra un nuevo usuario
   *
   * @param data - Datos del nuevo usuario
   * @returns Respuesta con token y datos del usuario creado
   *
   * @example
   * ```typescript
   * const result = await AuthService.register({
   *   nombre: 'Juan Pérez',
   *   email: 'juan@example.com',
   *   password: 'mi-password',
   *   grado: '3-4'
   * });
   *
   * if (result.success) {
   *   console.log('Registro exitoso:', result.user);
   * }
   * ```
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.authRegister,
        data
      );

      if (response.success && response.data?.token) {
        // Guardar token y datos en localStorage
        this.setToken(response.data.token);

        if (response.data.estudiante_id) {
          localStorage.setItem(ESTUDIANTE_ID_KEY, response.data.estudiante_id);
        }

        // Usuario nuevo siempre empieza sin perfil
        localStorage.setItem(TIENE_PERFIL_KEY, 'false');

        return response.data;
      }

      return {
        success: false,
        error: response.error || 'Error al registrar usuario',
      };
    } catch (error) {
      console.error('Error en register:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Cierra la sesión del usuario
   *
   * @returns Respuesta de confirmación
   *
   * @example
   * ```typescript
   * const result = await AuthService.logout();
   *
   * if (result.success) {
   *   console.log('Sesión cerrada');
   * }
   * ```
   */
  static async logout(): Promise<LogoutResponse> {
    try {
      // Llamar al endpoint de logout si existe
      await httpClient.post(API_ENDPOINTS.authLogout);
    } catch (error) {
      console.error('Error al llamar logout endpoint:', error);
      // No fallar si el endpoint no existe
    }

    // Limpiar localStorage siempre
    this.clearAuth();

    return {
      success: true,
      mensaje: 'Sesión cerrada exitosamente',
    };
  }

  /**
   * Verifica si el token actual es válido
   *
   * @returns Datos del usuario si el token es válido
   *
   * @example
   * ```typescript
   * const result = await AuthService.verifyToken();
   *
   * if (result.success && result.user) {
   *   console.log('Token válido:', result.user);
   * } else {
   *   // Token inválido, redirigir a login
   * }
   * ```
   */
  static async verifyToken(): Promise<VerifyTokenResponse> {
    const token = this.getToken();

    if (!token) {
      return {
        success: false,
        error: 'No hay token de autenticación',
      };
    }

    try {
      const response = await httpClient.get<VerifyTokenResponse>(
        API_ENDPOINTS.authVerify,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.success && response.data?.user) {
        // Actualizar datos en localStorage si es necesario
        if (response.data.estudiante_id) {
          localStorage.setItem(ESTUDIANTE_ID_KEY, response.data.estudiante_id);
        }

        if (response.data.tiene_perfil !== undefined) {
          localStorage.setItem(TIENE_PERFIL_KEY, String(response.data.tiene_perfil));
        }

        return response.data;
      }

      // Token inválido, limpiar
      this.clearAuth();

      return {
        success: false,
        error: response.error || 'Token inválido',
      };
    } catch (error) {
      console.error('Error al verificar token:', error);
      this.clearAuth();

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Obtiene el token almacenado
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Obtiene el ID del estudiante almacenado
   */
  static getEstudianteId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ESTUDIANTE_ID_KEY);
  }

  /**
   * Verifica si el usuario tiene perfil clasificado
   */
  static tienePerfil(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(TIENE_PERFIL_KEY) === 'true';
  }

  /**
   * Verifica si hay una sesión activa
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Guarda el token en localStorage
   */
  private static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Limpia todos los datos de autenticación
   */
  private static clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ESTUDIANTE_ID_KEY);
    localStorage.removeItem(TIENE_PERFIL_KEY);
  }

  /**
   * Actualiza el estado de perfil después de la categorización
   */
  static marcarPerfilCompletado(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TIENE_PERFIL_KEY, 'true');
  }
}

// Exportar como default también
export default AuthService;
