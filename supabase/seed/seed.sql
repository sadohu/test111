-- =====================================================
-- SEED DATA: Sistema Educativo Adaptativo
-- =====================================================
-- Datos de ejemplo para desarrollo y testing
-- =====================================================

-- Insertar estudiantes de ejemplo
INSERT INTO public.estudiantes (estudiante_id, nombre, apellido, grado, seccion, edad) VALUES
  ('EST001', 'Juan', 'Pérez', '3-4', 'A', 9),
  ('EST002', 'María', 'García', '1-2', 'B', 7),
  ('EST003', 'Carlos', 'López', '5-6', 'A', 11),
  ('EST004', 'Ana', 'Martínez', '3-4', 'B', 9),
  ('EST005', 'Luis', 'Rodríguez', '5-6', 'C', 12);

-- Insertar perfiles de ejemplo
INSERT INTO public.perfiles (
  estudiante_id, grado, estilo_aprendizaje, velocidad, atencion,
  interes, nivel_matematicas, nivel_lectura, motivacion, frustracion,
  trabajo, energia, categoria_principal, nivel_riesgo, confianza_perfil,
  recomendaciones, respuestas_originales
) VALUES
  (
    'EST001', '3-4', 'visual', 'moderado', 'media',
    'cientifico', 'intermedio', 'desarrollado', 'alta', 'resiliente',
    'colaborativo', 'matutino', 'El Científico Resiliente', 'bajo', 85,
    '["📊 Usar organizadores visuales", "🔬 Incorporar experimentos", "⏰ Bloques de 20-25 min"]'::jsonb,
    '{"P1": "A", "P2": "B", "P3": "B", "P4": "A", "P5": "B", "P6": "B", "P7": "A", "P8": "A", "P9": "B", "P10": "A"}'::jsonb
  ),
  (
    'EST002', '1-2', 'kinestesico', 'lento', 'baja',
    'deportivo', 'basico', 'en_desarrollo', 'media', 'moderado',
    'individual', 'vespertino', 'El Explorador Kinestésico', 'medio', 70,
    '["🏃 Actividades prácticas", "✋ Permitir movimiento", "🧩 Usar manipulativos"]'::jsonb,
    '{"P1": "C", "P2": "C", "P3": "C", "P4": "C", "P5": "C", "P6": "C", "P7": "B", "P8": "B", "P9": "A", "P10": "B"}'::jsonb
  ),
  (
    'EST003', '5-6', 'lectoescritura', 'rapido', 'alta',
    'artistico', 'avanzado', 'avanzado', 'alta', 'resiliente',
    'individual', 'nocturno', 'El Artista Creativo', 'bajo', 95,
    '["📚 Lecturas complementarias", "✍️ Toma de notas", "🎨 Proyectos creativos"]'::jsonb,
    '{"P1": "D", "P2": "A", "P3": "A", "P4": "B", "P5": "A", "P6": "A", "P7": "A", "P8": "A", "P9": "A", "P10": "C"}'::jsonb
  );

-- Insertar sesiones de ejemplo
INSERT INTO public.sesiones (
  sesion_id, estudiante_id, curso, cantidad_ejercicios,
  ejercicios_completados, correctas, incorrectas, estado
) VALUES
  ('SES001', 'EST001', 'matematicas', 5, 3, 2, 1, 'en_progreso'),
  ('SES002', 'EST002', 'verbal', 3, 3, 2, 1, 'completada'),
  ('SES003', 'EST003', 'matematicas', 10, 10, 9, 1, 'completada');

-- =====================================================
-- COMENTARIOS
-- =====================================================
-- Este archivo contiene datos de ejemplo para:
-- - 5 estudiantes
-- - 3 perfiles clasificados
-- - 3 sesiones de práctica
--
-- Los ejercicios se generarán dinámicamente usando
-- las Edge Functions con Gemini AI
-- =====================================================
