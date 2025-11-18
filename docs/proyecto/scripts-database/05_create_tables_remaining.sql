-- ============================================================================
-- Script: 05_create_tables_remaining.sql
-- Descripción: Tablas restantes del sistema (actividades, feedback, grupos, seguridad, gamificación, reportes)
-- Proyecto: Plataforma Educativa con IA
-- Versión: 1.0
-- Fecha: 2025-11-18
-- ============================================================================

-- ============================================================================
-- MÓDULO: CONTENIDOS Y ACTIVIDADES
-- ============================================================================

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    area curriculum_area NOT NULL,
    grade INTEGER NOT NULL CHECK (grade BETWEEN 3 AND 6),
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    topic VARCHAR(100) NOT NULL,
    activity_type activity_type NOT NULL,
    estimated_time_minutes INTEGER NULL CHECK (estimated_time_minutes > 0),
    content JSONB NOT NULL,
    learning_styles JSONB NULL,
    created_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_area ON activities(area);
CREATE INDEX idx_activities_grade ON activities(grade);
CREATE INDEX idx_activities_topic ON activities(topic);
CREATE INDEX idx_activities_difficulty ON activities(difficulty);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_content_gin ON activities USING GIN (content);

CREATE TRIGGER trigger_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================

CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    grade INTEGER NOT NULL CHECK (grade BETWEEN 3 AND 6),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    academic_year INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_groups_teacher ON groups(teacher_id);
CREATE INDEX idx_groups_grade ON groups(grade);
CREATE INDEX idx_groups_active ON groups(is_active);
CREATE INDEX idx_groups_year ON groups(academic_year);

CREATE TRIGGER trigger_groups_updated_at
    BEFORE UPDATE ON groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================

CREATE TABLE activity_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    assigned_to_student UUID NULL REFERENCES students(id) ON DELETE CASCADE,
    assigned_to_group UUID NULL REFERENCES groups(id) ON DELETE CASCADE,
    due_date TIMESTAMP NULL,
    custom_instructions TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT chk_assignment_target CHECK (
        (assigned_to_student IS NOT NULL AND assigned_to_group IS NULL) OR
        (assigned_to_student IS NULL AND assigned_to_group IS NOT NULL)
    )
);

CREATE INDEX idx_activity_assignments_activity_id ON activity_assignments(activity_id);
CREATE INDEX idx_activity_assignments_student ON activity_assignments(assigned_to_student);
CREATE INDEX idx_activity_assignments_group ON activity_assignments(assigned_to_group);
CREATE INDEX idx_activity_assignments_teacher ON activity_assignments(assigned_by);

-- ============================================================================

CREATE TABLE student_activity_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    assignment_id UUID NULL REFERENCES activity_assignments(id) ON DELETE SET NULL,
    status activity_status DEFAULT 'not_started',
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    time_spent_seconds INTEGER DEFAULT 0 CHECK (time_spent_seconds >= 0),
    score DECIMAL(5,2) NULL CHECK (score BETWEEN 0 AND 100),
    responses JSONB NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT unique_student_activity_assignment UNIQUE (student_id, activity_id, assignment_id)
);

CREATE INDEX idx_student_activity_progress_student ON student_activity_progress(student_id);
CREATE INDEX idx_student_activity_progress_activity ON student_activity_progress(activity_id);
CREATE INDEX idx_student_activity_progress_status ON student_activity_progress(status);
CREATE INDEX idx_student_activity_progress_completed ON student_activity_progress(completed_at);

CREATE TRIGGER trigger_student_activity_progress_updated_at
    BEFORE UPDATE ON student_activity_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MÓDULO: RETROALIMENTACIÓN
-- ============================================================================

CREATE TABLE feedback_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    activity_id UUID NULL REFERENCES activities(id) ON DELETE SET NULL,
    assessment_id UUID NULL REFERENCES student_assessments(id) ON DELETE SET NULL,
    response_id UUID NULL REFERENCES student_responses(id) ON DELETE SET NULL,
    feedback_type feedback_type NOT NULL,
    feedback_content TEXT NOT NULL,
    ai_model_used VARCHAR(50) NOT NULL,
    learning_style_adapted learning_style NULL,
    resources_recommended JSONB NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedback_logs_student ON feedback_logs(student_id);
CREATE INDEX idx_feedback_logs_activity ON feedback_logs(activity_id);
CREATE INDEX idx_feedback_logs_type ON feedback_logs(feedback_type);
CREATE INDEX idx_feedback_logs_created ON feedback_logs(created_at);

-- ============================================================================

CREATE TABLE error_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    concept VARCHAR(100) NOT NULL,
    area curriculum_area NOT NULL,
    error_count INTEGER DEFAULT 1 CHECK (error_count >= 1),
    last_occurrence TIMESTAMP DEFAULT NOW(),
    remedial_action_taken remedial_action DEFAULT 'none',
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT unique_student_concept_area UNIQUE (student_id, concept, area)
);

CREATE INDEX idx_error_patterns_student ON error_patterns(student_id);
CREATE INDEX idx_error_patterns_concept ON error_patterns(concept);
CREATE INDEX idx_error_patterns_resolved ON error_patterns(resolved);
CREATE INDEX idx_error_patterns_area ON error_patterns(area);

CREATE TRIGGER trigger_error_patterns_updated_at
    BEFORE UPDATE ON error_patterns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MÓDULO: GRUPOS
-- ============================================================================

CREATE TABLE group_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT unique_group_student UNIQUE (group_id, student_id)
);

CREATE INDEX idx_group_students_group ON group_students(group_id);
CREATE INDEX idx_group_students_student ON group_students(student_id);
CREATE INDEX idx_group_students_active ON group_students(is_active);

-- ============================================================================

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    alert_type alert_type NOT NULL,
    priority alert_priority DEFAULT 'medium',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    teacher_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP NULL
);

CREATE INDEX idx_alerts_student ON alerts(student_id);
CREATE INDEX idx_alerts_teacher ON alerts(teacher_id);
CREATE INDEX idx_alerts_priority ON alerts(priority);
CREATE INDEX idx_alerts_resolved ON alerts(is_resolved);
CREATE INDEX idx_alerts_type ON alerts(alert_type);

-- ============================================================================
-- MÓDULO: SEGURIDAD Y AUDITORÍA
-- ============================================================================

CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL,
    granted BOOLEAN DEFAULT FALSE,
    granted_at TIMESTAMP NULL,
    revoked_at TIMESTAMP NULL,
    updated_by UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT unique_student_consent_type UNIQUE (student_id, consent_type)
);

CREATE INDEX idx_consents_student ON consents(student_id);
CREATE INDEX idx_consents_guardian ON consents(guardian_id);
CREATE INDEX idx_consents_type ON consents(consent_type);
CREATE INDEX idx_consents_granted ON consents(granted);

-- ============================================================================

CREATE TABLE privacy_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_privacy_audit_log_student ON privacy_audit_log(student_id);
CREATE INDEX idx_privacy_audit_log_guardian ON privacy_audit_log(guardian_id);
CREATE INDEX idx_privacy_audit_log_created ON privacy_audit_log(created_at);

-- ============================================================================

CREATE TABLE data_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
    requested_at TIMESTAMP DEFAULT NOW(),
    scheduled_deletion_at TIMESTAMP NOT NULL,
    status deletion_status DEFAULT 'pending',
    completed_at TIMESTAMP NULL
);

CREATE INDEX idx_data_deletion_requests_student ON data_deletion_requests(student_id);
CREATE INDEX idx_data_deletion_requests_status ON data_deletion_requests(status);
CREATE INDEX idx_data_deletion_requests_scheduled ON data_deletion_requests(scheduled_deletion_at);

-- ============================================================================

CREATE TABLE active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    user_agent TEXT NULL,
    device_info JSONB NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_active_sessions_session_id ON active_sessions(session_id);
CREATE INDEX idx_active_sessions_user ON active_sessions(user_id);
CREATE INDEX idx_active_sessions_expires ON active_sessions(expires_at);

-- ============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NULL,
    resource_id UUID NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    status audit_status NOT NULL,
    details JSONB NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);

-- ============================================================================
-- MÓDULO: REPORTES Y EXPORTACIÓN
-- ============================================================================

CREATE TABLE generated_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type report_type NOT NULL,
    format export_format NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes INTEGER NULL CHECK (file_size_bytes >= 0),
    filters_applied JSONB NULL,
    generated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    download_count INTEGER DEFAULT 0 CHECK (download_count >= 0)
);

CREATE INDEX idx_generated_reports_user ON generated_reports(user_id);
CREATE INDEX idx_generated_reports_expires ON generated_reports(expires_at);
CREATE INDEX idx_generated_reports_type ON generated_reports(report_type);

-- ============================================================================

CREATE TABLE export_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(100) NOT NULL,
    filters_applied JSONB NULL,
    format VARCHAR(20) NOT NULL,
    purpose TEXT NULL,
    file_size_bytes INTEGER NULL CHECK (file_size_bytes >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_export_audit_log_user ON export_audit_log(user_id);
CREATE INDEX idx_export_audit_log_created ON export_audit_log(created_at);

-- ============================================================================
-- MÓDULO: GAMIFICACIÓN
-- ============================================================================

CREATE TABLE student_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
    weekly_points INTEGER DEFAULT 0 CHECK (weekly_points >= 0),
    monthly_points INTEGER DEFAULT 0 CHECK (monthly_points >= 0),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_student_points_student ON student_points(student_id);
CREATE INDEX idx_student_points_total ON student_points(total_points);

CREATE TRIGGER trigger_student_points_updated_at
    BEFORE UPDATE ON student_points
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================

CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NULL,
    icon_url TEXT NULL,
    category badge_category NOT NULL,
    criteria JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_badges_category ON badges(category);

-- ============================================================================

CREATE TABLE student_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT unique_student_badge UNIQUE (student_id, badge_id)
);

CREATE INDEX idx_student_badges_student ON student_badges(student_id);
CREATE INDEX idx_student_badges_badge ON student_badges(badge_id);

-- ============================================================================
-- MÓDULO: MÉTRICAS INSTITUCIONALES
-- ============================================================================

CREATE TABLE institutional_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    aggregation_level aggregation_level NOT NULL,
    aggregation_id UUID NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_institutional_metrics_name ON institutional_metrics(metric_name);
CREATE INDEX idx_institutional_metrics_date ON institutional_metrics(date);
CREATE INDEX idx_institutional_metrics_aggregation ON institutional_metrics(aggregation_level, aggregation_id);

-- ============================================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================

COMMENT ON TABLE activities IS 'Catálogo de actividades educativas disponibles en la plataforma';
COMMENT ON TABLE groups IS 'Grupos o aulas de estudiantes gestionados por docentes';
COMMENT ON TABLE activity_assignments IS 'Asignación de actividades a estudiantes o grupos por docentes';
COMMENT ON TABLE student_activity_progress IS 'Seguimiento del progreso de estudiantes en actividades';
COMMENT ON TABLE feedback_logs IS 'Registro de retroalimentación generada por IA';
COMMENT ON TABLE error_patterns IS 'Patrones de errores recurrentes identificados por IA';
COMMENT ON TABLE group_students IS 'Relación muchos a muchos entre grupos y estudiantes';
COMMENT ON TABLE alerts IS 'Alertas tempranas generadas por el sistema para docentes';
COMMENT ON TABLE consents IS 'Consentimientos de privacidad otorgados por tutores';
COMMENT ON TABLE privacy_audit_log IS 'Auditoría de cambios en configuración de privacidad';
COMMENT ON TABLE data_deletion_requests IS 'Solicitudes de eliminación de datos (derecho al olvido)';
COMMENT ON TABLE active_sessions IS 'Sesiones activas de usuarios en el sistema';
COMMENT ON TABLE audit_logs IS 'Log general de auditoría de acciones en el sistema';
COMMENT ON TABLE generated_reports IS 'Reportes generados por usuarios para exportación';
COMMENT ON TABLE export_audit_log IS 'Auditoría de exportaciones de datos';
COMMENT ON TABLE student_points IS 'Puntos acumulados por estudiantes mediante gamificación';
COMMENT ON TABLE badges IS 'Catálogo de insignias disponibles';
COMMENT ON TABLE student_badges IS 'Badges obtenidos por estudiantes';
COMMENT ON TABLE institutional_metrics IS 'Métricas agregadas para dashboard de directores';

-- ============================================================================
-- Fin del script 05_create_tables_remaining.sql
-- ============================================================================
