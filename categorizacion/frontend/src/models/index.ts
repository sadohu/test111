/**
 * Exportaciones centralizadas de todos los modelos y tipos
 */

// Exportar todos los tipos del módulo de perfiles
export * from './perfil.types';

// Re-exportar tipos específicos para conveniencia
export type {
  Grado,
  EstiloAprendizaje,
  Velocidad,
  Atencion,
  AreaInteres,
  NivelMatematicas,
  NivelLectura,
  Motivacion,
  ManejoFrustracion,
  PreferenciaTrabajo,
  HorarioEnergia,
  NivelRiesgo,
  PerfilEstudiante,
  RespuestasFormulario,
  ClasificarPerfilRequest,
  ClasificarPerfilResponse,
  EstadoFormulario,
  EstadoAPI,
  DatosEstudiante,
} from './perfil.types';
