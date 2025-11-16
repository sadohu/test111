# CAPÍTULO 2 - DESCRIPCIÓN DEL PROYECTO

## 2.1 Objetivos

Los objetivos están constituidos por la situación o el estado deseado que se pretende alcanzar con la realización del proyecto. Cada objetivo presenta un indicador (métrica relevante) y el periodo de tiempo en el cual se llevará a cabo.

### Objetivo 1: Mejora del Rendimiento Académico en Matemáticas

**Enunciado:** Incrementar en 25% el porcentaje de estudiantes que alcanzan nivel satisfactorio en matemáticas al cabo de 9 meses de uso continuo de la plataforma.

**Indicador:**
```
%Mejora = ((EstudiantesSatisfactoriosDespués - EstudiantesSatisfactoriosAntes) / EstudiantesSatisfactoriosAntes) × 100
```

**Donde:**
- **EstudiantesSatisfactoriosDespués**: Porcentaje de estudiantes con nivel satisfactorio en evaluaciones estandarizadas post-implementación
- **EstudiantesSatisfactoriosAntes**: Línea base (22.5% según diagnóstico nacional de ECE)

**Justificación:** Los sistemas de tutoría inteligente han demostrado mejoras significativas en competencias matemáticas, con ganancias de aprendizaje equivalentes a 0.4 desviaciones estándar en promedio según estudios internacionales. Plataformas como DreamBox Learning reportan incrementos del 30-35% en competencias matemáticas después de un año académico.

---

### Objetivo 2: Mejora del Rendimiento Académico en Comprensión Lectora

**Enunciado:** Incrementar en 20% el porcentaje de estudiantes que alcanzan nivel satisfactorio en comprensión lectora al cabo de 9 meses de uso continuo de la plataforma.

**Indicador:**
```
%Mejora = ((EstudiantesSatisfactoriosDespués - EstudiantesSatisfactoriosAntes) / EstudiantesSatisfactoriosAntes) × 100
```

**Donde:**
- **EstudiantesSatisfactoriosDespués**: Porcentaje de estudiantes con nivel satisfactorio en evaluaciones de comprensión lectora post-implementación
- **EstudiantesSatisfactoriosAntes**: Línea base (33% según diagnóstico nacional de ECE)

---

### Objetivo 3: Reducción del Tiempo de Retroalimentación Docente

**Enunciado:** Reducir en 50% el tiempo que los docentes dedican a la evaluación y retroalimentación individual de estudiantes al cabo de 3 meses de implementación de la plataforma.

**Indicador:**
```
%Reducción = (1 - (TiempoConPlataforma / TiempoSinPlataforma)) × 100
```

**Donde:**
- **TiempoConPlataforma**: Horas semanales dedicadas a evaluación y retroalimentación con uso del sistema automatizado
- **TiempoSinPlataforma**: Horas semanales promedio dedicadas a estas tareas antes de la implementación

---

### Objetivo 4: Aumento de la Motivación y Engagement Estudiantil

**Enunciado:** Incrementar en 35% el índice de engagement estudiantil (medido por tiempo de uso activo, tasa de completitud de actividades y auto-reporte) al cabo de 6 meses de uso de la plataforma.

**Indicador:**
```
Índice de Engagement = (0.4 × TasaCompletitud) + (0.3 × TiempoActivoPromedio) + (0.3 × SatisfacciónAutoreportada)
```

**Donde:**
- **TasaCompletitud**: Porcentaje de actividades asignadas completadas voluntariamente
- **TiempoActivoPromedio**: Minutos diarios de interacción activa con la plataforma
- **SatisfacciónAutoreportada**: Escala Likert 1-5 sobre disfrute y percepción de utilidad

---

### Objetivo 5: Personalización Adaptativa del Aprendizaje

**Enunciado:** Lograr que el 80% de los estudiantes reciban rutas de aprendizaje personalizadas según su perfil (estilo de aprendizaje, ritmo, intereses) validadas por algoritmos de IA al cabo de 4 meses de operación de la plataforma.

**Indicador:**
```
%Personalización = (EstudiantesConRutasPersonalizadas / TotalEstudiantesActivos) × 100
```

**Donde:**
- **EstudiantesConRutasPersonalizadas**: Número de estudiantes con perfiles completos y rutas adaptadas generadas por IA
- **TotalEstudiantesActivos**: Total de estudiantes registrados y activos en la plataforma

---

### Objetivo 6: Reducción de Brechas de Aprendizaje

**Enunciado:** Reducir en 30% la brecha de rendimiento entre estudiantes de diferentes niveles socioeconómicos participantes al cabo de 12 meses de uso sistemático de la plataforma.

**Indicador:**
```
%ReducciónBrecha = (1 - (DiferenciaRendimientoDespués / DiferenciaRendimientoAntes)) × 100
```

**Donde:**
- **DiferenciaRendimientoAntes**: Diferencia en puntos porcentuales de rendimiento entre quintiles socioeconómicos al inicio
- **DiferenciaRendimientoDespués**: Diferencia en puntos porcentuales después de 12 meses

---

## 2.2 Alcance

El presente proyecto comprenderá las fases de **análisis, diseño, desarrollo, implementación piloto y evaluación** de una plataforma educativa web basada en inteligencia artificial.

### Entregables del Proyecto

**2.2.1** Acta de Constitución del Proyecto  
**2.2.2** Objetivos y Alcance del Proyecto  
**2.2.3** Estructura de Desglose del Trabajo (EDT)  
**2.2.4** Cronograma de Trabajo (Diagrama de Gantt)  
**2.2.5** Presupuesto y Costos  
**2.2.6** Análisis de Riesgos  
**2.2.7** Diagrama de Actores del Sistema  
**2.2.8** Diagrama General de Casos de Uso  
**2.2.9** Especificación de Casos de Uso (mínimo 10)  
**2.2.10** Diagramas de Clases de Análisis  
**2.2.11** Diagramas de Comunicación  
**2.2.12** Arquitectura de Software  
**2.2.13** Modelo de Base de Datos (Lógico y Físico)  
**2.2.14** Plan de Pruebas (Unitarias e Integrales)  
**2.2.15** Desarrollo de Módulos Funcionales  
**2.2.16** Manual de Usuario  
**2.2.17** Manual Técnico  
**2.2.18** Informe de Evaluación de Impacto  

### Alcance Geográfico y Poblacional

- **Ubicación**: Lima Metropolitana, Perú
- **Población objetivo**: Estudiantes de 3° a 6° grado de primaria (8-12 años)
- **Muestra piloto**: 500-800 estudiantes en 3-5 instituciones educativas (mix público-privado)
- **Áreas académicas**: Matemática y Comunicación (lectura)

### Módulos Funcionales a Desarrollar

**A. Módulo de Inteligencia Artificial Adaptativa**
- Algoritmos de machine learning para identificación de estilos de aprendizaje
- Sistema de recomendación de contenidos personalizado
- Motor de adaptación de dificultad en tiempo real

**B. Módulo de Gestión de Contenidos Educativos**
- Repositorio de recursos multimediales alineados al Currículo Nacional
- Sistema de etiquetado de recursos
- Creador de actividades interactivas

**C. Módulo de Evaluación y Retroalimentación**
- Evaluaciones diagnósticas adaptativas
- Evaluaciones formativas con feedback automático
- Generación de reportes de progreso

**D. Módulo de Seguimiento Docente**
- Dashboard de visualización de progreso
- Alertas tempranas de estudiantes en riesgo
- Herramientas de comunicación con padres

**E. Módulo de Gamificación**
- Sistema de puntos, insignias y logros
- Avatares personalizables
- Desafíos y competencias

**F. Módulo de Seguridad**
- Cumplimiento con Ley 29733 de Protección de Datos
- Autenticación segura
- Encriptación de datos sensibles

### Limitaciones del Proyecto

El proyecto **NO incluye**:
- Desarrollo de hardware propietario
- Provisión de conectividad a internet
- Todas las áreas curriculares (solo matemática y comunicación)
- Reemplazo de docentes (la plataforma es complementaria)

### Supuestos del Proyecto

- Las instituciones participantes cuentan con conectividad básica a internet
- Existe disposición institucional para capacitación docente
- Los estudiantes tienen acceso a dispositivos (computadoras, tablets o smartphones)
- Los padres/tutores autorizan la participación y uso de datos educativos

---

## 2.3 Ventaja Comparativa

Mediante la técnica de **Benchmarking** se identificaron los aspectos que hacen que el proyecto sea considerado como una solución viable comparado con otras plataformas educativas existentes.

### Tabla Comparativa de Funcionalidades

| Funcionalidad/Característica | Khan Academy | Duolingo | Smartick | Aprendo en Casa | **Proyecto** |
|------------------------------|--------------|----------|----------|-----------------|--------------|
| Adaptación al ritmo individual | ✓ | ✓ | ✓ | ✗ | ✓ |
| Personalización según intereses | ✗ | Limitado | ✗ | ✗ | ✓ |
| IA para estilos de aprendizaje | ✗ | ✗ | ✗ | ✗ | ✓ |
| Contenido Currículo Nacional Perú | ✗ | ✗ | ✗ | ✓ | ✓ |
| Multiárea (Matemática + Comunicación) | ✓ | ✗ | ✗ | ✓ | ✓ |
| Dashboard docente avanzado | Básico | ✗ | ✓ | Básico | ✓ |
| Gamificación profunda | Básico | ✓ | ✗ | ✗ | ✓ |
| Funcionamiento offline | ✗ | ✗ | ✗ | Limitado | ✓ |
| Costo accesible sector público | Gratuito | Gratuito | Alto | Gratuito | Freemium |
| Alertas deserción temprana | ✗ | ✗ | ✗ | ✗ | ✓ |
| Integración con sistemas locales | ✗ | ✗ | ✗ | ✓ | ✓ |

### Ventajas Diferenciadoras Clave

1. **Contextualización para el Perú**: Alineación total con Currículo Nacional de Educación Básica Regular
2. **Personalización multidimensional**: Adapta estilo, ritmo, intereses y nivel de dificultad simultáneamente
3. **Foco en prevención de deserción**: Algoritmos de alerta temprana de riesgo académico
4. **Modelo sostenible**: Freemium (gratuito para escuelas públicas, premium para privadas)
5. **Diseño para baja conectividad**: Funcionalidad offline parcial y optimización de datos

---

## 2.4 Ubicación e Institución Responsable del Proyecto

### Ubicación Física

**Sede de Desarrollo:**  
Instituto Superior Tecnológico Privado CIBERTEC  
San Isidro, Lima Metropolitana, Perú

**Instituciones Educativas Piloto (Propuestas):**
1. Colegio Nacional de Aplicación (público) - San Borja
2. I.E. N° 1024 República Federal de Alemania (público) - La Victoria
3. Colegio Salesiano Santa Rosa (privado) - Lima Cercado
4. I.E. Parroquial Santa Rosa de Lima (parroquial) - Pueblo Libre
5. I.E. N° 6090 Luis Fabio Xammar Jurado (público) - Villa María del Triunfo

### Infraestructura Tecnológica

**Modelo de despliegue:** Nube híbrida

- **Cloud (Primario)**: Amazon Web Services (AWS) - Región São Paulo
  - EC2 (servidores de aplicación)
  - RDS (base de datos)
  - S3 (almacenamiento multimedia)
  - CloudFront (CDN)
  - Lambda (procesamiento IA)

- **On-Premise (Secundario)**: Servidor local en CIBERTEC para desarrollo/testing

### Institución Organizadora

**Razón Social:** Instituto Superior Tecnológico Privado CIBERTEC  
**RUC:** 20100054184  
**Dirección:** Av. Rivera Navarrete 219, San Isidro, Lima

### Aliados Estratégicos (Propuestos)

- **Ministerio de Educación (Minedu)**: Validación pedagógica y escalamiento
- **CONCYTEC**: Financiamiento para innovación tecnológica
- **UNICEF Perú**: Expertise en educación inclusiva
- **BID Lab**: Financiamiento para escalamiento regional

---

## 2.5 Organización del Proyecto

### Roles y Responsabilidades del Equipo

| Rol | Cantidad | Perfil del Puesto | Dedicación |
|-----|----------|-------------------|------------|
| **Jefe de Proyecto** | 1 | - MBA o Maestría en Gestión de Proyectos<br>- Certificación PMP o PRINCE2<br>- Experiencia 8+ años en proyectos EdTech | 100% |
| **Líder Técnico** | 1 | - Ingeniero de Sistemas<br>- Experiencia 6+ años<br>- Especialización en IA/ML y arquitecturas cloud | 100% |
| **Especialista IA** | 1 | - Maestría en IA/Data Science<br>- Experiencia 4+ años en ML educativo | 100% |
| **Desarrollador Full-Stack Senior** | 2 | - Experiencia 5+ años<br>- React, Node.js, Python<br>- Conocimiento en APIs REST | 100% |
| **Diseñador UX/UI** | 1 | - Especialización en diseño educativo<br>- Experiencia 4+ años | 75% |
| **Pedagogo / Especialista Currículo** | 2 | - Licenciado en Educación Primaria<br>- Maestría en Pedagogía<br>- Experiencia 6+ años | 100% |
| **Creador de Contenidos** | 2 | - Docente con experiencia en materiales digitales<br>- Conocimiento de herramientas multimedia | 100% |
| **Analista de Datos** | 1 | - Estadístico o Data Analyst<br>- Experiencia 3+ años en datos educativos | 100% |
| **Especialista QA** | 1 | - Certificación ISTQB<br>- Experiencia 4+ años en testing web | 100% |
| **Analista Financiero** | 1 | - Contador o Economista<br>- Experiencia 5+ años en evaluación de proyectos | 50% |

### Metodología de Trabajo

**Metodología Ágil - Scrum**
- Sprints de 2 semanas
- Daily Stand-ups (15 min)
- Sprint Planning, Review y Retrospective
- Herramientas: Jira, Slack, GitHub, Figma

---

## 2.6 Beneficiarios Directos e Indirectos

### Beneficiarios Directos

Son aquellos que hacen uso directo de la plataforma:

**1. Estudiantes de Primaria (3° a 6° grado)**
- Cantidad fase piloto: 500-800 estudiantes
- Beneficios: Aprendizaje personalizado, retroalimentación inmediata, mayor motivación, desarrollo de autonomía

**2. Docentes de Primaria**
- Cantidad fase piloto: 15-25 docentes
- Beneficios: Reducción 40-50% tiempo en evaluación, dashboards informativos, alertas tempranas, recomendaciones pedagógicas

**3. Directivos y Coordinadores Académicos**
- Cantidad fase piloto: 5-8 directivos
- Beneficios: Visibilidad del rendimiento institucional, datos para decisiones, mejora en indicadores de calidad

### Beneficiarios Indirectos

Son personas impactadas positivamente sin interactuar directamente con la plataforma:

**1. Padres de Familia**: Visibilidad del progreso académico, comunicación con docentes, reducción de costos en reforzamiento privado

**2. Ministerio de Educación**: Modelo replicable de innovación, datos empíricos sobre efectividad, contribución a objetivos nacionales

**3. Sociedad Peruana**: Reducción de deserción escolar, formación de capital humano competente, reducción de desigualdad educativa

### Cuantificación de Beneficiarios

| Beneficiario | Fase Piloto | Escalamiento (3-5 años) |
|--------------|-------------|-------------------------|
| Estudiantes | 500-800 | 15,000-25,000 |
| Docentes | 15-25 | 500-800 |
| Directivos | 5-8 | 100-150 |
| Padres/Familias | 500-800 | 15,000-25,000 |

---

## 2.7 Metas, Resultados y Efectos Esperados del Proyecto

### Matriz de Trazabilidad: Objetivos - Metas

| META | DESCRIPCIÓN | PLAZO | OBJETIVOS RELACIONADOS |
|------|-------------|-------|------------------------|
| **Meta 1** | Plataforma desarrollada con todos los módulos funcionales y certificación de seguridad | Mes 8 | Obj. 5 |
| **Meta 2** | Base de 500+ recursos educativos digitales alineados al Currículo Nacional | Mes 7 | Obj. 1, 2 |
| **Meta 3** | Algoritmos de IA entrenados con precisión >80% | Mes 6 | Obj. 5 |
| **Meta 4** | 5 instituciones piloto reclutadas con convenios firmados | Mes 3 | Todos |
| **Meta 5** | 25 docentes capacitados con certificación | Mes 9 | Obj. 3 |
| **Meta 6** | 600 estudiantes activos usando la plataforma | Mes 10 | Obj. 4 |
| **Meta 7** | Sistema de analíticas operativo con dashboards funcionales | Mes 8 | Obj. 3 |
| **Meta 8** | Evaluación de impacto a 3 meses completada | Mes 12 | Obj. 1, 2 |
| **Meta 9** | Reducción de 15% en tiempo de evaluación docente verificada | Mes 11 | Obj. 3 |
| **Meta 10** | Incremento de 25% en engagement estudiantil | Mes 15 | Obj. 4 |
| **Meta 11** | Evaluación final con mejoras medibles en rendimiento | Mes 18 | Obj. 1, 2, 6 |
| **Meta 12** | Modelo de sostenibilidad validado con 2 instituciones privadas | Mes 18 | Sostenibilidad |

### Resultados Esperados

Con el cumplimiento de las metas y objetivos, se esperan los siguientes resultados:

**R1. Mejora en Competencias Académicas**
- Incremento de 20-25% en matemática
- Incremento de 15-20% en comprensión lectora
- Reducción de 20-30% en brechas entre niveles socioeconómicos

**R2. Optimización de Procesos Educativos**
- Reducción de 45-50% en tiempo docente administrativo
- Incremento de 30-35% en engagement estudiantil
- 80% de estudiantes con rutas personalizadas

**R3. Fortalecimiento Institucional**
- 25 docentes certificados en uso de IA educativa
- Modelo replicable documentado
- Evidencia empírica sobre efectividad en contexto peruano

### Efectos Esperados

Los efectos son impactos de mediano y largo plazo:

**Corto Plazo (1-2 años)**
- Reducción de 25-30% en deserción escolar de participantes
- Mejora en indicadores ECE de instituciones piloto
- Adopción voluntaria por 10-15 instituciones adicionales

**Mediano Plazo (3-5 años)**
- Escalamiento a 100-150 instituciones en Lima
- Influencia en políticas públicas educativas sobre IA
- Generación de ecosistema EdTech en Perú

**Largo Plazo (6-10 años)**
- Reducción de 15-20% en desigualdad educativa Lima
- Mejora de 10-15 puntos en PISA nacional
- Retorno económico social de $3-5 por cada $1 invertido

---

## REFERENCIAS BIBLIOGRÁFICAS

**Fuentes Nacionales:**
- Ministerio de Educación del Perú. (2024). Estadística de la Calidad Educativa (ESCALE). http://escale.minedu.gob.pe/
- INEI. (2024). Perú: Indicadores de educación por departamentos. https://www.inei.gob.pe/
- Congreso de la República. (2011). Ley N° 29733: Ley de Protección de Datos Personales.

**Fuentes Internacionales:**
- UNESCO. (2024). Education and artificial intelligence 2024.
- OECD. (2023). PISA 2022 results. https://doi.org/10.1787/53f23881-en
- Kulik, J. A., & Fletcher, J. D. (2016). Effectiveness of intelligent tutoring systems. Review of Educational Research, 86(1), 42-78.
- Bloom, B. S. (1984). The 2 sigma problem. Educational Researcher, 13(6), 4-16.
- Pane, J. F., et al. (2017). Informing progress: Insights on personalized learning. RAND Corporation.

**Fuentes Tecnológicas:**
- DreamBox Learning. (2022). Efficacy research and results. https://www.dreambox.com/research-efficacy
- Amazon Web Services. (2024). AWS compliance programs. https://aws.amazon.com/compliance/

---

**Documento preparado por:**  
Equipo de Proyecto - Diplomado en Innovación e Integración Tecnológica  
MAZA AUCCATINCO, MARIBEL  
SALAS LUPERDI, HUGO DONIE  
MAMANI CALLO, RONALDINHO PELE  

**IEST Privado CIBERTEC**  
Lima, Octubre del 2025

---

**FIN DEL CAPÍTULO 2**