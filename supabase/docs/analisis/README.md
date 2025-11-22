# Documentación de Análisis - Sistema Educativo Adaptativo

## 📋 Documentos Principales

### 1. **ANALISIS.md**
Análisis completo del sistema educativo adaptativo multi-colegio.

**Contenido:**
- Resumen ejecutivo
- Objetivo del sistema
- Usuarios y roles
- Componentes principales (gestión de colegios, apoderados, estudiantes, perfilamiento)
- Sistema de clasificación (10 dimensiones psicopedagógicas)
- Generación de ejercicios con IA
- Esquema de base de datos
- ✅ 24 preguntas clave respondidas con definiciones del proyecto
- Sistema adaptativo sin ML complejo (análisis de métricas)
- Flujo de negocio completo

**Uso:** Documento de referencia principal para entender el negocio completo.

---

### 2. **LOGICA_Y_PROCESOS.md**
Lógica de negocio, procesos y relaciones del sistema.

**Contenido:**
- Modelo de datos y relaciones (diagramas)
- 6 procesos de negocio principales con diagramas Mermaid
- Lógica de clasificación de perfiles (código Python/JavaScript)
- Sistema de generación de credenciales (prefijo + código colegio + nombre)
- Lógica de generación de ejercicios con Gemini AI
- Sistema adaptativo (análisis de métricas, refinamiento de perfiles)
- Flujos de autenticación por rol
- Reglas de negocio críticas
- Estados y transiciones
- Validaciones y constraints
- Casos de uso detallados

**Uso:** Guía técnica para implementación de la lógica del sistema.

---

## 📁 Archivos de Soporte

Los siguientes archivos se han movido a `docs/storage/` para mantener el análisis limpio:

- **DIAGRAMA_BD.md** - Diagrama ERD de la base de datos
- **clasificador.py** - Implementación de referencia en Python
- **FACTIBILIDAD_ML_ADAPTATIVO_MVP.md** - Análisis de factibilidad del sistema adaptativo
- **PROPUESTA_POOL_EJERCICIOS.md** - Propuesta de optimización para v2.0+

---

## 🚀 Próximos Pasos

1. Revisar `ANALISIS.md` para entender el negocio completo
2. Estudiar `LOGICA_Y_PROCESOS.md` para implementación técnica
3. Comenzar con implementación de Edge Functions basándose en estos documentos
4. Actualizar schema SQL según especificaciones del análisis

---

**Última actualización:** 22/11/2025  
**Versión:** 1.0  
**Estado:** Listo para implementación v1.0 (MVP)
