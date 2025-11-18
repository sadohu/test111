-- ============================================================================
-- Script: 04_create_tables_profiles_assessment.sql
-- Descripción: Tablas de perfiles de estudiantes y sistema de evaluación
-- Proyecto: Plataforma Educativa con IA
-- Versión: 1.0
-- Fecha: 2025-11-18
-- ============================================================================

-- ============================================================================
-- TABLA: student_profiles
-- Descripción: Perfil de aprendizaje personalizado de cada estudiante
-- ============================================================================
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    math_level academic_level NOT NULL,
    communication_level academic_level NOT NULL,
    learning_style_visual INTEGER CHECK (learning_style_visual BETWEEN 0 AND 100),
    learning_style_auditory INTEGER CHECK (learning_style_auditory BETWEEN 0 AND 100),
    learning_style_reading INTEGER CHECK (learning_style_reading BETWEEN 0 AND 100),
    learning_style_kinesthetic INTEGER CHECK (learning_style_kinesthetic BETWEEN 0 AND 100),
    dominant_learning_style learning_style NOT NULL,
    strengths JSONB NULL,
    weaknesses JSONB NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Constraint: Los estilos de aprendizaje deben sumar 100%
    CONSTRAINT chk_learning_styles_sum CHECK (
        learning_style_visual + learning_style_auditory +
        learning_style_reading + learning_style_kinesthetic = 100
    )
);

-- Índices para student_profiles
CREATE INDEX idx_student_profiles_student_id ON student_profiles(student_id);
CREATE INDEX idx_student_profiles_math_level ON student_profiles(math_level);
CREATE INDEX idx_student_profiles_communication_level ON student_profiles(communication_level);
CREATE INDEX idx_student_profiles_dominant_style ON student_profiles(dominant_learning_style);

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_student_profiles_updated_at
    BEFORE UPDATE ON student_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: assessment_items
-- Descripción: Banco de ítems de evaluación
-- ============================================================================
CREATE TABLE assessment_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area curriculum_area NOT NULL,
    grade INTEGER NOT NULL CHECK (grade BETWEEN 3 AND 6),
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    discrimination DECIMAL(3,2) CHECK (discrimination BETWEEN 0 AND 1),
    item_type item_type NOT NULL,
    content JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    topic VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para assessment_items
CREATE INDEX idx_assessment_items_area ON assessment_items(area);
CREATE INDEX idx_assessment_items_grade ON assessment_items(grade);
CREATE INDEX idx_assessment_items_difficulty ON assessment_items(difficulty);
CREATE INDEX idx_assessment_items_topic ON assessment_items(topic);
CREATE INDEX idx_assessment_items_area_grade_difficulty ON assessment_items(area, grade, difficulty);

-- Índice GIN para búsquedas en JSONB
CREATE INDEX idx_assessment_items_content_gin ON assessment_items USING GIN (content);

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_assessment_items_updated_at
    BEFORE UPDATE ON assessment_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: student_assessments
-- Descripción: Registro de evaluaciones realizadas por estudiantes
-- ============================================================================
CREATE TABLE student_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    assessment_type assessment_type NOT NULL,
    area assessment_area NOT NULL,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP NULL,
    status assessment_status DEFAULT 'in_progress',
    final_theta DECIMAL(5,2) NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para student_assessments
CREATE INDEX idx_student_assessments_student_id ON student_assessments(student_id);
CREATE INDEX idx_student_assessments_status ON student_assessments(status);
CREATE INDEX idx_student_assessments_type ON student_assessments(assessment_type);
CREATE INDEX idx_student_assessments_area ON student_assessments(area);

-- ============================================================================
-- TABLA: student_responses
-- Descripción: Respuestas de estudiantes a ítems de evaluación
-- ============================================================================
CREATE TABLE student_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES student_assessments(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES assessment_items(id) ON DELETE CASCADE,
    response TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_time_seconds INTEGER NULL CHECK (response_time_seconds >= 0),
    theta_estimate DECIMAL(5,2) NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para student_responses
CREATE INDEX idx_student_responses_assessment_id ON student_responses(assessment_id);
CREATE INDEX idx_student_responses_item_id ON student_responses(item_id);
CREATE INDEX idx_student_responses_correct ON student_responses(is_correct);

-- ============================================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================
COMMENT ON TABLE student_profiles IS 'Perfil de aprendizaje personalizado generado tras evaluación diagnóstica';
COMMENT ON TABLE assessment_items IS 'Banco de ítems de evaluación categorizados por área, grado y dificultad';
COMMENT ON TABLE student_assessments IS 'Registro de evaluaciones adaptativas realizadas por estudiantes';
COMMENT ON TABLE student_responses IS 'Respuestas individuales de estudiantes a ítems de evaluación';

COMMENT ON COLUMN student_profiles.strengths IS 'Array JSON de áreas de fortaleza identificadas';
COMMENT ON COLUMN student_profiles.weaknesses IS 'Array JSON de áreas de debilidad identificadas';
COMMENT ON COLUMN assessment_items.content IS 'Contenido del ítem (enunciado, opciones, recursos multimedia) en formato JSON';
COMMENT ON COLUMN student_assessments.final_theta IS 'Estimación final de habilidad según Teoría de Respuesta al Ítem (TRI)';

-- ============================================================================
-- Fin del script 04_create_tables_profiles_assessment.sql
-- ============================================================================
