# Documentación de Soporte - Storage

Esta carpeta contiene documentos de referencia, propuestas y archivos de soporte que complementan el análisis principal pero no son críticos para la implementación inmediata.

---

## 📄 Contenido

### **DIAGRAMA_BD.md**
Diagrama de entidad-relación (ERD) de la base de datos con representación visual ASCII.

**Incluye:**
- Diagramas de todas las tablas
- Relaciones y cardinalidades
- Índices y constraints
- Estimaciones de almacenamiento

**Estado:** Documentación de referencia (información ya incorporada en ANALISIS.md)

---

### **clasificador.py**
Implementación de referencia en Python del sistema de clasificación psicopedagógica.

**Incluye:**
- 10 preguntas diferenciadas por grado
- Algoritmo de mapeo a 10 dimensiones
- Sistema de puntuación de riesgo
- Generación de recomendaciones pedagógicas

**Estado:** Código de referencia (lógica ya documentada en LOGICA_Y_PROCESOS.md)

---

### **FACTIBILIDAD_ML_ADAPTATIVO_MVP.md**
Análisis técnico de viabilidad del sistema adaptativo sin Machine Learning complejo.

**Incluye:**
- Demostración de que NO requiere ML tradicional
- Sistema basado en métricas simples (promedios, porcentajes)
- Ejemplos de implementación
- Roadmap de desarrollo

**Estado:** Análisis completo (conclusiones ya incorporadas en ANALISIS.md)

---

### **PROPUESTA_POOL_EJERCICIOS.md**
Propuesta de optimización para implementar sistema de pool de ejercicios reutilizables.

**Incluye:**
- Análisis costo-beneficio
- Comparativa: generación directa vs pool
- Implementación técnica completa
- 7 riesgos identificados con mitigaciones
- Matriz de decisión
- Recomendación: v1.0 generación directa, v2.0+ migrar a pool

**Estado:** ⏳ Propuesta en evaluación para v2.0+

---

### **README_analisis_old.md**
Índice antiguo de la carpeta de análisis.

**Estado:** Archivo histórico

---

## 🎯 Uso de Esta Carpeta

Los documentos aquí NO son necesarios para:
- Implementación de v1.0 (MVP)
- Desarrollo de Edge Functions
- Creación de esquema SQL

**Se consultan solo cuando:**
- Se necesita profundizar en un tema específico
- Se evalúa implementar una propuesta (ej: pool de ejercicios)
- Se requiere código de referencia (clasificador.py)
- Se necesita visualización de diagramas

---

## 📌 Documentos Principales

Para análisis e implementación, usar:
- `docs/analisis/ANALISIS.md`
- `docs/analisis/LOGICA_Y_PROCESOS.md`

---

**Última actualización:** 22/11/2025
