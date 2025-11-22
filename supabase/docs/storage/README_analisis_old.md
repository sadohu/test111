# Análisis del Sistema

Esta carpeta contiene toda la documentación de análisis, diseño y arquitectura del Sistema Educativo Adaptativo.

## 📊 Documentos Disponibles

### 📄 [ANALISIS.md](./ANALISIS.md)
**Análisis completo del modelo de negocio**

Este documento contiene:
- Resumen ejecutivo del sistema
- Modelo de negocio multi-colegio
- Componentes principales (colegios, apoderados, estudiantes, perfiles)
- Sistema de perfilamiento psicopedagógico (10 dimensiones)
- Generación de ejercicios con IA
- Sistema de sesiones y respuestas
- Flujo de negocio completo
- Casos de uso por rol
- Ejemplos de datos
- **24 preguntas clave** para definir detalles del proyecto
- Recomendaciones técnicas y de implementación

**Audiencia:** Product Owners, Analistas, Desarrolladores nuevos

---

### 🗄️ [DIAGRAMA_BD.md](./DIAGRAMA_BD.md)
**Diagrama de base de datos y arquitectura técnica**

Este documento contiene:
- Diagrama de Entidad-Relación (ERD) completo en ASCII
- Descripción detallada de todas las tablas
- Relaciones y cardinalidades
- Índices críticos para performance
- Políticas RLS (Row Level Security)
- Constraints y validaciones
- Triggers automáticos
- Vistas materializadas sugeridas
- Estimación de almacenamiento por volumen

**Audiencia:** Desarrolladores, DBAs, Arquitectos

---

## 🎯 ¿Por Dónde Empezar?

### Si eres nuevo en el proyecto

1. **Lee primero**: [ANALISIS.md](./ANALISIS.md)
   - Secciones importantes:
     - Resumen Ejecutivo
     - Usuarios del Sistema
     - Componentes Principales
     - Flujo de Negocio

2. **Luego revisa**: [DIAGRAMA_BD.md](./DIAGRAMA_BD.md)
   - Secciones importantes:
     - Diagrama de Relaciones (ERD)
     - Esquema de tablas principales
     - Relaciones Principales

3. **Tiempo estimado**: 1-2 horas para comprensión completa

### Si ya conoces el sistema

- **Referencia rápida de tablas**: [DIAGRAMA_BD.md](./DIAGRAMA_BD.md)
- **Casos de uso**: [ANALISIS.md - Casos de Uso](./ANALISIS.md#casos-de-uso-principales)
- **Preguntas pendientes**: [ANALISIS.md - Preguntas](./ANALISIS.md#preguntas-para-definir-detalles)

---

## 🏗️ Arquitectura del Sistema

### Niveles

```
┌─────────────────────────────────────┐
│         FRONTEND (React/Next)       │
│  - Interfaces de usuario            │
│  - Componentes UI                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    EDGE FUNCTIONS (TypeScript/Deno) │
│  - Lógica de negocio                │
│  - Integración con Gemini AI        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    BASE DE DATOS (PostgreSQL)       │
│  - Colegios, Estudiantes, Perfiles  │
│  - Ejercicios, Respuestas, Sesiones │
└─────────────────────────────────────┘
```

### Módulos Principales

1. **Gestión de Colegios**
   - Registro institucional
   - Datos legales (RUC, UGEL)
   - Representantes

2. **Gestión de Estudiantes**
   - Importación masiva
   - Código de alumno autogenerado
   - Relación con apoderados

3. **Perfilamiento Psicopedagógico**
   - Formulario de 10 preguntas
   - Clasificación con Gemini AI
   - Recomendaciones pedagógicas

4. **Generación de Ejercicios**
   - Personalización por perfil
   - Integración con Gemini AI
   - Matemáticas y Verbal

5. **Sistema de Práctica**
   - Sesiones estructuradas
   - Registro de respuestas
   - Validación automática

6. **Analytics**
   - Estadísticas por estudiante
   - Reportes por colegio
   - Identificación de riesgo

---

## 📋 Información Clave del Modelo

### Código de Alumno

**Formato:** `AL{año}{colegio}{correlativo}`
- Ejemplo: `AL2502340001`
- 12 caracteres fijos
- Reinicia cada año

### Grados

- 1° a 6° de primaria (individual)
- Sin límites de edad (casos especiales)
- Tabla separada para flexibilidad

### IDs

- **Todos autoincrementables** (SERIAL/BIGSERIAL)
- No se usan UUIDs
- Mejor performance para alto volumen

### Perfiles

- 10 dimensiones de clasificación
- Categorías descriptivas
- Nivel de riesgo (bajo, medio, alto)
- Recomendaciones pedagógicas

---

## 🔄 Cambios Recientes

### 2025-11-21

- ✅ Eliminados límites de edad por grado
- ✅ Todos los IDs cambiados a autoincrementables
- ✅ Estructura de documentación reorganizada
- ✅ Análisis completo actualizado con modelo multi-colegio

### Pendientes

- [ ] Definir 10 preguntas del formulario psicopedagógico
- [ ] Especificar tipos de ejercicios por grado
- [ ] Definir roles y autenticación
- [ ] Plantilla de importación Excel
- [ ] Currículo por grado (alineación MINEDU)

---

## 📝 Preguntas Frecuentes

### ¿Por qué un sistema multi-colegio?

Permite gestionar múltiples instituciones desde una plataforma centralizada, facilitando:
- Administración unificada
- Comparativas entre colegios
- Economía de escala
- Actualizaciones centralizadas

### ¿Cómo funciona el código de alumno?

Se genera automáticamente al registrar estudiante:
1. Sistema obtiene año actual
2. Busca código de colegio
3. Calcula próximo correlativo del año
4. Genera: AL + año(2) + colegio(4) + correlativo(4)

### ¿Qué pasa con estudiantes trasladados?

- Mantienen su historial completo
- Se puede cambiar el colegio
- El código de alumno permanece igual
- Estado cambia a "trasladado"

### ¿Cómo se relacionan estudiantes y apoderados?

Relación **muchos a muchos** (N:M):
- Un estudiante puede tener múltiples apoderados
- Un apoderado puede tener múltiples estudiantes (hermanos)
- Se identifica un apoderado principal

---

## 🛠️ Próximos Pasos

Para implementar el sistema:

1. **Revisar análisis** completo y responder preguntas pendientes
2. **Crear migración** con schema actualizado
3. **Actualizar seed** con datos de ejemplo
4. **Implementar Edge Functions** actualizadas
5. **Desarrollar frontend** según roles definidos

Ver más detalles en [ANALISIS.md - Próximos Pasos](./ANALISIS.md#próximos-pasos-sugeridos)

---

**Última actualización:** 2025-11-21  
**Versión del análisis:** 2.0.0
