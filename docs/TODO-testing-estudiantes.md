# TODO: Testing con Estudiantes Reales

**Fecha creación**: 17 de Noviembre, 2025
**Estado**: ⏳ PENDIENTE
**Prioridad**: ALTA

---

## Objetivo

Validar la calidad y efectividad de los ejercicios generados por el sistema con estudiantes reales de primaria en diferentes niveles.

---

## Alcance del Testing

### 1. Validación de Calidad de Ejercicios

**Criterios a evaluar:**
- ✅ Enunciados claros y comprensibles
- ✅ Opciones plausibles (no obviamente incorrectas)
- ✅ Explicaciones pedagógicamente correctas
- ✅ Nivel de dificultad apropiado al grado
- ✅ Contexto cultural relevante (peruano)

### 2. Efectividad de Personalización

**Aspectos a verificar:**
- ✅ Ejercicios se adaptan al estilo de aprendizaje
- ✅ Contextos coinciden con intereses del estudiante
- ✅ Longitud apropiada según velocidad de lectura
- ✅ Dificultad alineada con nivel del estudiante

### 3. Engagement y Motivación

**Métricas a medir:**
- ✅ Tasa de completación de ejercicios
- ✅ Tiempo promedio de respuesta
- ✅ Nivel de interés/diversión reportado
- ✅ Solicitud de más ejercicios

---

## Plan de Testing

### Fase 1: Testing Piloto (Semana 1-2)

**Participantes:**
- 3-5 estudiantes por nivel (básico, intermedio, avanzado)
- Total: 9-15 estudiantes
- Supervisión de profesores

**Proceso:**
1. Completar formulario de clasificación de perfil
2. Generar 10 ejercicios (5 matemáticas + 5 verbal)
3. Resolver ejercicios con supervisión
4. Recoger feedback inmediato

**Datos a recoger:**
```json
{
  "estudiante_id": "EST001",
  "fecha": "2025-11-20",
  "ejercicios_completados": 8,
  "ejercicios_totales": 10,
  "tiempo_promedio_por_ejercicio": 120,
  "tasa_aciertos": 0.75,
  "feedback_estudiante": {
    "claridad_enunciados": 4.5,
    "dificultad_apropiada": 4.0,
    "interes": 4.8,
    "diversion": 4.2
  },
  "feedback_profesor": {
    "calidad_pedagogica": 4.0,
    "alineacion_curriculo": 4.5,
    "comentarios": "Los ejercicios son apropiados..."
  }
}
```

### Fase 2: Testing Ampliado (Semana 3-4)

**Participantes:**
- 10-15 estudiantes por nivel
- Total: 30-45 estudiantes
- Múltiples escuelas

**Proceso:**
1. Testing sin supervisión constante
2. 5 sesiones de ejercicios durante 2 semanas
3. Tracking automático de respuestas
4. Encuestas post-sesión

### Fase 3: Ajustes y Re-testing (Semana 5-6)

**Proceso:**
1. Analizar datos de Fase 1 y 2
2. Ajustar prompts según problemas encontrados
3. Re-generar ejercicios con prompts mejorados
4. Validar mejoras con 5-10 estudiantes

---

## Métricas de Éxito

### Cuantitativas

| Métrica | Objetivo | Crítico |
|---------|----------|---------|
| Tasa completación | > 80% | > 60% |
| Tasa aciertos | 60-70% | 40-80% |
| Tiempo promedio | 60-120s | 30-180s |
| Claridad (1-5) | > 4.0 | > 3.0 |
| Interés (1-5) | > 4.0 | > 3.5 |

### Cualitativas

**Feedback de estudiantes:**
- "Los ejercicios son divertidos e interesantes"
- "Puedo entender los enunciados fácilmente"
- "La dificultad es apropiada para mí"
- "Me gustan los contextos usados"

**Feedback de profesores:**
- "Los ejercicios están bien diseñados pedagógicamente"
- "La dificultad es apropiada al grado"
- "Los ejercicios cubren el currículo adecuadamente"
- "La personalización es efectiva"

---

## Problemas Potenciales y Mitigaciones

### 1. Enunciados Ambiguos o Confusos

**Señal:**
- Estudiantes preguntan qué significa el enunciado
- Tiempo excesivo sin responder
- Comentarios de confusión

**Mitigación:**
- Revisar y simplificar prompts
- Agregar ejemplos más claros en templates
- Instrucciones más específicas a Gemini

### 2. Opciones No Plausibles

**Señal:**
- Tasa de aciertos > 90% (muy fácil)
- Estudiantes comentan que respuestas son obvias

**Mitigación:**
- Mejorar instrucciones para distractores
- Incluir ejemplos de distractores basados en errores comunes
- Revisar validación de opciones

### 3. Dificultad No Apropiada

**Señal:**
- Tasa de aciertos < 40% o > 80%
- Frustración o aburrimiento

**Mitigación:**
- Ajustar criterios de determinación de nivel
- Revisar umbrales en prompt_builder.py
- Agregar nivel "muy fácil" y "muy difícil"

### 4. Falta de Engagement

**Señal:**
- Tasa de completación < 60%
- Estudiantes se distraen
- Feedback de "aburrido"

**Mitigación:**
- Hacer contextos más interesantes
- Agregar elementos narrativos
- Incluir humor apropiado
- Gamificar con puntos/badges

### 5. Personalización No Efectiva

**Señal:**
- No hay diferencia entre ejercicios de diferentes estilos
- Estudiantes no notan personalización

**Mitigación:**
- Hacer personalización más evidente
- Agregar más variables de personalización
- Instrucciones más fuertes en prompts

---

## Ajustes Esperados por Nivel

### Nivel Básico (Grados 1-2)

**Posibles ajustes:**
- ✅ Simplificar vocabulario aún más
- ✅ Acortar enunciados (máx 2 oraciones)
- ✅ Usar números más pequeños (0-50)
- ✅ Más elementos visuales/descriptivos
- ✅ Contextos ultra familiares

### Nivel Intermedio (Grados 3-4)

**Posibles ajustes:**
- ✅ Balance entre simplicidad y complejidad
- ✅ Introducir vocabulario técnico gradualmente
- ✅ Problemas de 2 pasos bien explicados
- ✅ Contextos variados pero conocidos

### Nivel Avanzado (Grados 5-6)

**Posibles ajustes:**
- ✅ Desafíos más complejos
- ✅ Múltiples pasos claramente estructurados
- ✅ Vocabulario académico apropiado
- ✅ Contextos más diversos e interesantes

---

## Herramientas Necesarias para Testing

### 1. Sistema de Tracking de Respuestas

**TODO - Implementar:**
```python
POST /api/ejercicios/{ejercicio_id}/responder
{
  "estudiante_id": "EST001",
  "respuesta_estudiante": "A",
  "tiempo_respuesta_segundos": 45,
  "timestamp": "2025-11-20T10:30:00"
}
```

### 2. Dashboard de Análisis

**TODO - Crear:**
- Visualización de métricas por estudiante
- Análisis de patrones de error
- Comparación entre niveles
- Heatmaps de tipos de ejercicios

### 3. Sistema de Feedback

**TODO - Implementar:**
```python
POST /api/ejercicios/{ejercicio_id}/feedback
{
  "estudiante_id": "EST001",
  "claridad": 4,
  "dificultad": 3,
  "interes": 5,
  "comentarios": "Me gustó mucho"
}
```

### 4. Export de Datos

**TODO - Crear:**
- Export a CSV de todas las respuestas
- Export a PDF de reportes por estudiante
- Estadísticas agregadas

---

## Cronograma Propuesto

```
Semana 1-2: Testing Piloto
├─ Día 1-2: Reclutamiento y perfilado
├─ Día 3-7: Sesiones de ejercicios
├─ Día 8-10: Análisis de resultados
└─ Día 11-14: Ajustes a prompts

Semana 3-4: Testing Ampliado
├─ Día 1-3: Reclutamiento ampliado
├─ Día 4-14: Múltiples sesiones
└─ Día 15-18: Análisis profundo

Semana 5-6: Ajustes y Validación
├─ Día 1-7: Implementar mejoras
├─ Día 8-14: Re-testing validación
└─ Día 15-16: Documentar conclusiones
```

---

## Entregables del Testing

### Documentación

1. **Reporte de Testing Piloto**
   - Resumen de participantes
   - Métricas cuantitativas
   - Feedback cualitativo
   - Problemas encontrados

2. **Reporte de Testing Ampliado**
   - Análisis estadístico completo
   - Comparación entre niveles
   - Patrones identificados
   - Recomendaciones

3. **Documento de Ajustes Realizados**
   - Cambios en prompts (diff)
   - Justificación de cada cambio
   - Resultados antes/después
   - Conclusiones

4. **Guía de Mejores Prácticas**
   - Qué funciona bien
   - Qué evitar
   - Recomendaciones para futuros prompts
   - Ejemplos de ejercicios excelentes

### Datos

1. **Dataset de Respuestas**
   - CSV con todas las respuestas
   - Metadatos de estudiantes
   - Tiempos de respuesta
   - Feedback ratings

2. **Ejercicios Generados Evaluados**
   - JSON con ejercicios usados
   - Ratings de calidad
   - Comentarios de profesores
   - Clasificación de buenos/malos

---

## Notas Importantes

⚠️ **Consideraciones Éticas:**
- Obtener consentimiento de padres
- Anonimizar datos de estudiantes
- No guardar información personal sensible
- Uso de datos solo para mejora del sistema

⚠️ **Validación Pedagógica:**
- Revisión de profesores antes de testing
- Alineación con currículo nacional
- Validación de contenido matemático/verbal
- Verificación de edad-apropiado

⚠️ **Tecnología:**
- Testing debe funcionar sin internet perfecto
- Backup de respuestas localmente
- UI simple y accesible
- Compatible con dispositivos escolares

---

## Estado Actual

**Implementación del sistema:** ✅ COMPLETADO
**Herramientas de tracking:** ⏳ PENDIENTE
**Reclutamiento de estudiantes:** ⏳ PENDIENTE
**Testing piloto:** ⏳ PENDIENTE
**Análisis de resultados:** ⏳ PENDIENTE
**Ajustes y mejoras:** ⏳ PENDIENTE

---

## Responsables Sugeridos

- **Coordinación general**: [Nombre]
- **Reclutamiento**: [Nombre] - Contacto con escuelas
- **Supervisión de sesiones**: Profesores participantes
- **Análisis de datos**: [Nombre] - Data scientist
- **Ajustes técnicos**: Desarrollador (Claude/equipo)
- **Validación pedagógica**: Especialistas en educación

---

## Presupuesto Estimado

**Testing Piloto (9-15 estudiantes):**
- Incentivos para estudiantes: $150-250
- Tiempo de profesores: $200-300
- Materiales: $50-100
- **Total:** $400-650

**Testing Ampliado (30-45 estudiantes):**
- Incentivos para estudiantes: $450-750
- Tiempo de profesores: $600-900
- Coordinación escuelas: $200-300
- Materiales: $150-200
- **Total:** $1,400-2,150

**Gran Total:** $1,800-2,800

---

## Próximos Pasos Inmediatos

1. ✅ **Crear este documento TODO** ← ACTUAL
2. ⏳ Implementar sistema de tracking de respuestas
3. ⏳ Crear dashboard de análisis básico
4. ⏳ Contactar escuelas para reclutamiento
5. ⏳ Preparar materiales de consentimiento
6. ⏳ Entrenar a profesores supervisores
7. ⏳ Ejecutar testing piloto

---

**Última actualización**: 17 de Noviembre, 2025
**Próxima revisión**: Cuando se implemente tracking de respuestas
