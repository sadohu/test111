/**
 * Exportaciones centralizadas de todos los servicios
 */

// Configuración
export * from './api.config';
export * from './api.client';

// Servicios
export * from './perfil.service';
export * from './formulario.service';

// Re-exportar servicios para conveniencia
export { perfilService } from './perfil.service';
export { formularioService } from './formulario.service';
export { apiClient } from './api.client';
