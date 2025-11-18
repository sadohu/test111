// =====================================================
// SERVICIOS - EXPORTS
// =====================================================
// Exportaciones centralizadas de todos los servicios
// =====================================================

export { AuthService } from './auth.service';
export { PerfilService } from './perfil.service';
export { EjerciciosService } from './ejercicios.service';
export { EstadisticasService } from './estadisticas.service';

// Re-exportar servicios como default también
export { default as Auth } from './auth.service';
export { default as Perfil } from './perfil.service';
export { default as Ejercicios } from './ejercicios.service';
export { default as Estadisticas } from './estadisticas.service';
