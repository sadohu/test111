# Changelogs - Sistema Educativo Adaptativo

Registro histórico de cambios para control de versiones en producción.

## 📋 Formato de Registro

Cada changelog debe seguir este formato:

```markdown
## [Versión] - YYYY-MM-DD

### 🎯 Agregado (Added)
- Nuevas características
- Nuevas tablas
- Nuevas funcionalidades

### 🔄 Cambiado (Changed)
- Cambios en funcionalidades existentes
- Cambios en estructura de datos
- Actualizaciones de configuración

### 🐛 Corregido (Fixed)
- Bugs corregidos
- Problemas de rendimiento resueltos
- Correcciones de seguridad

### 🗑️ Eliminado (Deprecated/Removed)
- Funcionalidades deprecadas
- Campos eliminados
- APIs descontinuadas

### ⚠️ Notas de Migración
- Pasos necesarios para actualizar
- Scripts de migración requeridos
- Cambios que requieren acción manual
```

## 📅 Historial de Versiones

<!-- Los changelogs se agregarán aquí cuando se despliegue a producción -->

### Pendiente - Próximo Release

**Estado**: En desarrollo  
**Fecha estimada**: TBD

#### Cambios Planificados
- Implementación de sistema multi-colegio
- Tabla de colegios con datos institucionales
- Tabla de apoderados con relación N:M
- Grados individuales (1° a 6°)
- Sistema de códigos de alumno autogenerados
- IDs autoincrementables en todas las tablas

---

## 🔔 Instrucciones

**Para agregar un nuevo changelog:**
1. Copia el template de arriba
2. Actualiza la versión siguiendo [Semantic Versioning](https://semver.org/): MAJOR.MINOR.PATCH
3. Agrega la fecha del despliegue
4. Lista todos los cambios de forma clara y concisa
5. Incluye notas de migración si son necesarias
6. Actualiza este README con un resumen del cambio

**Versionado:**
- **MAJOR**: Cambios que rompen compatibilidad (breaking changes)
- **MINOR**: Nuevas funcionalidades compatibles con versión anterior
- **PATCH**: Correcciones de bugs sin cambios en funcionalidad

**Ejemplo de versiones:**
- `1.0.0` - Lanzamiento inicial
- `1.1.0` - Nueva funcionalidad (multi-colegio)
- `1.1.1` - Corrección de bug en generación de códigos
- `2.0.0` - Cambio de arquitectura (breaking change)

---

## 📝 Notas

- Mantener un changelog claro ayuda al equipo y usuarios finales a entender los cambios
- Cada despliegue a producción debe tener su entrada en el changelog
- Incluir siempre la fecha del cambio
- Referenciar issues o tickets relacionados cuando sea posible
- Los cambios en staging/development no necesitan changelog hasta que lleguen a producción

---

**Última actualización**: 2025-11-21  
**Versión actual en producción**: N/A (Sistema en desarrollo)
