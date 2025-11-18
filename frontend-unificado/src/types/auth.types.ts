// =====================================================
// TIPOS - AUTENTICACIÓN
// =====================================================
// Tipos TypeScript para autenticación de usuarios
// =====================================================

/**
 * Datos para login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Datos para registro
 */
export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  grado?: string;
}

/**
 * Usuario autenticado
 */
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  grado?: string;
  created_at: string;
}

/**
 * Respuesta de login/registro
 */
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: Usuario;
  estudiante_id?: string;
  tiene_perfil?: boolean;
  error?: string;
  mensaje?: string;
}

/**
 * Respuesta de logout
 */
export interface LogoutResponse {
  success: boolean;
  mensaje?: string;
  error?: string;
}

/**
 * Respuesta de verificación de token
 */
export interface VerifyTokenResponse {
  success: boolean;
  user?: Usuario;
  estudiante_id?: string;
  tiene_perfil?: boolean;
  error?: string;
}

/**
 * Datos del contexto de autenticación
 */
export interface AuthContextData {
  user: Usuario | null;
  estudianteId: string | null;
  tienePerfil: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
