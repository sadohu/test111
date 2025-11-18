-- ============================================================================
-- Script: 01_create_enums.sql
-- Descripción: Creación de tipos ENUM para la base de datos
-- Proyecto: Plataforma Educativa con IA
-- Versión: 1.0
-- Fecha: 2025-11-18
-- ============================================================================

-- Tipo ENUM para roles de usuarios
CREATE TYPE user_role AS ENUM (
    'student',
    'guardian',
    'teacher',
    'director',
    'admin'
);

-- Tipo ENUM para género
CREATE TYPE gender_type AS ENUM (
    'male',
    'female',
    'other',
    'prefer_not_say'
);

-- Tipo ENUM para nivel de acceso de administradores
CREATE TYPE admin_access_level AS ENUM (
    'full',
    'limited'
);

-- Tipo ENUM para niveles académicos
CREATE TYPE academic_level AS ENUM (
    'below',
    'at_level',
    'above'
);

-- Tipo ENUM para estilos de aprendizaje
CREATE TYPE learning_style AS ENUM (
    'visual',
    'auditory',
    'reading',
    'kinesthetic'
);

-- Tipo ENUM para áreas curriculares
CREATE TYPE curriculum_area AS ENUM (
    'math',
    'communication'
);

-- Tipo ENUM para tipo de evaluación
CREATE TYPE assessment_type AS ENUM (
    'diagnostic',
    'formative',
    'summative'
);

-- Tipo ENUM para área de evaluación
CREATE TYPE assessment_area AS ENUM (
    'math',
    'communication',
    'learning_style'
);

-- Tipo ENUM para estado de evaluación
CREATE TYPE assessment_status AS ENUM (
    'in_progress',
    'completed',
    'abandoned'
);

-- Tipo ENUM para tipo de ítem de evaluación
CREATE TYPE item_type AS ENUM (
    'multiple_choice',
    'true_false',
    'open_ended',
    'matching'
);

-- Tipo ENUM para tipo de actividad
CREATE TYPE activity_type AS ENUM (
    'exercise',
    'reading',
    'video',
    'game',
    'project'
);

-- Tipo ENUM para estado de progreso de actividad
CREATE TYPE activity_status AS ENUM (
    'not_started',
    'in_progress',
    'completed',
    'reviewed'
);

-- Tipo ENUM para tipo de retroalimentación
CREATE TYPE feedback_type AS ENUM (
    'correct',
    'incorrect',
    'hint',
    'encouragement',
    'explanation'
);

-- Tipo ENUM para acción correctiva de errores
CREATE TYPE remedial_action AS ENUM (
    'alert_teacher',
    'suggest_activity',
    'adjust_path',
    'none'
);

-- Tipo ENUM para tipo de alerta
CREATE TYPE alert_type AS ENUM (
    'inactivity',
    'low_performance',
    'error_pattern',
    'disengagement',
    'other'
);

-- Tipo ENUM para prioridad de alerta
CREATE TYPE alert_priority AS ENUM (
    'high',
    'medium',
    'low'
);

-- Tipo ENUM para tipo de reporte
CREATE TYPE report_type AS ENUM (
    'student_individual',
    'group',
    'institutional',
    'custom'
);

-- Tipo ENUM para formato de exportación
CREATE TYPE export_format AS ENUM (
    'csv',
    'xlsx',
    'pdf'
);

-- Tipo ENUM para estado de solicitud de eliminación de datos
CREATE TYPE deletion_status AS ENUM (
    'pending',
    'cancelled',
    'completed'
);

-- Tipo ENUM para estado de acción en auditoría
CREATE TYPE audit_status AS ENUM (
    'success',
    'failure'
);

-- Tipo ENUM para categoría de badge
CREATE TYPE badge_category AS ENUM (
    'achievement',
    'perseverance',
    'excellence',
    'collaboration',
    'curiosity'
);

-- Tipo ENUM para nivel de agregación de métricas
CREATE TYPE aggregation_level AS ENUM (
    'institution',
    'group',
    'grade'
);

-- ============================================================================
-- Fin del script 01_create_enums.sql
-- ============================================================================
