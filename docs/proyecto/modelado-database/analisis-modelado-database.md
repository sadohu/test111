# Análisis de Modelado de Base de Datos
## Plataforma Educativa con Inteligencia Artificial

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Documento
Este documento describe el diseño completo de la base de datos para la plataforma educativa basada en IA. Define el modelo de datos relacional, las relaciones entre entidades, índices, restricciones y consideraciones de seguridad.

### 1.2 Estrategia de Almacenamiento

El sistema utilizará una arquitectura híbrida:

- **PostgreSQL**: Base de datos relacional principal para datos estructurados (usuarios, evaluaciones, progreso).
- **MongoDB**: Base de datos NoSQL para contenidos educativos, logs de aprendizaje y datos no estructurados.
- **Redis**: Caché en memoria para sesiones, tokens y datos en tiempo real.

Este documento se enfoca en el **modelo relacional (PostgreSQL)**.

---

## 2. MODELO ENTIDAD-RELACIÓN (ER)

### 2.1 Diagrama Conceptual de Alto Nivel

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  GUARDIANS  │ 1     N │  STUDENTS   │ N     1 │   GROUPS    │
│             ├─────────┤             ├─────────┤             │
│ (Tutores)   │         │ (Alumnos)   │         │  (Aulas)    │
└─────────────┘         └──────┬──────┘         └──────┬──────┘
                               │                       │
                               │ N                     │ 1
                               │                       │
                         ┌─────┴──────┐         ┌──────┴──────┐
                         │ STUDENT_   │         │   TEACHERS  │
                         │ PROFILES   │         │             │
                         │            │         │ (Docentes)  │
                         └─────┬──────┘         └─────────────┘
                               │
                               │ 1
                               │
                         ┌─────┴──────┐
                         │ STUDENT_   │
                    ┌────┤ ASSESSMENTS│────┐
                    │    │            │    │
                    │    └────────────┘    │
                    │                      │
              ┌─────┴──────┐         ┌─────┴──────┐
              │ STUDENT_   │         │ ASSESSMENT_│
              │ RESPONSES  │         │   ITEMS    │
              │            │         │            │
              └────────────┘         └────────────┘
```

### 2.2 Entidades Principales

Las entidades se agrupan en módulos funcionales:

1. **Módulo de Usuarios y Autenticación**
   - users
   - guardians
   - students
   - teachers
   - directors
   - administrators
   - guardian_student_relationship

2. **Módulo de Perfiles y Personalización**
   - student_profiles
   - learning_styles

3. **Módulo de Evaluación**
   - assessment_items
   - student_assessments
   - student_responses

4. **Módulo de Contenidos y Actividades**
   - activities
   - activity_assignments
   - student_activity_progress

5. **Módulo de Retroalimentación**
   - feedback_logs
   - error_patterns

6. **Módulo de Grupos y Gestión Docente**
   - groups
   - group_students
   - alerts

7. **Módulo de Reportes y Exportación**
   - generated_reports
   - export_audit_log

8. **Módulo de Seguridad y Auditoría**
   - consents
   - privacy_audit_log
   - data_deletion_requests
   - active_sessions
   - audit_logs

9. **Módulo de Gamificación**
   - student_points
   - badges
   - student_badges

10. **Módulo de Métricas Institucionales**
    - institutional_metrics

---

## 3. DEFINICIÓN DETALLADA DE TABLAS

### 3.1 Módulo de Usuarios y Autenticación

#### Tabla: `users`
**Descripción**: Tabla maestra de usuarios del sistema con credenciales de autenticación.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del usuario |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Correo electrónico (único en el sistema) |
| hashed_password | VARCHAR(255) | NOT NULL | Contraseña hasheada con bcrypt |
| role | ENUM('student', 'guardian', 'teacher', 'director', 'admin') | NOT NULL | Rol del usuario |
| is_active | BOOLEAN | DEFAULT TRUE | Estado de activación de la cuenta |
| email_verified | BOOLEAN | DEFAULT FALSE | Si el correo ha sido verificado |
| last_login | TIMESTAMP | NULL | Última fecha/hora de login |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices**:
- `idx_users_email` ON `email`
- `idx_users_role` ON `role`

---

#### Tabla: `guardians`
**Descripción**: Información de tutores legales responsables de estudiantes menores de edad.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del tutor |
| user_id | UUID | FOREIGN KEY → users(id), UNIQUE, NOT NULL | Referencia al usuario |
| full_name | VARCHAR(255) | NOT NULL | Nombre completo del tutor |
| encrypted_phone | TEXT | NULL | Teléfono encriptado (AES-256) |
| encrypted_dni | TEXT | NULL | DNI encriptado (AES-256) |
| relationship_to_students | VARCHAR(100) | NULL | Relación general (padre, madre, tutor, etc.) |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices**:
- `idx_guardians_user_id` ON `user_id`

---

#### Tabla: `students`
**Descripción**: Información de estudiantes menores de edad (datos mínimos para cumplir normativas de privacidad).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del estudiante |
| user_id | UUID | FOREIGN KEY → users(id), UNIQUE, NULL | Referencia al usuario (NULL si login simplificado) |
| uuid_anonymous | UUID | UNIQUE, NOT NULL, DEFAULT gen_random_uuid() | UUID anonimizado para analytics |
| first_name | VARCHAR(100) | NOT NULL | Nombre del estudiante |
| last_name | VARCHAR(100) | NOT NULL | Apellido del estudiante |
| birth_date | DATE | NOT NULL | Fecha de nacimiento |
| grade | INTEGER | NOT NULL, CHECK (grade BETWEEN 3 AND 6) | Grado escolar (3° a 6° primaria) |
| gender | ENUM('male', 'female', 'other', 'prefer_not_say') | NULL | Género (opcional) |
| simple_login_username | VARCHAR(50) | UNIQUE, NULL | Usuario simplificado para login (si aplica) |
| simple_login_pin_hashed | VARCHAR(255) | NULL | PIN de 4 dígitos hasheado (para login simplificado) |
| consent_timestamp | TIMESTAMP | NULL | Fecha/hora de aceptación de consentimiento |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices**:
- `idx_students_user_id` ON `user_id`
- `idx_students_uuid_anonymous` ON `uuid_anonymous`
- `idx_students_grade` ON `grade`

---

#### Tabla: `guardian_student_relationship`
**Descripción**: Relación muchos a muchos entre tutores y estudiantes (un tutor puede tener varios hijos, un estudiante puede tener varios tutores responsables).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la relación |
| guardian_id | UUID | FOREIGN KEY → guardians(id), NOT NULL | Referencia al tutor |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Referencia al estudiante |
| relationship_type | VARCHAR(100) | NOT NULL | Tipo de relación (padre, madre, tutor legal, abuelo, etc.) |
| is_primary | BOOLEAN | DEFAULT FALSE | Si es el tutor principal |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Restricciones**:
- `UNIQUE (guardian_id, student_id)` - Un tutor no puede tener la misma relación duplicada con un estudiante

**Índices**:
- `idx_relationship_guardian` ON `guardian_id`
- `idx_relationship_student` ON `student_id`

---

#### Tabla: `teachers`
**Descripción**: Información de docentes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del docente |
| user_id | UUID | FOREIGN KEY → users(id), UNIQUE, NOT NULL | Referencia al usuario |
| full_name | VARCHAR(255) | NOT NULL | Nombre completo del docente |
| specialization | VARCHAR(100) | NULL | Especialización (Matemática, Comunicación, etc.) |
| phone | VARCHAR(20) | NULL | Teléfono de contacto |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices**:
- `idx_teachers_user_id` ON `user_id`

---

#### Tabla: `directors`
**Descripción**: Información de directores de institución.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del director |
| user_id | UUID | FOREIGN KEY → users(id), UNIQUE, NOT NULL | Referencia al usuario |
| full_name | VARCHAR(255) | NOT NULL | Nombre completo del director |
| institution_name | VARCHAR(255) | NOT NULL | Nombre de la institución |
| phone | VARCHAR(20) | NULL | Teléfono de contacto |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices**:
- `idx_directors_user_id` ON `user_id`

---

#### Tabla: `administrators`
**Descripción**: Información de administradores del sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del administrador |
| user_id | UUID | FOREIGN KEY → users(id), UNIQUE, NOT NULL | Referencia al usuario |
| full_name | VARCHAR(255) | NOT NULL | Nombre completo |
| access_level | ENUM('full', 'limited') | DEFAULT 'limited' | Nivel de acceso |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices**:
- `idx_administrators_user_id` ON `user_id`

---

### 3.2 Módulo de Perfiles y Personalización

#### Tabla: `student_profiles`
**Descripción**: Perfil de aprendizaje personalizado de cada estudiante, generado tras evaluación diagnóstica.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del perfil |
| student_id | UUID | FOREIGN KEY → students(id), UNIQUE, NOT NULL | Referencia al estudiante |
| math_level | ENUM('below', 'at_level', 'above') | NOT NULL | Nivel en Matemática |
| communication_level | ENUM('below', 'at_level', 'above') | NOT NULL | Nivel en Comunicación |
| learning_style_visual | INTEGER | CHECK (BETWEEN 0 AND 100) | Porcentaje de estilo Visual |
| learning_style_auditory | INTEGER | CHECK (BETWEEN 0 AND 100) | Porcentaje de estilo Auditivo |
| learning_style_reading | INTEGER | CHECK (BETWEEN 0 AND 100) | Porcentaje de estilo Lectoescritor |
| learning_style_kinesthetic | INTEGER | CHECK (BETWEEN 0 AND 100) | Porcentaje de estilo Kinestésico |
| dominant_learning_style | ENUM('visual', 'auditory', 'reading', 'kinesthetic') | NOT NULL | Estilo dominante |
| strengths | JSONB | NULL | Array de áreas de fortaleza |
| weaknesses | JSONB | NULL | Array de áreas de debilidad |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Restricción**:
- `CHECK (learning_style_visual + learning_style_auditory + learning_style_reading + learning_style_kinesthetic = 100)`

**Índices**:
- `idx_student_profiles_student_id` ON `student_id`
- `idx_student_profiles_math_level` ON `math_level`
- `idx_student_profiles_communication_level` ON `communication_level`

---

### 3.3 Módulo de Evaluación

#### Tabla: `assessment_items`
**Descripción**: Banco de ítems de evaluación categorizados.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del ítem |
| area | ENUM('math', 'communication') | NOT NULL | Área curricular |
| grade | INTEGER | NOT NULL, CHECK (grade BETWEEN 3 AND 6) | Grado recomendado |
| difficulty | INTEGER | NOT NULL, CHECK (difficulty BETWEEN 1 AND 5) | Nivel de dificultad (1=muy fácil, 5=muy difícil) |
| discrimination | DECIMAL(3,2) | CHECK (BETWEEN 0 AND 1) | Parámetro de discriminación (TRI) |
| item_type | ENUM('multiple_choice', 'true_false', 'open_ended', 'matching') | NOT NULL | Tipo de ítem |
| content | JSONB | NOT NULL | Contenido del ítem (enunciado, opciones, recursos multimedia) |
| correct_answer | TEXT | NOT NULL | Respuesta correcta |
| topic | VARCHAR(100) | NOT NULL | Tema específico |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices**:
- `idx_assessment_items_area` ON `area`
- `idx_assessment_items_grade` ON `grade`
- `idx_assessment_items_difficulty` ON `difficulty`
- `idx_assessment_items_topic` ON `topic`

---

#### Tabla: `student_assessments`
**Descripción**: Registro de evaluaciones realizadas por estudiantes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la evaluación |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Referencia al estudiante |
| assessment_type | ENUM('diagnostic', 'formative', 'summative') | NOT NULL | Tipo de evaluación |
| area | ENUM('math', 'communication', 'learning_style') | NOT NULL | Área evaluada |
| started_at | TIMESTAMP | DEFAULT NOW() | Fecha/hora de inicio |
| completed_at | TIMESTAMP | NULL | Fecha/hora de finalización |
| status | ENUM('in_progress', 'completed', 'abandoned') | DEFAULT 'in_progress' | Estado |
| final_theta | DECIMAL(5,2) | NULL | Estimación final de habilidad (TRI) |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices**:
- `idx_student_assessments_student_id` ON `student_id`
- `idx_student_assessments_status` ON `status`

---

#### Tabla: `student_responses`
**Descripción**: Respuestas de estudiantes a ítems de evaluación.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la respuesta |
| assessment_id | UUID | FOREIGN KEY → student_assessments(id), NOT NULL | Referencia a la evaluación |
| item_id | UUID | FOREIGN KEY → assessment_items(id), NOT NULL | Referencia al ítem |
| response | TEXT | NOT NULL | Respuesta del estudiante |
| is_correct | BOOLEAN | NOT NULL | Si la respuesta es correcta |
| response_time_seconds | INTEGER | NULL | Tiempo de respuesta en segundos |
| theta_estimate | DECIMAL(5,2) | NULL | Estimación de habilidad tras esta respuesta |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices**:
- `idx_student_responses_assessment_id` ON `assessment_id`
- `idx_student_responses_item_id` ON `item_id`

---

### 3.4 Módulo de Contenidos y Actividades

#### Tabla: `activities`
**Descripción**: Catálogo de actividades educativas disponibles en la plataforma.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la actividad |
| title | VARCHAR(255) | NOT NULL | Título de la actividad |
| description | TEXT | NULL | Descripción |
| area | ENUM('math', 'communication') | NOT NULL | Área curricular |
| grade | INTEGER | NOT NULL, CHECK (grade BETWEEN 3 AND 6) | Grado recomendado |
| difficulty | INTEGER | NOT NULL, CHECK (difficulty BETWEEN 1 AND 5) | Nivel de dificultad |
| topic | VARCHAR(100) | NOT NULL | Tema específico |
| activity_type | ENUM('exercise', 'reading', 'video', 'game', 'project') | NOT NULL | Tipo de actividad |
| estimated_time_minutes | INTEGER | NULL | Tiempo estimado de completitud |
| content | JSONB | NOT NULL | Contenido de la actividad (preguntas, recursos, etc.) |
| learning_styles | JSONB | NULL | Array de estilos de aprendizaje compatibles |
| created_by | UUID | FOREIGN KEY → users(id), NULL | Creador de la actividad |
| is_active | BOOLEAN | DEFAULT TRUE | Si la actividad está activa |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices**:
- `idx_activities_area` ON `area`
- `idx_activities_grade` ON `grade`
- `idx_activities_topic` ON `topic`
- `idx_activities_difficulty` ON `difficulty`

---

#### Tabla: `activity_assignments`
**Descripción**: Asignación de actividades a estudiantes o grupos por parte de docentes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la asignación |
| activity_id | UUID | FOREIGN KEY → activities(id), NOT NULL | Referencia a la actividad |
| assigned_by | UUID | FOREIGN KEY → teachers(id), NOT NULL | Docente que asigna |
| assigned_to_student | UUID | FOREIGN KEY → students(id), NULL | Estudiante (NULL si es grupal) |
| assigned_to_group | UUID | FOREIGN KEY → groups(id), NULL | Grupo (NULL si es individual) |
| due_date | TIMESTAMP | NULL | Fecha de vencimiento |
| custom_instructions | TEXT | NULL | Instrucciones personalizadas |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Restricción**:
- `CHECK ((assigned_to_student IS NOT NULL AND assigned_to_group IS NULL) OR (assigned_to_student IS NULL AND assigned_to_group IS NOT NULL))`

**Índices**:
- `idx_activity_assignments_activity_id` ON `activity_id`
- `idx_activity_assignments_student` ON `assigned_to_student`
- `idx_activity_assignments_group` ON `assigned_to_group`

---

#### Tabla: `student_activity_progress`
**Descripción**: Progreso de estudiantes en actividades.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del progreso |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Referencia al estudiante |
| activity_id | UUID | FOREIGN KEY → activities(id), NOT NULL | Referencia a la actividad |
| assignment_id | UUID | FOREIGN KEY → activity_assignments(id), NULL | Si fue asignada |
| status | ENUM('not_started', 'in_progress', 'completed', 'reviewed') | DEFAULT 'not_started' | Estado |
| started_at | TIMESTAMP | NULL | Fecha/hora de inicio |
| completed_at | TIMESTAMP | NULL | Fecha/hora de finalización |
| time_spent_seconds | INTEGER | DEFAULT 0 | Tiempo total invertido |
| score | DECIMAL(5,2) | NULL | Puntaje obtenido |
| responses | JSONB | NULL | Respuestas del estudiante |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Restricción**:
- `UNIQUE (student_id, activity_id, assignment_id)`

**Índices**:
- `idx_student_activity_progress_student` ON `student_id`
- `idx_student_activity_progress_activity` ON `activity_id`
- `idx_student_activity_progress_status` ON `status`

---

### 3.5 Módulo de Retroalimentación

#### Tabla: `feedback_logs`
**Descripción**: Registro de retroalimentación generada por IA para estudiantes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del feedback |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Referencia al estudiante |
| activity_id | UUID | FOREIGN KEY → activities(id), NULL | Actividad relacionada |
| assessment_id | UUID | FOREIGN KEY → student_assessments(id), NULL | Evaluación relacionada |
| response_id | UUID | FOREIGN KEY → student_responses(id), NULL | Respuesta específica |
| feedback_type | ENUM('correct', 'incorrect', 'hint', 'encouragement', 'explanation') | NOT NULL | Tipo de feedback |
| feedback_content | TEXT | NOT NULL | Contenido del feedback generado |
| ai_model_used | VARCHAR(50) | NOT NULL | Modelo de IA utilizado (GPT-4, Claude, etc.) |
| learning_style_adapted | ENUM('visual', 'auditory', 'reading', 'kinesthetic') | NULL | Estilo al que se adaptó |
| resources_recommended | JSONB | NULL | Recursos complementarios recomendados |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices**:
- `idx_feedback_logs_student` ON `student_id`
- `idx_feedback_logs_activity` ON `activity_id`

---

#### Tabla: `error_patterns`
**Descripción**: Patrones de errores recurrentes identificados por el sistema de IA.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del patrón |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Referencia al estudiante |
| concept | VARCHAR(100) | NOT NULL | Concepto con dificultad |
| area | ENUM('math', 'communication') | NOT NULL | Área curricular |
| error_count | INTEGER | DEFAULT 1 | Número de errores en este concepto |
| last_occurrence | TIMESTAMP | DEFAULT NOW() | Última vez que ocurrió el error |
| remedial_action_taken | ENUM('alert_teacher', 'suggest_activity', 'adjust_path', 'none') | DEFAULT 'none' | Acción correctiva tomada |
| resolved | BOOLEAN | DEFAULT FALSE | Si el patrón ha sido resuelto |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Restricción**:
- `UNIQUE (student_id, concept, area)`

**Índices**:
- `idx_error_patterns_student` ON `student_id`
- `idx_error_patterns_concept` ON `concept`
- `idx_error_patterns_resolved` ON `resolved`

---

### 3.6 Módulo de Grupos y Gestión Docente

#### Tabla: `groups`
**Descripción**: Grupos o aulas de estudiantes gestionados por docentes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del grupo |
| name | VARCHAR(255) | NOT NULL | Nombre del grupo |
| grade | INTEGER | NOT NULL, CHECK (grade BETWEEN 3 AND 6) | Grado |
| teacher_id | UUID | FOREIGN KEY → teachers(id), NOT NULL | Docente responsable |
| academic_year | INTEGER | NOT NULL | Año académico |
| is_active | BOOLEAN | DEFAULT TRUE | Si el grupo está activo |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

**Índices**:
- `idx_groups_teacher` ON `teacher_id`
- `idx_groups_grade` ON `grade`
- `idx_groups_active` ON `is_active`

---

#### Tabla: `group_students`
**Descripción**: Relación muchos a muchos entre grupos y estudiantes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la relación |
| group_id | UUID | FOREIGN KEY → groups(id), NOT NULL | Referencia al grupo |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Referencia al estudiante |
| joined_at | TIMESTAMP | DEFAULT NOW() | Fecha de incorporación al grupo |
| is_active | BOOLEAN | DEFAULT TRUE | Si el estudiante está activo en el grupo |

**Restricción**:
- `UNIQUE (group_id, student_id)`

**Índices**:
- `idx_group_students_group` ON `group_id`
- `idx_group_students_student` ON `student_id`

---

#### Tabla: `alerts`
**Descripción**: Alertas tempranas generadas por el sistema de IA para docentes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la alerta |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Estudiante relacionado |
| teacher_id | UUID | FOREIGN KEY → teachers(id), NOT NULL | Docente destinatario |
| alert_type | ENUM('inactivity', 'low_performance', 'error_pattern', 'disengagement', 'other') | NOT NULL | Tipo de alerta |
| priority | ENUM('high', 'medium', 'low') | DEFAULT 'medium' | Prioridad |
| message | TEXT | NOT NULL | Mensaje de la alerta |
| is_read | BOOLEAN | DEFAULT FALSE | Si fue leída por el docente |
| is_resolved | BOOLEAN | DEFAULT FALSE | Si fue atendida |
| teacher_notes | TEXT | NULL | Notas del docente sobre la alerta |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| resolved_at | TIMESTAMP | NULL | Fecha de resolución |

**Índices**:
- `idx_alerts_student` ON `student_id`
- `idx_alerts_teacher` ON `teacher_id`
- `idx_alerts_priority` ON `priority`
- `idx_alerts_resolved` ON `is_resolved`

---

### 3.7 Módulo de Reportes y Exportación

#### Tabla: `generated_reports`
**Descripción**: Reportes generados por usuarios para exportación.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del reporte |
| user_id | UUID | FOREIGN KEY → users(id), NOT NULL | Usuario que generó el reporte |
| report_type | ENUM('student_individual', 'group', 'institutional', 'custom') | NOT NULL | Tipo de reporte |
| format | ENUM('csv', 'xlsx', 'pdf') | NOT NULL | Formato del archivo |
| file_name | VARCHAR(255) | NOT NULL | Nombre del archivo |
| file_path | TEXT | NOT NULL | Ruta del archivo (S3/local) |
| file_size_bytes | INTEGER | NULL | Tamaño del archivo |
| filters_applied | JSONB | NULL | Filtros aplicados al reporte |
| generated_at | TIMESTAMP | DEFAULT NOW() | Fecha de generación |
| expires_at | TIMESTAMP | NOT NULL | Fecha de expiración (generado + 7 días) |
| download_count | INTEGER | DEFAULT 0 | Número de descargas |

**Índices**:
- `idx_generated_reports_user` ON `user_id`
- `idx_generated_reports_expires` ON `expires_at`

---

#### Tabla: `export_audit_log`
**Descripción**: Auditoría de todas las exportaciones de datos realizadas.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del log |
| user_id | UUID | FOREIGN KEY → users(id), NOT NULL | Usuario que exportó |
| report_type | VARCHAR(100) | NOT NULL | Tipo de reporte exportado |
| filters_applied | JSONB | NULL | Filtros aplicados |
| format | VARCHAR(20) | NOT NULL | Formato de exportación |
| purpose | TEXT | NULL | Propósito de la exportación (opcional) |
| file_size_bytes | INTEGER | NULL | Tamaño del archivo |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de exportación |

**Índices**:
- `idx_export_audit_log_user` ON `user_id`
- `idx_export_audit_log_created` ON `created_at`

---

### 3.8 Módulo de Seguridad y Auditoría

#### Tabla: `consents`
**Descripción**: Consentimientos de privacidad otorgados por tutores para estudiantes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del consentimiento |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Referencia al estudiante |
| guardian_id | UUID | FOREIGN KEY → guardians(id), NOT NULL | Tutor que otorga el consentimiento |
| consent_type | VARCHAR(100) | NOT NULL | Tipo de consentimiento |
| granted | BOOLEAN | DEFAULT FALSE | Si se otorga o revoca |
| granted_at | TIMESTAMP | NULL | Fecha de otorgamiento |
| revoked_at | TIMESTAMP | NULL | Fecha de revocación |
| updated_by | UUID | FOREIGN KEY → guardians(id), NOT NULL | Quién actualizó el consentimiento |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Restricción**:
- `UNIQUE (student_id, consent_type)`

**Índices**:
- `idx_consents_student` ON `student_id`
- `idx_consents_guardian` ON `guardian_id`
- `idx_consents_type` ON `consent_type`

---

#### Tabla: `privacy_audit_log`
**Descripción**: Auditoría de cambios en configuración de privacidad.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del log |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Estudiante afectado |
| guardian_id | UUID | FOREIGN KEY → guardians(id), NOT NULL | Tutor que realizó el cambio |
| action | VARCHAR(100) | NOT NULL | Acción realizada |
| details | JSONB | NULL | Detalles del cambio |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha del cambio |

**Índices**:
- `idx_privacy_audit_log_student` ON `student_id`
- `idx_privacy_audit_log_guardian` ON `guardian_id`

---

#### Tabla: `data_deletion_requests`
**Descripción**: Solicitudes de eliminación de datos (derecho al olvido).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la solicitud |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Estudiante a eliminar |
| requested_by | UUID | FOREIGN KEY → guardians(id), NOT NULL | Tutor que solicita |
| requested_at | TIMESTAMP | DEFAULT NOW() | Fecha de solicitud |
| scheduled_deletion_at | TIMESTAMP | NOT NULL | Fecha programada de eliminación (30 días después) |
| status | ENUM('pending', 'cancelled', 'completed') | DEFAULT 'pending' | Estado de la solicitud |
| completed_at | TIMESTAMP | NULL | Fecha de completitud |

**Índices**:
- `idx_data_deletion_requests_student` ON `student_id`
- `idx_data_deletion_requests_status` ON `status`
- `idx_data_deletion_requests_scheduled` ON `scheduled_deletion_at`

---

#### Tabla: `active_sessions`
**Descripción**: Sesiones activas de usuarios (gestionadas con Redis, respaldo en PostgreSQL).

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la sesión |
| session_id | VARCHAR(255) | UNIQUE, NOT NULL | ID de sesión (token JWT) |
| user_id | UUID | FOREIGN KEY → users(id), NOT NULL | Referencia al usuario |
| ip_address | INET | NOT NULL | Dirección IP |
| user_agent | TEXT | NULL | Información del navegador/dispositivo |
| device_info | JSONB | NULL | Información adicional del dispositivo |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación de la sesión |
| last_activity_at | TIMESTAMP | DEFAULT NOW() | Última actividad |
| expires_at | TIMESTAMP | NOT NULL | Fecha de expiración |

**Índices**:
- `idx_active_sessions_session_id` ON `session_id`
- `idx_active_sessions_user` ON `user_id`
- `idx_active_sessions_expires` ON `expires_at`

---

#### Tabla: `audit_logs`
**Descripción**: Log general de auditoría de acciones en el sistema.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del log |
| user_id | UUID | FOREIGN KEY → users(id), NULL | Usuario (NULL si es sistema) |
| action | VARCHAR(100) | NOT NULL | Acción realizada |
| resource_type | VARCHAR(100) | NULL | Tipo de recurso afectado |
| resource_id | UUID | NULL | ID del recurso |
| ip_address | INET | NULL | Dirección IP |
| user_agent | TEXT | NULL | Información del navegador |
| status | ENUM('success', 'failure') | NOT NULL | Estado de la acción |
| details | JSONB | NULL | Detalles adicionales |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha del log |

**Índices**:
- `idx_audit_logs_user` ON `user_id`
- `idx_audit_logs_action` ON `action`
- `idx_audit_logs_created` ON `created_at`

---

### 3.9 Módulo de Gamificación

#### Tabla: `student_points`
**Descripción**: Puntos acumulados por estudiantes mediante gamificación.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único |
| student_id | UUID | FOREIGN KEY → students(id), UNIQUE, NOT NULL | Referencia al estudiante |
| total_points | INTEGER | DEFAULT 0 | Puntos totales acumulados |
| weekly_points | INTEGER | DEFAULT 0 | Puntos de la semana actual |
| monthly_points | INTEGER | DEFAULT 0 | Puntos del mes actual |
| updated_at | TIMESTAMP | DEFAULT NOW() | Última actualización |

**Índices**:
- `idx_student_points_student` ON `student_id`
- `idx_student_points_total` ON `total_points`

---

#### Tabla: `badges`
**Descripción**: Catálogo de insignias disponibles.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del badge |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Nombre del badge |
| description | TEXT | NULL | Descripción |
| icon_url | TEXT | NULL | URL del ícono |
| category | ENUM('achievement', 'perseverance', 'excellence', 'collaboration', 'curiosity') | NOT NULL | Categoría |
| criteria | JSONB | NOT NULL | Criterios para obtenerlo |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices**:
- `idx_badges_category` ON `category`

---

#### Tabla: `student_badges`
**Descripción**: Badges obtenidos por estudiantes.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único |
| student_id | UUID | FOREIGN KEY → students(id), NOT NULL | Referencia al estudiante |
| badge_id | UUID | FOREIGN KEY → badges(id), NOT NULL | Referencia al badge |
| earned_at | TIMESTAMP | DEFAULT NOW() | Fecha de obtención |

**Restricción**:
- `UNIQUE (student_id, badge_id)`

**Índices**:
- `idx_student_badges_student` ON `student_id`
- `idx_student_badges_badge` ON `badge_id`

---

### 3.10 Módulo de Métricas Institucionales

#### Tabla: `institutional_metrics`
**Descripción**: Métricas agregadas a nivel institucional para dashboard de directores.

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la métrica |
| metric_name | VARCHAR(100) | NOT NULL | Nombre de la métrica |
| value | DECIMAL(10,2) | NOT NULL | Valor de la métrica |
| aggregation_level | ENUM('institution', 'group', 'grade') | NOT NULL | Nivel de agregación |
| aggregation_id | UUID | NULL | ID del grupo/grado (NULL si es institucional) |
| date | DATE | NOT NULL | Fecha de la métrica |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices**:
- `idx_institutional_metrics_name` ON `metric_name`
- `idx_institutional_metrics_date` ON `date`
- `idx_institutional_metrics_aggregation` ON `aggregation_level, aggregation_id`

---

## 4. RELACIONES ENTRE TABLAS

### 4.1 Diagrama de Relaciones Principales

```
users (1) ──────── (1) guardians
users (1) ──────── (1) students
users (1) ──────── (1) teachers
users (1) ──────── (1) directors
users (1) ──────── (1) administrators

guardians (N) ──────── (M) students [guardian_student_relationship]

students (1) ──────── (1) student_profiles
students (1) ──────── (N) student_assessments
students (1) ──────── (N) student_activity_progress
students (1) ──────── (N) feedback_logs
students (1) ──────── (N) error_patterns
students (1) ──────── (N) consents
students (1) ──────── (1) student_points
students (1) ──────── (M) badges [student_badges]

students (M) ──────── (M) groups [group_students]

teachers (1) ──────── (N) groups
teachers (1) ──────── (N) activity_assignments
teachers (1) ──────── (N) alerts

student_assessments (1) ──────── (N) student_responses

activities (1) ──────── (N) activity_assignments
activities (1) ──────── (N) student_activity_progress

assessment_items (1) ──────── (N) student_responses
```

---

## 5. CONSIDERACIONES DE DISEÑO

### 5.1 Normalización
- El diseño sigue la **Tercera Forma Normal (3NF)** para evitar redundancia de datos.
- Uso de tablas intermedias para relaciones muchos a muchos (`guardian_student_relationship`, `group_students`, `student_badges`).

### 5.2 Uso de UUID
- Se utiliza UUID (Universally Unique Identifier) en lugar de enteros auto-incrementales para:
  - Mejor seguridad (no se pueden predecir IDs).
  - Facilitar replicación y sincronización multi-servidor.
  - Compatibilidad con sistemas distribuidos.

### 5.3 Tipos de Datos ENUM
- Se utilizan ENUMs para campos con valores fijos (roles, estados, niveles) para:
  - Garantizar integridad de datos.
  - Mejorar rendimiento de queries.
  - Claridad en el modelo.

### 5.4 JSONB para Datos Semi-estructurados
- Campos como `content`, `strengths`, `weaknesses`, `filters_applied` usan JSONB para:
  - Flexibilidad en contenidos educativos variables.
  - Evitar creación de múltiples tablas para datos poco estructurados.
  - PostgreSQL permite indexar y consultar JSONB eficientemente.

### 5.5 Encriptación de Datos Sensibles
- Datos sensibles como DNI y teléfono se almacenan encriptados (AES-256).
- Las contraseñas se hashean con bcrypt (nunca se almacenan en texto plano).

### 5.6 Timestamps
- Todas las tablas incluyen `created_at` y `updated_at` para trazabilidad.
- Uso de `TIMESTAMP` con zona horaria UTC.

### 5.7 Soft Deletes
- En lugar de eliminar registros físicamente, se marca con `is_active = FALSE` o estados específicos.
- Permite recuperación y cumple con normativas de auditoría.

---

## 6. ÍNDICES Y OPTIMIZACIÓN

### 6.1 Estrategia de Indexación
Se crean índices en:
- **Claves foráneas**: Para acelerar JOINs.
- **Campos de búsqueda frecuente**: `email`, `grade`, `area`, `status`.
- **Campos de ordenamiento**: `created_at`, `total_points`.

### 6.2 Índices Compuestos
Para queries frecuentes que filtran por múltiples campos:
```sql
CREATE INDEX idx_activities_area_grade_difficulty
ON activities(area, grade, difficulty);

CREATE INDEX idx_student_activity_progress_student_status
ON student_activity_progress(student_id, status);
```

### 6.3 Índices en JSONB
Para consultas en campos JSONB:
```sql
CREATE INDEX idx_activities_content_gin
ON activities USING GIN (content);
```

### 6.4 Vistas Materializadas
Para queries pesadas de métricas institucionales:
```sql
CREATE MATERIALIZED VIEW mv_institutional_kpis AS
SELECT
  COUNT(DISTINCT s.id) AS total_students,
  AVG(sp.math_level) AS avg_math_level,
  AVG(sp.communication_level) AS avg_communication_level
FROM students s
LEFT JOIN student_profiles sp ON s.id = sp.student_id;
```

---

## 7. SEGURIDAD

### 7.1 Row-Level Security (RLS)
PostgreSQL permite implementar políticas de seguridad a nivel de fila:

```sql
-- Solo tutores pueden ver datos de sus propios hijos
CREATE POLICY guardian_student_policy ON students
FOR SELECT TO guardian_role
USING (id IN (
  SELECT student_id
  FROM guardian_student_relationship
  WHERE guardian_id = current_user_id()
));
```

### 7.2 Roles y Permisos
- **Administrador**: Acceso total.
- **Director**: Solo lectura de métricas institucionales.
- **Docente**: Lectura/escritura en sus grupos asignados.
- **Tutor**: Lectura de sus hijos.
- **Estudiante**: Lectura de sus propios datos.

### 7.3 Auditoría Completa
- Todas las acciones sensibles (exportaciones, cambios de privacidad, eliminaciones) se registran en logs de auditoría.

---

## 8. BACKUP Y RECUPERACIÓN

### 8.1 Estrategia de Backup
- **Backups completos diarios** (full backup) a las 2:00 AM UTC.
- **Backups incrementales cada 6 horas**.
- **Retención**: 30 días de backups diarios, 12 meses de backups mensuales.

### 8.2 Replicación
- **Configuración Master-Slave**: Servidor principal de escritura, replicas de solo lectura para queries pesadas de reportes.

---

## 9. MIGRACIÓN Y VERSIONADO

### 9.1 Control de Versiones de Esquema
- Uso de herramientas de migración: **Flyway** (Java), **Alembic** (Python), **Knex.js** (Node.js).
- Cada cambio de esquema se versiona con timestamp.

### 9.2 Ejemplo de Migración
```sql
-- V001__create_users_table.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  ...
);

-- V002__add_two_factor_auth.sql
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
```

---

## 10. CONSIDERACIONES DE RENDIMIENTO

### 10.1 Estimación de Volumen de Datos

| Tabla | Estimación de Registros (1 año) |
|-------|--------------------------------|
| users | 10,000 |
| students | 5,000 |
| guardians | 4,000 |
| teachers | 200 |
| student_assessments | 50,000 |
| student_responses | 500,000 |
| activities | 2,000 |
| student_activity_progress | 100,000 |
| feedback_logs | 300,000 |
| audit_logs | 1,000,000 |

### 10.2 Estrategias de Particionamiento

Para tablas de alto volumen como `audit_logs`:

```sql
CREATE TABLE audit_logs (
  ...
  created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE audit_logs_2025_q1 PARTITION OF audit_logs
FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
```

---

## 11. CONCLUSIONES

Este diseño de base de datos:

- **Cumple con normativas de privacidad**: COPPA, Ley 29733.
- **Escalable**: Diseño modular que permite crecimiento.
- **Seguro**: Encriptación, auditoría, RLS.
- **Optimizado**: Índices estratégicos, vistas materializadas, caché.
- **Flexible**: JSONB para datos semi-estructurados.
- **Auditable**: Logs completos de todas las acciones sensibles.

El modelo soporta todas las historias de usuario definidas y está preparado para evolucionar según las necesidades del proyecto.

---

**Fecha de Elaboración**: 18 de Noviembre de 2025
**Versión**: 1.0
**Estado**: Diseño Técnico Detallado
