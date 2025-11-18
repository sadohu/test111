// =====================================================
// TIPOS - PERFIL
// =====================================================
// Definiciones de tipos para el sistema de perfiles
// =====================================================

/**
 * Grados válidos del sistema
 */
export type Grado = '1-2' | '3-4' | '5-6';

/**
 * Niveles de riesgo
 */
export type NivelRiesgo = 'bajo' | 'medio' | 'alto';

/**
 * Categorías de perfil disponibles
 */
export type CategoriaPerfil =
  | 'El Científico Resiliente'
  | 'El Artista Creativo'
  | 'El Explorador Kinestésico'
  | 'El Estratega Analítico'
  | 'El Líder Social'
  | 'El Pensador Silencioso'
  | 'El Aprendiz Constante'
  | 'El Desafiante Audaz'
  | 'El Soñador Creativo'
  | 'El Observador Reflexivo';

/**
 * Respuestas del formulario de categorización
 */
export interface RespuestasFormulario {
  P1: string;
  P2: string;
  P3: string;
  P4: string;
  P5: string;
  P6: string;
  P7: string;
  P8: string;
  P9: string;
  P10: string;
}

/**
 * Request para clasificar un perfil
 */
export interface ClasificarPerfilRequest {
  estudiante_id: string;
  grado: Grado;
  nombre?: string;
  apellido?: string;
  edad?: number;
  respuestas: RespuestasFormulario;
}

/**
 * Perfil de estudiante completo
 */
export interface Perfil {
  estudiante_id: string;
  grado: Grado;
  estilo_aprendizaje: string;
  velocidad: string;
  atencion: string;
  interes: string;
  nivel_matematicas: string;
  nivel_lectura: string;
  motivacion: string;
  frustracion: string;
  trabajo: string;
  energia: string;
  categoria_principal: CategoriaPerfil;
  nivel_riesgo: NivelRiesgo;
  recomendaciones: string[];
  confianza_perfil: number;
  respuestas_originales: RespuestasFormulario;
  fecha_creacion?: string;
  ultima_actualizacion?: string;
}

/**
 * Response de clasificar perfil
 */
export interface ClasificarPerfilResponse {
  success: boolean;
  mensaje?: string;
  perfil?: Perfil;
  error?: string;
}

/**
 * Response de obtener perfil
 */
export interface ObtenerPerfilResponse {
  success: boolean;
  perfil?: Perfil;
  error?: string;
}
