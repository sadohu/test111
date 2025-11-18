/**
 * Tipos TypeScript que coinciden con los modelos Pydantic del backend
 * Backend: generador-ejercicios/models/
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum CursoEnum {
  MATEMATICAS = "matematicas",
  VERBAL = "verbal",
}

export enum NivelDificultad {
  FACIL = "facil",
  MEDIO = "medio",
  DIFICIL = "dificil",
}

export enum TipoEjercicioMatematicas {
  // Básico
  SUMA = "suma",
  RESTA = "resta",
  CONTEO = "conteo",
  COMPARACION = "comparacion",
  FIGURAS = "figuras",
  PATRONES = "patrones",

  // Intermedio
  MULTIPLICACION = "multiplicacion",
  DIVISION = "division",
  FRACCIONES = "fracciones",
  GEOMETRIA = "geometria",
  PROBLEMAS_MIXTOS = "problemas_mixtos",

  // Avanzado
  OPERACIONES_COMBINADAS = "operaciones_combinadas",
  PORCENTAJES = "porcentajes",
  GEOMETRIA_AVANZADA = "geometria_avanzada",
  PROPORCIONES = "proporciones",
  RAZONAMIENTO_LOGICO = "razonamiento_logico",
  DECIMALES = "decimales",
}

export enum TipoEjercicioVerbal {
  // Básico
  SINONIMOS = "sinonimos",
  ANTONIMOS = "antonimos",
  ANALOGIAS = "analogias",
  CATEGORIAS = "categorias",
  COMPRENSION = "comprension",
  COMPLETAR = "completar",

  // Intermedio
  TERMINO_EXCLUIDO = "termino_excluido",
  ORACIONES_INCOMPLETAS = "oraciones_incompletas",

  // Avanzado
  SINONIMOS_CONTEXTUALES = "sinonimos_contextuales",
  ANTONIMOS_PRECISOS = "antonimos_precisos",
  ANALOGIAS_COMPLEJAS = "analogias_complejas",
  COMPRENSION_INFERENCIAL = "comprension_inferencial",
  PLAN_DE_REDACCION = "plan_de_redaccion",
  ORACIONES_ELIMINADAS = "oraciones_eliminadas",
  CONECTORES_LOGICOS = "conectores_logicos",
}

// ============================================================================
// MODELOS DE EJERCICIOS
// ============================================================================

export interface EjercicioBase {
  id: string;
  titulo?: string;
  enunciado: string;
  opciones: string[];
  respuesta_correcta: string;
  explicacion: string;
  nivel: NivelDificultad;
}

export interface EjercicioMatematicas extends EjercicioBase {
  tipo: TipoEjercicioMatematicas;
  operacion_principal?: string;
  contexto?: string;
  incluye_visual: boolean;
}

export interface EjercicioVerbal extends EjercicioBase {
  tipo: TipoEjercicioVerbal;
  palabra_clave?: string;
  categoria_semantica?: string;
}

// Union type para cualquier ejercicio
export type Ejercicio = EjercicioMatematicas | EjercicioVerbal;

// ============================================================================
// REQUEST/RESPONSE MODELS
// ============================================================================

export interface GenerarEjerciciosRequest {
  estudiante_id: string;
  curso: CursoEnum;
  cantidad?: number; // Default: 5
  tipo_especifico?: string;
  forzar_nivel?: NivelDificultad;
}

export interface PerfilResumen {
  estudiante_id: string;
  grado: string;
  nivel_matematicas?: string;
  nivel_lectura?: string;
  estilo_aprendizaje: string;
  velocidad_lectura: string;
  areas_interes: string;
}

export interface GenerarEjerciciosResponse {
  success: boolean;
  mensaje: string;
  estudiante_id: string;
  curso: CursoEnum;
  cantidad_solicitada: number;
  cantidad_generada: number;
  ejercicios_matematicas?: EjercicioMatematicas[];
  ejercicios_verbales?: EjercicioVerbal[];
  perfil_usado: PerfilResumen;
  nivel_determinado: string;
  tiempo_generacion_segundos: number;
}

export interface ValidarRespuestaRequest {
  ejercicio_id: string;
  respuesta_estudiante: string;
  estudiante_id: string;
  tiempo_respuesta_segundos?: number;
}

export interface ValidarRespuestaResponse {
  success: boolean;
  ejercicio_id: string;
  es_correcta: boolean;
  respuesta_estudiante: string;
  respuesta_correcta: string;
  explicacion: string;
  retroalimentacion: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  detalle?: string;
  codigo_error?: string;
}

export interface HealthCheckResponse {
  status: string;
  servicio: string;
  version: string;
  gemini_disponible: boolean;
  perfiles_disponibles: number;
}

// ============================================================================
// TRACKING DE SESIONES (Backend models)
// ============================================================================

export enum EstadoSesion {
  INICIADA = "iniciada",
  EN_PROGRESO = "en_progreso",
  COMPLETADA = "completada",
  ABANDONADA = "abandonada",
}

export interface RespuestaEstudianteBackend {
  ejercicio_id: string;
  opcion_seleccionada: string;
  es_correcta: boolean;
  tiempo_respuesta_segundos: number;
  timestamp: string;
}

export interface SesionEjerciciosBackend {
  sesion_id: string;
  estudiante_id: string;
  curso: CursoEnum;
  nivel_determinado: string;
  cantidad_ejercicios: number;
  ejercicios_ids: string[];
  respuestas: RespuestaEstudianteBackend[];
  fecha_inicio: string;
  fecha_fin?: string;
  estado: EstadoSesion;
  perfil_usado: any;
}

export interface CrearSesionRequest {
  estudiante_id: string;
  curso: CursoEnum;
  ejercicios_ids: string[];
  nivel_determinado: string;
  perfil_usado?: any;
}

export interface CrearSesionResponse {
  success: boolean;
  mensaje: string;
  sesion_id: string;
  sesion: SesionEjerciciosBackend;
}

export interface RegistrarRespuestaRequest {
  ejercicio_id: string;
  opcion_seleccionada: string;
  es_correcta: boolean;
  tiempo_respuesta_segundos: number;
}

export interface RegistrarRespuestaResponse {
  success: boolean;
  mensaje: string;
  respuesta: RespuestaEstudianteBackend;
  progreso: {
    completados: number;
    total: number;
    correctos: number;
  };
}

export interface RecomendacionNivel {
  nivel_actual: string;
  nivel_recomendado: string;
  direccion: "subir" | "mantener" | "bajar";
  razon: string;
  confianza: "alta" | "media" | "baja";
  cambio_aplicado: boolean;
  metricas: Record<string, any>;
}

export interface CompletarSesionResponse {
  success: boolean;
  mensaje: string;
  sesion_id: string;
  estadisticas: EstadisticasSesion;
  recomendacion_nivel?: RecomendacionNivel;
}

export interface ObtenerEstadisticasEstudianteResponse {
  success: boolean;
  estudiante_id: string;
  estadisticas: EstadisticasEstudianteBackend;
  sesiones_recientes: SesionEjerciciosBackend[];
}

export interface EstadisticasEstudianteBackend {
  estudiante_id: string;
  total_sesiones: number;
  total_ejercicios_completados: number;
  total_ejercicios_correctos: number;
  tasa_aciertos_promedio: number;
  tiempo_promedio_por_ejercicio: number;
  sesiones_matematicas: number;
  sesiones_verbal: number;
  tasa_aciertos_matematicas?: number;
  tasa_aciertos_verbal?: number;
  ultima_sesion_fecha?: string;
  ultima_sesion_id?: string;
}

// ============================================================================
// TIPOS PARA UI (mantener compatibilidad)
// ============================================================================

export interface RespuestaEstudiante {
  ejercicio_id: string;
  opcion_seleccionada: string;
  tiempo_inicio: number;
  tiempo_fin?: number;
  es_correcta?: boolean;
}

export interface SesionEjercicios {
  id: string;
  estudiante_id: string;
  curso: CursoEnum;
  ejercicios: Ejercicio[];
  respuestas: RespuestaEstudiante[];
  fecha_inicio: string;
  fecha_fin?: string;
  completado: boolean;
}

export interface EstadisticasSesion {
  total_ejercicios: number;
  ejercicios_completados: number;
  ejercicios_correctos: number;
  tasa_aciertos: number;
  tiempo_promedio_segundos: number;
  tiempo_total_segundos: number;
}

// ============================================================================
// TIPOS PARA COMPONENTES
// ============================================================================

export interface EjercicioCardProps {
  ejercicio: Ejercicio;
  numero: number;
  total: number;
  onResponder: (opcion: string) => void;
  respuestaSeleccionada?: string;
  mostrarResultado: boolean;
  disabled: boolean;
}

export interface OpcionButtonProps {
  letra: string;
  texto: string;
  selected: boolean;
  correct?: boolean;
  incorrect?: boolean;
  disabled: boolean;
  onClick: () => void;
}

export interface ProgressBarProps {
  actual: number;
  total: number;
  correctos: number;
}

export interface FeedbackPanelProps {
  mostrar: boolean;
  esCorrecta: boolean;
  explicacion: string;
  retroalimentacion: string;
  onContinuar: () => void;
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Extrae la letra de una opción formateada
 * Ejemplo: "A) Respuesta aquí" -> "A"
 */
export function extraerLetraOpcion(opcion: string): string {
  const match = opcion.match(/^([A-Z])\)/);
  return match ? match[1] : opcion.charAt(0);
}

/**
 * Extrae el texto de una opción sin la letra
 * Ejemplo: "A) Respuesta aquí" -> "Respuesta aquí"
 */
export function extraerTextoOpcion(opcion: string): string {
  return opcion.replace(/^[A-Z]\)\s*/, "");
}

/**
 * Determina si un ejercicio es de matemáticas
 */
export function esEjercicioMatematicas(
  ejercicio: Ejercicio
): ejercicio is EjercicioMatematicas {
  return "operacion_principal" in ejercicio;
}

/**
 * Determina si un ejercicio es verbal
 */
export function esEjercicioVerbal(
  ejercicio: Ejercicio
): ejercicio is EjercicioVerbal {
  return "palabra_clave" in ejercicio;
}

/**
 * Obtiene el color del badge según el nivel
 */
export function getColorNivel(nivel: NivelDificultad): string {
  switch (nivel) {
    case NivelDificultad.FACIL:
      return "bg-green-100 text-green-800";
    case NivelDificultad.MEDIO:
      return "bg-yellow-100 text-yellow-800";
    case NivelDificultad.DIFICIL:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Obtiene el texto legible del nivel
 */
export function getLabelNivel(nivel: NivelDificultad): string {
  switch (nivel) {
    case NivelDificultad.FACIL:
      return "Fácil";
    case NivelDificultad.MEDIO:
      return "Medio";
    case NivelDificultad.DIFICIL:
      return "Difícil";
    default:
      return nivel;
  }
}

/**
 * Formatea tiempo en segundos a formato legible
 */
export function formatearTiempo(segundos: number): string {
  if (segundos < 60) {
    return `${segundos}s`;
  }
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${minutos}m ${segs}s`;
}

/**
 * Calcula estadísticas de una sesión
 */
export function calcularEstadisticas(
  sesion: SesionEjercicios
): EstadisticasSesion {
  const total = sesion.ejercicios.length;
  const completados = sesion.respuestas.filter((r) => r.es_correcta !== undefined).length;
  const correctos = sesion.respuestas.filter((r) => r.es_correcta === true).length;
  const tasa_aciertos = completados > 0 ? correctos / completados : 0;

  const tiempos = sesion.respuestas
    .filter((r) => r.tiempo_fin !== undefined)
    .map((r) => (r.tiempo_fin! - r.tiempo_inicio) / 1000);

  const tiempo_total = tiempos.reduce((acc, t) => acc + t, 0);
  const tiempo_promedio = tiempos.length > 0 ? tiempo_total / tiempos.length : 0;

  return {
    total_ejercicios: total,
    ejercicios_completados: completados,
    ejercicios_correctos: correctos,
    tasa_aciertos,
    tiempo_promedio_segundos: Math.round(tiempo_promedio),
    tiempo_total_segundos: Math.round(tiempo_total),
  };
}
