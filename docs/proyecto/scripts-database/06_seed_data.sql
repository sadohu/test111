-- ============================================================================
-- Script: 06_seed_data.sql
-- Descripción: Datos de prueba (seed data) para la base de datos
-- Proyecto: Plataforma Educativa con IA
-- Versión: 1.0
-- Fecha: 2025-11-18
-- ADVERTENCIA: Este script es solo para ambientes de desarrollo/testing
-- ============================================================================

-- ============================================================================
-- CONFIGURACIÓN
-- ============================================================================

-- Deshabilitar triggers temporalmente para inserción masiva
SET session_replication_role = 'replica';

-- ============================================================================
-- USUARIOS DE PRUEBA
-- ============================================================================

-- Nota: Las contraseñas hasheadas son para 'password123' usando bcrypt
-- En producción, usar contraseñas seguras y únicas

-- Administrador
INSERT INTO users (id, email, hashed_password, role, is_active, email_verified) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@plataforma.edu.pe', '$2b$10$kF.5xQV0cKxXz7rG7mPV3OZD8Hs9rqTzpB5k6L9mN8oP1qR2sT3uV', 'admin', TRUE, TRUE);

INSERT INTO administrators (id, user_id, full_name, access_level) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Carlos Administrador', 'full');

-- Director
INSERT INTO users (id, email, hashed_password, role, is_active, email_verified) VALUES
('a0000000-0000-0000-0000-000000000002', 'director@colegio.edu.pe', '$2b$10$kF.5xQV0cKxXz7rG7mPV3OZD8Hs9rqTzpB5k6L9mN8oP1qR2sT3uV', 'director', TRUE, TRUE);

INSERT INTO directors (id, user_id, full_name, institution_name, phone) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'María Directora López', 'IE San Martín de Porres', '987654321');

-- Docentes
INSERT INTO users (id, email, hashed_password, role, is_active, email_verified) VALUES
('a0000000-0000-0000-0000-000000000003', 'docente.maria@colegio.edu.pe', '$2b$10$kF.5xQV0cKxXz7rG7mPV3OZD8Hs9rqTzpB5k6L9mN8oP1qR2sT3uV', 'teacher', TRUE, TRUE),
('a0000000-0000-0000-0000-000000000004', 'docente.juan@colegio.edu.pe', '$2b$10$kF.5xQV0cKxXz7rG7mPV3OZD8Hs9rqTzpB5k6L9mN8oP1qR2sT3uV', 'teacher', TRUE, TRUE);

INSERT INTO teachers (id, user_id, full_name, specialization, phone) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'María Profesora Ramírez', 'Matemática', '987111111'),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'Juan Profesor García', 'Comunicación', '987222222');

-- Tutores/Padres
INSERT INTO users (id, email, hashed_password, role, is_active, email_verified) VALUES
('a0000000-0000-0000-0000-000000000005', 'padre1@mail.com', '$2b$10$kF.5xQV0cKxXz7rG7mPV3OZD8Hs9rqTzpB5k6L9mN8oP1qR2sT3uV', 'guardian', TRUE, TRUE),
('a0000000-0000-0000-0000-000000000006', 'madre1@mail.com', '$2b$10$kF.5xQV0cKxXz7rG7mPV3OZD8Hs9rqTzpB5k6L9mN8oP1qR2sT3uV', 'guardian', TRUE, TRUE),
('a0000000-0000-0000-0000-000000000007', 'tutor1@mail.com', '$2b$10$kF.5xQV0cKxXz7rG7mPV3OZD8Hs9rqTzpB5k6L9mN8oP1qR2sT3uV', 'guardian', TRUE, TRUE);

-- Nota: Los datos encriptados serían normalmente encriptados con una clave específica
-- Para este ejemplo, se dejan como texto plano precedidos por '[ENCRYPTED]'
INSERT INTO guardians (id, user_id, full_name, encrypted_phone, encrypted_dni, relationship_to_students) VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'Roberto Padre González', '[ENCRYPTED]987333333', '[ENCRYPTED]12345678', 'Padre'),
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 'Ana Madre Pérez', '[ENCRYPTED]987444444', '[ENCRYPTED]87654321', 'Madre'),
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000007', 'Carlos Tutor Vargas', '[ENCRYPTED]987555555', '[ENCRYPTED]11111111', 'Tutor Legal');

-- Estudiantes (login simplificado con PIN)
INSERT INTO students (id, user_id, uuid_anonymous, first_name, last_name, birth_date, grade, gender, simple_login_username, simple_login_pin_hashed, consent_timestamp) VALUES
('f0000000-0000-0000-0000-000000000001', NULL, 'f1111111-1111-1111-1111-111111111111', 'Sofía', 'González Pérez', '2014-05-15', 4, 'female', 'sofia.gonzalez.f000', '$2b$10$abcd1234', NOW()),
('f0000000-0000-0000-0000-000000000002', NULL, 'f2222222-2222-2222-2222-222222222222', 'Diego', 'González Pérez', '2013-08-22', 5, 'male', 'diego.gonzalez.f000', '$2b$10$abcd1234', NOW()),
('f0000000-0000-0000-0000-000000000003', NULL, 'f3333333-3333-3333-3333-333333333333', 'Lucía', 'Vargas Torres', '2015-03-10', 3, 'female', 'lucia.vargas.f000', '$2b$10$abcd1234', NOW()),
('f0000000-0000-0000-0000-000000000004', NULL, 'f4444444-4444-4444-4444-444444444444', 'Mateo', 'Silva Ruiz', '2014-11-30', 4, 'male', 'mateo.silva.f000', '$2b$10$abcd1234', NOW()),
('f0000000-0000-0000-0000-000000000005', NULL, 'f5555555-5555-5555-5555-555555555555', 'Valentina', 'Rojas Mendoza', '2013-07-18', 5, 'female', 'valentina.rojas.f000', '$2b$10$abcd1234', NOW());

-- Relaciones tutor-estudiante
INSERT INTO guardian_student_relationship (guardian_id, student_id, relationship_type, is_primary) VALUES
('e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Padre', TRUE),
('e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'Madre', FALSE),
('e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000002', 'Padre', TRUE),
('e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'Madre', FALSE),
('e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'Tutor Legal', TRUE);

-- ============================================================================
-- GRUPOS/AULAS
-- ============================================================================

INSERT INTO groups (id, name, grade, teacher_id, academic_year, is_active) VALUES
('g0000000-0000-0000-0000-000000000001', '4to A', 4, 'd0000000-0000-0000-0000-000000000001', 2025, TRUE),
('g0000000-0000-0000-0000-000000000002', '5to B', 5, 'd0000000-0000-0000-0000-000000000002', 2025, TRUE),
('g0000000-0000-0000-0000-000000000003', '3ro A', 3, 'd0000000-0000-0000-0000-000000000001', 2025, TRUE);

-- Asignación de estudiantes a grupos
INSERT INTO group_students (group_id, student_id, is_active) VALUES
('g0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', TRUE),
('g0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000004', TRUE),
('g0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', TRUE),
('g0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000005', TRUE),
('g0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', TRUE);

-- ============================================================================
-- PERFILES DE ESTUDIANTES
-- ============================================================================

INSERT INTO student_profiles (student_id, math_level, communication_level, learning_style_visual, learning_style_auditory, learning_style_reading, learning_style_kinesthetic, dominant_learning_style, strengths, weaknesses) VALUES
('f0000000-0000-0000-0000-000000000001', 'at_level', 'above', 40, 20, 30, 10, 'visual', '["Comprensión lectora", "Vocabulario"]', '["Operaciones con decimales"]'),
('f0000000-0000-0000-0000-000000000002', 'above', 'at_level', 25, 35, 15, 25, 'auditory', '["Resolución de problemas", "Razonamiento lógico"]', '["Producción textual"]'),
('f0000000-0000-0000-0000-000000000003', 'below', 'at_level', 30, 20, 40, 10, 'reading', '["Lectura fluida"]', '["Operaciones básicas", "Problemas matemáticos"]'),
('f0000000-0000-0000-0000-000000000004', 'at_level', 'at_level', 20, 15, 25, 40, 'kinesthetic', '["Geometría práctica"]', '["Comprensión de textos largos"]'),
('f0000000-0000-0000-0000-000000000005', 'above', 'above', 35, 30, 25, 10, 'visual', '["Todos los temas"]', '[]');

-- ============================================================================
-- GAMIFICACIÓN: BADGES
-- ============================================================================

INSERT INTO badges (name, description, icon_url, category, criteria) VALUES
('Primer Paso', 'Completa tu primera actividad', '/badges/primer-paso.png', 'achievement', '{"activities_completed": 1}'),
('Perseverante', 'Intenta resolver un problema más de 3 veces', '/badges/perseverante.png', 'perseverance', '{"attempts": 3}'),
('Perfeccionista', 'Responde correctamente al primer intento en 5 actividades consecutivas', '/badges/perfeccionista.png', 'excellence', '{"consecutive_perfect": 5}'),
('Curioso', 'Consulta 10 recursos complementarios', '/badges/curioso.png', 'curiosity', '{"resources_viewed": 10}'),
('Maestro Matemático', 'Alcanza nivel "above" en Matemática', '/badges/maestro-matematico.png', 'excellence', '{"math_level": "above"}'),
('Experto Lector', 'Alcanza nivel "above" en Comunicación', '/badges/experto-lector.png', 'excellence', '{"communication_level": "above"}');

-- Asignar badges a estudiantes
INSERT INTO student_badges (student_id, badge_id) VALUES
('f0000000-0000-0000-0000-000000000001', (SELECT id FROM badges WHERE name = 'Primer Paso')),
('f0000000-0000-0000-0000-000000000002', (SELECT id FROM badges WHERE name = 'Primer Paso')),
('f0000000-0000-0000-0000-000000000002', (SELECT id FROM badges WHERE name = 'Maestro Matemático')),
('f0000000-0000-0000-0000-000000000005', (SELECT id FROM badges WHERE name = 'Perfeccionista'));

-- Puntos de estudiantes
INSERT INTO student_points (student_id, total_points, weekly_points, monthly_points) VALUES
('f0000000-0000-0000-0000-000000000001', 350, 80, 350),
('f0000000-0000-0000-0000-000000000002', 520, 120, 520),
('f0000000-0000-0000-0000-000000000003', 180, 40, 180),
('f0000000-0000-0000-0000-000000000004', 290, 60, 290),
('f0000000-0000-0000-0000-000000000005', 670, 150, 670);

-- ============================================================================
-- CONSENTIMIENTOS DE PRIVACIDAD
-- ============================================================================

INSERT INTO consents (student_id, guardian_id, consent_type, granted, granted_at, updated_by) VALUES
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'academic_data_collection', TRUE, NOW(), 'e0000000-0000-0000-0000-000000000001'),
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'ai_personalization', TRUE, NOW(), 'e0000000-0000-0000-0000-000000000001'),
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'share_with_teachers', TRUE, NOW(), 'e0000000-0000-0000-0000-000000000001'),
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'share_with_director', TRUE, NOW(), 'e0000000-0000-0000-0000-000000000001'),
('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'anonymous_research', FALSE, NULL, 'e0000000-0000-0000-0000-000000000001'),
('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'academic_data_collection', TRUE, NOW(), 'e0000000-0000-0000-0000-000000000001'),
('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'ai_personalization', TRUE, NOW(), 'e0000000-0000-0000-0000-000000000001');

-- ============================================================================
-- ACTIVIDADES DE EJEMPLO
-- ============================================================================

INSERT INTO activities (id, title, description, area, grade, difficulty, topic, activity_type, estimated_time_minutes, content, learning_styles, is_active) VALUES
('h0000000-0000-0000-0000-000000000001', 'Suma de fracciones con igual denominador', 'Practica la suma de fracciones con el mismo denominador', 'math', 4, 2, 'Fracciones', 'exercise', 15, '{"questions": [{"id": 1, "question": "1/4 + 2/4 = ?", "options": ["3/4", "3/8", "1/2"], "correct": "3/4"}]}', '["visual", "kinesthetic"]', TRUE),
('h0000000-0000-0000-0000-000000000002', 'Comprensión lectora: El zorro y las uvas', 'Lee la fábula y responde preguntas', 'communication', 3, 2, 'Comprensión Lectora', 'reading', 20, '{"text": "Un zorro vio unas uvas...", "questions": [{"id": 1, "question": "¿Por qué el zorro dijo que las uvas estaban verdes?"}]}', '["reading", "visual"]', TRUE),
('h0000000-0000-0000-0000-000000000003', 'Multiplicación por 2 cifras', 'Practica multiplicaciones con números de 2 cifras', 'math', 5, 3, 'Multiplicación', 'exercise', 25, '{"questions": [{"id": 1, "question": "23 × 15 = ?"}]}', '["visual", "kinesthetic"]', TRUE);

-- ============================================================================
-- ÍTEMS DE EVALUACIÓN DE EJEMPLO
-- ============================================================================

INSERT INTO assessment_items (area, grade, difficulty, discrimination, item_type, content, correct_answer, topic) VALUES
('math', 4, 1, 0.75, 'multiple_choice', '{"question": "¿Cuánto es 5 + 3?", "options": ["6", "7", "8", "9"]}', '8', 'Suma'),
('math', 4, 2, 0.80, 'multiple_choice', '{"question": "¿Cuánto es 12 × 4?", "options": ["44", "46", "48", "50"]}', '48', 'Multiplicación'),
('communication', 4, 1, 0.70, 'multiple_choice', '{"question": "¿Cuál es el sinónimo de \"feliz\"?", "options": ["triste", "alegre", "enojado", "cansado"]}', 'alegre', 'Vocabulario'),
('communication', 5, 3, 0.85, 'open_ended', '{"question": "Escribe un párrafo describiendo tu lugar favorito"}', 'N/A', 'Producción Textual');

-- ============================================================================
-- FINALIZACIÓN
-- ============================================================================

-- Habilitar triggers nuevamente
SET session_replication_role = 'origin';

-- ============================================================================
-- RESUMEN DE DATOS INSERTADOS
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'SEED DATA COMPLETADO EXITOSAMENTE';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Usuarios creados: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE 'Estudiantes: %', (SELECT COUNT(*) FROM students);
    RAISE NOTICE 'Tutores: %', (SELECT COUNT(*) FROM guardians);
    RAISE NOTICE 'Docentes: %', (SELECT COUNT(*) FROM teachers);
    RAISE NOTICE 'Grupos: %', (SELECT COUNT(*) FROM groups);
    RAISE NOTICE 'Actividades: %', (SELECT COUNT(*) FROM activities);
    RAISE NOTICE 'Badges: %', (SELECT COUNT(*) FROM badges);
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Credenciales de prueba:';
    RAISE NOTICE 'Admin: admin@plataforma.edu.pe / password123';
    RAISE NOTICE 'Docente: docente.maria@colegio.edu.pe / password123';
    RAISE NOTICE 'Tutor: padre1@mail.com / password123';
    RAISE NOTICE '============================================';
END $$;

-- ============================================================================
-- Fin del script 06_seed_data.sql
-- ============================================================================
