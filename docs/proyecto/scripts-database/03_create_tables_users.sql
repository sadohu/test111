-- ============================================================================
-- Script: 03_create_tables_users.sql
-- Descripción: Creación de tablas del módulo de usuarios y autenticación
-- Proyecto: Plataforma Educativa con IA
-- Versión: 1.0
-- Fecha: 2025-11-18
-- ============================================================================

-- ============================================================================
-- TABLA: users
-- Descripción: Tabla maestra de usuarios del sistema
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_email_format CHECK (validate_email(email))
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: guardians
-- Descripción: Información de tutores legales
-- ============================================================================
CREATE TABLE guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    encrypted_phone TEXT NULL,
    encrypted_dni TEXT NULL,
    relationship_to_students VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para guardians
CREATE INDEX idx_guardians_user_id ON guardians(user_id);

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_guardians_updated_at
    BEFORE UPDATE ON guardians
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: students
-- Descripción: Información de estudiantes menores de edad
-- ============================================================================
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NULL REFERENCES users(id) ON DELETE SET NULL,
    uuid_anonymous UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    grade INTEGER NOT NULL CHECK (grade BETWEEN 3 AND 6),
    gender gender_type NULL,
    simple_login_username VARCHAR(50) UNIQUE NULL,
    simple_login_pin_hashed VARCHAR(255) NULL,
    consent_timestamp TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_student_age CHECK (calculate_age(birth_date) BETWEEN 8 AND 12)
);

-- Índices para students
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_uuid_anonymous ON students(uuid_anonymous);
CREATE INDEX idx_students_grade ON students(grade);
CREATE INDEX idx_students_birth_date ON students(birth_date);

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: guardian_student_relationship
-- Descripción: Relación muchos a muchos entre tutores y estudiantes
-- ============================================================================
CREATE TABLE guardian_student_relationship (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relationship_type VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_guardian_student UNIQUE (guardian_id, student_id)
);

-- Índices para guardian_student_relationship
CREATE INDEX idx_relationship_guardian ON guardian_student_relationship(guardian_id);
CREATE INDEX idx_relationship_student ON guardian_student_relationship(student_id);
CREATE INDEX idx_relationship_primary ON guardian_student_relationship(is_primary);

-- ============================================================================
-- TABLA: teachers
-- Descripción: Información de docentes
-- ============================================================================
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para teachers
CREATE INDEX idx_teachers_user_id ON teachers(user_id);

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_teachers_updated_at
    BEFORE UPDATE ON teachers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: directors
-- Descripción: Información de directores de institución
-- ============================================================================
CREATE TABLE directors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para directors
CREATE INDEX idx_directors_user_id ON directors(user_id);

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_directors_updated_at
    BEFORE UPDATE ON directors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: administrators
-- Descripción: Información de administradores del sistema
-- ============================================================================
CREATE TABLE administrators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    access_level admin_access_level DEFAULT 'limited',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para administrators
CREATE INDEX idx_administrators_user_id ON administrators(user_id);

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_administrators_updated_at
    BEFORE UPDATE ON administrators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================
COMMENT ON TABLE users IS 'Tabla maestra de usuarios del sistema con credenciales de autenticación';
COMMENT ON TABLE guardians IS 'Información de tutores legales responsables de estudiantes menores';
COMMENT ON TABLE students IS 'Información de estudiantes menores de edad (datos mínimos para privacidad)';
COMMENT ON TABLE guardian_student_relationship IS 'Relación entre tutores y estudiantes (uno a muchos)';
COMMENT ON TABLE teachers IS 'Información de docentes del sistema';
COMMENT ON TABLE directors IS 'Información de directores de instituciones educativas';
COMMENT ON TABLE administrators IS 'Administradores del sistema con diferentes niveles de acceso';

-- ============================================================================
-- Fin del script 03_create_tables_users.sql
-- ============================================================================
