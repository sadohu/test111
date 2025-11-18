-- ============================================================================
-- Script: 02_create_extensions_and_functions.sql
-- Descripción: Creación de extensiones y funciones auxiliares
-- Proyecto: Plataforma Educativa con IA
-- Versión: 1.0
-- Fecha: 2025-11-18
-- ============================================================================

-- Extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extensión para encriptación de datos (pgcrypto)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Extensión para funciones de texto completo
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el ID del usuario actual (para RLS)
-- Nota: Esta función debe ser personalizada según la implementación de autenticación
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    -- Esta es una implementación de ejemplo
    -- En producción, se debe obtener del contexto de sesión
    RETURN NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID;
END;
$$ LANGUAGE plpgsql STABLE;

-- Función para encriptar datos sensibles (AES-256)
CREATE OR REPLACE FUNCTION encrypt_data(data TEXT, secret TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(
        encrypt(
            data::bytea,
            secret::bytea,
            'aes'
        ),
        'base64'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para desencriptar datos sensibles
CREATE OR REPLACE FUNCTION decrypt_data(encrypted_data TEXT, secret TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN convert_from(
        decrypt(
            decode(encrypted_data, 'base64'),
            secret::bytea,
            'aes'
        ),
        'utf8'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para validar formato de DNI peruano (8 dígitos)
CREATE OR REPLACE FUNCTION validate_dni(dni TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN dni ~ '^[0-9]{8}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para validar formato de correo electrónico
CREATE OR REPLACE FUNCTION validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para calcular edad a partir de fecha de nacimiento
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN DATE_PART('year', AGE(birth_date));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para generar username simplificado para estudiantes
CREATE OR REPLACE FUNCTION generate_student_username(first_name TEXT, last_name TEXT, student_id UUID)
RETURNS TEXT AS $$
DECLARE
    clean_first_name TEXT;
    clean_last_name TEXT;
    short_uuid TEXT;
BEGIN
    -- Limpiar nombres (sin espacios, lowercase)
    clean_first_name := LOWER(REGEXP_REPLACE(first_name, '[^a-zA-Z]', '', 'g'));
    clean_last_name := LOWER(REGEXP_REPLACE(last_name, '[^a-zA-Z]', '', 'g'));

    -- Obtener primeros 4 caracteres del UUID
    short_uuid := SUBSTRING(student_id::TEXT FROM 1 FOR 4);

    -- Formato: nombre.apellido.uuid
    RETURN CONCAT(
        SUBSTRING(clean_first_name FROM 1 FOR 8),
        '.',
        SUBSTRING(clean_last_name FROM 1 FOR 8),
        '.',
        short_uuid
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para anonimizar datos de estudiante (para investigación)
CREATE OR REPLACE FUNCTION anonymize_student_data(student_id UUID)
RETURNS TABLE(
    anonymous_id UUID,
    grade INTEGER,
    gender gender_type,
    birth_year INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.uuid_anonymous,
        s.grade,
        s.gender,
        EXTRACT(YEAR FROM s.birth_date)::INTEGER
    FROM students s
    WHERE s.id = student_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Función para calcular progreso promedio de estudiante
CREATE OR REPLACE FUNCTION calculate_student_avg_progress(student_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    avg_progress DECIMAL(5,2);
BEGIN
    SELECT AVG(score)
    INTO avg_progress
    FROM student_activity_progress
    WHERE student_id = student_id
      AND status = 'completed'
      AND score IS NOT NULL;

    RETURN COALESCE(avg_progress, 0.00);
END;
$$ LANGUAGE plpgsql STABLE;

-- Función para verificar si un estudiante está en riesgo académico
CREATE OR REPLACE FUNCTION is_student_at_risk(student_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    avg_score DECIMAL(5,2);
    last_activity TIMESTAMP;
    low_scores_count INTEGER;
BEGIN
    -- Calcular promedio reciente (últimos 10 actividades)
    SELECT AVG(score)
    INTO avg_score
    FROM (
        SELECT score
        FROM student_activity_progress
        WHERE student_id = student_id
          AND status = 'completed'
          AND score IS NOT NULL
        ORDER BY completed_at DESC
        LIMIT 10
    ) recent_activities;

    -- Obtener última actividad
    SELECT MAX(updated_at)
    INTO last_activity
    FROM student_activity_progress
    WHERE student_id = student_id;

    -- Contar evaluaciones con bajo rendimiento
    SELECT COUNT(*)
    INTO low_scores_count
    FROM student_assessments sa
    WHERE sa.student_id = student_id
      AND sa.final_theta < -1.0
      AND sa.completed_at >= NOW() - INTERVAL '30 days';

    -- Criterios de riesgo:
    -- 1. Promedio < 50 en actividades recientes
    -- 2. Sin actividad en 7+ días
    -- 3. 3+ evaluaciones con bajo rendimiento en último mes
    RETURN (
        COALESCE(avg_score, 0) < 50 OR
        last_activity < NOW() - INTERVAL '7 days' OR
        low_scores_count >= 3
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- Fin del script 02_create_extensions_and_functions.sql
-- ============================================================================
