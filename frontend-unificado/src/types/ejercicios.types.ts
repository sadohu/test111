// =====================================================
// TIPOS - EJERCICIOS
// =====================================================
// Definiciones de tipos para el sistema de ejercicios
// =====================================================

/**
 * Cursos disponibles
 */
export type Curso = 'matematicas' | 'verbal';

/**
 * Niveles de dificultad
 */
export type Nivel = 'basico' | 'intermedio' | 'avanzado';

/**
 * Dificultad de ejercicio
 */
export type Dificultad = 'facil' | 'medio' | 'dificil';

/**
 * Ejercicio generado por la IA
 */
export interface Ejercicio {
  ejercicio_id: string;
  estudiante_id?: string;
  curso: Curso;
  tipo: string;
  nivel: Nivel;
  dificultad?: Dificultad;
  titulo: string;
  enunciado: string;
  opciones: string[];
  respuesta_correcta: string;
  explicacion: string;
  contexto?: string;
  operacion_principal?: string;
  incluye_visual?: boolean;
  tags?: string[];
  fecha_generacion?: string;
  usado?: boolean;
}

/**
 * Request para generar ejercicios
 */
export interface GenerarEjerciciosRequest {
  estudiante_id: string;
  curso: Curso;
  cantidad?: number;
  tipo_especifico?: string;
  forzar_nivel?: Nivel;
}

/**
 * Response de generar ejercicios
 */
export interface GenerarEjerciciosResponse {
  success: boolean;
  mensaje?: string;
  estudiante_id?: string;
  curso?: Curso;
  nivel_determinado?: Nivel;
  tipo?: string;
  cantidad_solicitada?: number;
  cantidad_generada?: number;
  ejercicios?: Ejercicio[];
  tiempo_generacion_segundos?: number;
  error?: string;
}

/**
 * Request para guardar respuesta
 */
export interface GuardarRespuestaRequest {
  estudiante_id: string;
  ejercicio_id: string;
  sesion_id?: string;
  curso: Curso;
  respuesta_seleccionada: string;
  tiempo_respuesta_ms?: number;
  dispositivo?: string;
}

/**
 * Response de guardar respuesta
 */
export interface GuardarRespuestaResponse {
  success: boolean;
  mensaje?: string;
  respuesta?: any;
  es_correcta?: boolean;
  respuesta_correcta?: string;
  explicacion?: string;
  error?: string;
}

/**
 * Request para validar respuesta
 */
export interface ValidarRespuestaRequest {
  ejercicio_id: string;
  respuesta: string;
}

/**
 * Response de validar respuesta
 */
export interface ValidarRespuestaResponse {
  success: boolean;
  valida?: boolean;
  es_correcta?: boolean;
  respuesta_correcta?: string;
  explicacion?: string;
  error?: string;
}

/**
 * Sesión de ejercicios
 */
export interface Sesion {
  sesion_id: string;
  estudiante_id: string;
  curso: Curso;
  cantidad_ejercicios: number;
  ejercicios_completados: number;
  correctas: number;
  incorrectas: number;
  porcentaje_acierto: number;
  tiempo_total_ms: number;
  estado: 'en_progreso' | 'completada' | 'abandonada';
  fecha_inicio: string;
  fecha_fin?: string;
}
