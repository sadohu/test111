/**
 * Tipos y modelos para el Sistema de Clasificación de Perfiles Estudiantiles
 */

// ============================================================================
// ENUMS Y TIPOS BASE
// ============================================================================

/**
 * Grados escolares soportados
 */
export type Grado = '1-2' | '3-4' | '5-6';

/**
 * Estilos de aprendizaje
 */
export type EstiloAprendizaje = 'visual' | 'auditivo' | 'kinestesico' | 'multimodal';

/**
 * Velocidad de procesamiento
 */
export type Velocidad = 'rapido' | 'moderado' | 'pausado';

/**
 * Nivel de atención
 */
export type Atencion = 'alta' | 'media' | 'baja';

/**
 * Áreas de interés
 */
export type AreaInteres = 'artistico' | 'deportivo' | 'cientifico' | 'literario' | 'social' | 'matematico';

/**
 * Nivel académico en matemáticas
 */
export type NivelMatematicas = 'avanzado' | 'intermedio' | 'basico';

/**
 * Nivel de lectura
 */
export type NivelLectura = 'experto' | 'desarrollado' | 'inicial';

/**
 * Nivel de motivación
 */
export type Motivacion = 'alta' | 'media' | 'baja';

/**
 * Manejo de frustración
 */
export type ManejoFrustracion = 'resiliente' | 'intermedio' | 'sensible';

/**
 * Preferencia de trabajo
 */
export type PreferenciaTrabajo = 'independiente' | 'colaborativo' | 'guiado';

/**
 * Horario de energía
 */
export type HorarioEnergia = 'matutino' | 'vespertino' | 'flexible';

/**
 * Nivel de riesgo académico
 */
export type NivelRiesgo = 'bajo' | 'medio' | 'alto';

// ============================================================================
// INTERFACES PARA FORMULARIOS
// ============================================================================

/**
 * Opciones de respuesta para una pregunta del formulario
 */
export interface OpcionFormulario {
  id: string; // 'A', 'B', 'C', 'D', 'E', 'F'
  emoji: string;
  texto: string;
  valor: string; // Valor que se mapea a la categoría
}

/**
 * Pregunta del formulario
 */
export interface PreguntaFormulario {
  id: string; // 'P1', 'P2', ... 'P10'
  pregunta: string;
  categoria: string; // 'estilo_aprendizaje', 'velocidad', etc.
  opciones: OpcionFormulario[];
}

/**
 * Formulario completo por grado
 */
export interface Formulario {
  nombre: string;
  rango_edad: string;
  caracteristicas: string[];
  preguntas: PreguntaFormulario[];
}

/**
 * Estructura del JSON de formularios
 */
export interface FormulariosData {
  formularios: {
    '1-2': Formulario;
    '3-4': Formulario;
    '5-6': Formulario;
  };
}

/**
 * Respuestas del formulario
 * Mapa de pregunta ID a respuesta ID
 * Ejemplo: { 'P1': 'A', 'P2': 'B', ... }
 */
export interface RespuestasFormulario {
  [preguntaId: string]: string; // P1: 'A', P2: 'B', etc.
}

// ============================================================================
// INTERFACE PARA PERFIL DE ESTUDIANTE
// ============================================================================

/**
 * Perfil completo de un estudiante
 */
export interface PerfilEstudiante {
  // Identificación
  estudiante_id: string;
  grado: Grado;
  fecha_creacion: string; // ISO string
  ultima_actualizacion: string; // ISO string

  // Características del perfil
  estilo_aprendizaje: EstiloAprendizaje;
  velocidad: Velocidad;
  atencion: Atencion;
  interes: AreaInteres;
  nivel_matematicas: NivelMatematicas;
  nivel_lectura: NivelLectura;
  motivacion: Motivacion;
  frustracion: ManejoFrustracion;
  trabajo: PreferenciaTrabajo;
  energia: HorarioEnergia;

  // Resultados calculados
  nivel_riesgo: NivelRiesgo;
  recomendaciones: string[];
  categoria_principal: string; // Ej: "El Científico Resiliente"
  confianza_perfil: number; // 0-100
}

// ============================================================================
// REQUESTS Y RESPONSES PARA API
// ============================================================================

/**
 * Request para clasificar un perfil
 */
export interface ClasificarPerfilRequest {
  respuestas: RespuestasFormulario;
  grado: Grado;
  estudiante_id: string;
}

/**
 * Response de clasificación de perfil
 */
export interface ClasificarPerfilResponse {
  success: boolean;
  perfil?: PerfilEstudiante;
  error?: string;
}

/**
 * Request para validar una respuesta
 */
export interface ValidarRespuestaRequest {
  pregunta: string; // 'P1', 'P2', etc.
  respuesta: string; // 'A', 'B', 'C', etc.
  grado: Grado;
}

/**
 * Response de validación de respuesta
 */
export interface ValidarRespuestaResponse {
  valida: boolean;
  mensaje?: string;
}

// ============================================================================
// TIPOS PARA UI/ESTADO
// ============================================================================

/**
 * Estado del formulario en progreso
 */
export interface EstadoFormulario {
  grado: Grado;
  pregunta_actual: number; // 1-10
  respuestas: RespuestasFormulario;
  completado: boolean;
}

/**
 * Estado de carga/error de la API
 */
export interface EstadoAPI {
  cargando: boolean;
  error: string | null;
  exito: boolean;
}

/**
 * Datos del estudiante (básicos)
 */
export interface DatosEstudiante {
  id: string;
  nombre?: string;
  apellido?: string;
  grado: Grado;
  seccion?: string;
  edad?: number;
}

// ============================================================================
// UTILIDADES DE TIPO
// ============================================================================

/**
 * Tipo parcial de PerfilEstudiante (para actualizaciones)
 */
export type PerfilEstudianteParcial = Partial<PerfilEstudiante>;

/**
 * Tipo para mapeo de categorías a valores
 */
export type MapeoCategoria = {
  [key: string]: string;
};

/**
 * Configuración de colores por nivel de riesgo
 */
export interface ConfiguracionRiesgo {
  bajo: {
    color: string;
    icono: string;
    mensaje: string;
  };
  medio: {
    color: string;
    icono: string;
    mensaje: string;
  };
  alto: {
    color: string;
    icono: string;
    mensaje: string;
  };
}

// ============================================================================
// CONSTANTES DE TIPO
// ============================================================================

/**
 * Mapeo de nombres legibles para estilos de aprendizaje
 */
export const NOMBRES_ESTILOS: Record<EstiloAprendizaje, string> = {
  visual: 'Visual',
  auditivo: 'Auditivo',
  kinestesico: 'Kinestésico',
  multimodal: 'Multimodal',
};

/**
 * Mapeo de nombres legibles para niveles de riesgo
 */
export const NOMBRES_RIESGO: Record<NivelRiesgo, string> = {
  bajo: 'Bajo Riesgo',
  medio: 'Riesgo Medio',
  alto: 'Alto Riesgo',
};

/**
 * Colores para niveles de riesgo (Tailwind CSS)
 */
export const COLORES_RIESGO: Record<NivelRiesgo, string> = {
  bajo: 'bg-green-500',
  medio: 'bg-yellow-500',
  alto: 'bg-red-500',
};

/**
 * Mapeo de áreas de interés a emojis
 */
export const EMOJIS_INTERES: Record<AreaInteres, string> = {
  artistico: '🎨',
  deportivo: '⚽',
  cientifico: '🔬',
  literario: '📚',
  social: '🤝',
  matematico: '🔢',
};
