-- =====================================================
-- MIGRACIÓN INICIAL: Sistema Educativo Adaptativo
-- =====================================================
-- Descripción: Crea el esquema inicial de base de datos
-- para el sistema de clasificación de perfiles y
-- generación de ejercicios adaptativos
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLA: estudiantes
-- Almacena información básica de los estudiantes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.estudiantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estudiante_id TEXT UNIQUE NOT NULL,
  nombre TEXT,
  apellido TEXT,
  grado TEXT NOT NULL CHECK (grado IN ('1-2', '3-4', '5-6')),
  seccion TEXT,
  edad INTEGER CHECK (edad >= 6 AND edad <= 13),
  fecha_registro TIMESTAMPTZ DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para estudiantes
CREATE INDEX idx_estudiantes_estudiante_id ON public.estudiantes(estudiante_id);
CREATE INDEX idx_estudiantes_grado ON public.estudiantes(grado);
CREATE INDEX idx_estudiantes_activo ON public.estudiantes(activo);

-- =====================================================
-- TABLA: perfiles
-- Almacena los perfiles clasificados de estudiantes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estudiante_id TEXT NOT NULL REFERENCES public.estudiantes(estudiante_id) ON DELETE CASCADE,
  grado TEXT NOT NULL CHECK (grado IN ('1-2', '3-4', '5-6')),

  -- Características del perfil
  estilo_aprendizaje TEXT NOT NULL,
  velocidad TEXT NOT NULL,
  atencion TEXT NOT NULL,
  interes TEXT NOT NULL,
  nivel_matematicas TEXT NOT NULL,
  nivel_lectura TEXT NOT NULL,
  motivacion TEXT NOT NULL,
  frustracion TEXT NOT NULL,
  trabajo TEXT NOT NULL,
  energia TEXT NOT NULL,

  -- Clasificación y riesgo
  categoria_principal TEXT NOT NULL,
  nivel_riesgo TEXT NOT NULL CHECK (nivel_riesgo IN ('bajo', 'medio', 'alto')),
  confianza_perfil INTEGER CHECK (confianza_perfil >= 0 AND confianza_perfil <= 100),

  -- Recomendaciones y respuestas
  recomendaciones JSONB DEFAULT '[]',
  respuestas_originales JSONB NOT NULL,

  -- Metadata y timestamps
  version TEXT DEFAULT '1.0.0',
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_estudiante_perfil_activo UNIQUE (estudiante_id, activo)
);

-- Índices para perfiles
CREATE INDEX idx_perfiles_estudiante_id ON public.perfiles(estudiante_id);
CREATE INDEX idx_perfiles_nivel_riesgo ON public.perfiles(nivel_riesgo);
CREATE INDEX idx_perfiles_categoria ON public.perfiles(categoria_principal);
CREATE INDEX idx_perfiles_grado ON public.perfiles(grado);
CREATE INDEX idx_perfiles_activo ON public.perfiles(activo);

-- =====================================================
-- TABLA: ejercicios_generados
-- Almacena ejercicios generados por Gemini AI
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ejercicios_generados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ejercicio_id TEXT UNIQUE NOT NULL,
  estudiante_id TEXT REFERENCES public.estudiantes(estudiante_id) ON DELETE SET NULL,

  -- Información del ejercicio
  curso TEXT NOT NULL CHECK (curso IN ('matematicas', 'verbal')),
  tipo TEXT NOT NULL,
  nivel TEXT NOT NULL CHECK (nivel IN ('basico', 'intermedio', 'avanzado')),
  dificultad TEXT CHECK (dificultad IN ('facil', 'medio', 'dificil')),

  -- Contenido del ejercicio
  titulo TEXT NOT NULL,
  enunciado TEXT NOT NULL,
  opciones JSONB NOT NULL,
  respuesta_correcta TEXT NOT NULL,
  explicacion TEXT,

  -- Metadata adicional
  contexto TEXT,
  operacion_principal TEXT,
  incluye_visual BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]',

  -- Perfil usado para generar
  perfil_usado JSONB,

  -- Timestamps
  fecha_generacion TIMESTAMPTZ DEFAULT NOW(),
  usado BOOLEAN DEFAULT FALSE,
  fecha_uso TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para ejercicios_generados
CREATE INDEX idx_ejercicios_ejercicio_id ON public.ejercicios_generados(ejercicio_id);
CREATE INDEX idx_ejercicios_estudiante_id ON public.ejercicios_generados(estudiante_id);
CREATE INDEX idx_ejercicios_curso ON public.ejercicios_generados(curso);
CREATE INDEX idx_ejercicios_nivel ON public.ejercicios_generados(nivel);
CREATE INDEX idx_ejercicios_tipo ON public.ejercicios_generados(tipo);
CREATE INDEX idx_ejercicios_usado ON public.ejercicios_generados(usado);

-- =====================================================
-- TABLA: respuestas
-- Almacena las respuestas de los estudiantes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.respuestas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  respuesta_id TEXT UNIQUE NOT NULL,

  -- Referencias
  estudiante_id TEXT NOT NULL REFERENCES public.estudiantes(estudiante_id) ON DELETE CASCADE,
  ejercicio_id TEXT REFERENCES public.ejercicios_generados(ejercicio_id) ON DELETE SET NULL,
  sesion_id TEXT,

  -- Información de la respuesta
  curso TEXT NOT NULL CHECK (curso IN ('matematicas', 'verbal')),
  respuesta_seleccionada TEXT NOT NULL,
  es_correcta BOOLEAN NOT NULL,
  tiempo_respuesta_ms INTEGER,

  -- Ejercicio snapshot (por si el ejercicio se elimina)
  ejercicio_snapshot JSONB,

  -- Metadata
  dispositivo TEXT,
  ip_address INET,
  user_agent TEXT,

  -- Timestamps
  fecha_respuesta TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para respuestas
CREATE INDEX idx_respuestas_respuesta_id ON public.respuestas(respuesta_id);
CREATE INDEX idx_respuestas_estudiante_id ON public.respuestas(estudiante_id);
CREATE INDEX idx_respuestas_ejercicio_id ON public.respuestas(ejercicio_id);
CREATE INDEX idx_respuestas_sesion_id ON public.respuestas(sesion_id);
CREATE INDEX idx_respuestas_curso ON public.respuestas(curso);
CREATE INDEX idx_respuestas_correcta ON public.respuestas(es_correcta);
CREATE INDEX idx_respuestas_fecha ON public.respuestas(fecha_respuesta);

-- =====================================================
-- TABLA: sesiones
-- Almacena las sesiones de práctica de los estudiantes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.sesiones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesion_id TEXT UNIQUE NOT NULL,
  estudiante_id TEXT NOT NULL REFERENCES public.estudiantes(estudiante_id) ON DELETE CASCADE,

  -- Información de la sesión
  curso TEXT NOT NULL CHECK (curso IN ('matematicas', 'verbal')),
  cantidad_ejercicios INTEGER NOT NULL,
  ejercicios_completados INTEGER DEFAULT 0,

  -- Estadísticas
  correctas INTEGER DEFAULT 0,
  incorrectas INTEGER DEFAULT 0,
  porcentaje_acierto NUMERIC(5,2),
  tiempo_total_ms BIGINT DEFAULT 0,

  -- Estado
  estado TEXT DEFAULT 'en_progreso' CHECK (estado IN ('en_progreso', 'completada', 'abandonada')),

  -- Timestamps
  fecha_inicio TIMESTAMPTZ DEFAULT NOW(),
  fecha_fin TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para sesiones
CREATE INDEX idx_sesiones_sesion_id ON public.sesiones(sesion_id);
CREATE INDEX idx_sesiones_estudiante_id ON public.sesiones(estudiante_id);
CREATE INDEX idx_sesiones_curso ON public.sesiones(curso);
CREATE INDEX idx_sesiones_estado ON public.sesiones(estado);
CREATE INDEX idx_sesiones_fecha_inicio ON public.sesiones(fecha_inicio);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_estudiantes_updated_at
  BEFORE UPDATE ON public.estudiantes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_perfiles_updated_at
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ejercicios_updated_at
  BEFORE UPDATE ON public.ejercicios_generados
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sesiones_updated_at
  BEFORE UPDATE ON public.sesiones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ejercicios_generados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesiones ENABLE ROW LEVEL SECURITY;

-- Políticas para estudiantes (por ahora permisivas, ajustar según autenticación)
CREATE POLICY "Allow public read access to estudiantes"
  ON public.estudiantes FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to estudiantes"
  ON public.estudiantes FOR INSERT
  WITH CHECK (true);

-- Políticas para perfiles
CREATE POLICY "Allow public read access to perfiles"
  ON public.perfiles FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to perfiles"
  ON public.perfiles FOR INSERT
  WITH CHECK (true);

-- Políticas para ejercicios_generados
CREATE POLICY "Allow public read access to ejercicios"
  ON public.ejercicios_generados FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to ejercicios"
  ON public.ejercicios_generados FOR INSERT
  WITH CHECK (true);

-- Políticas para respuestas
CREATE POLICY "Allow public read access to respuestas"
  ON public.respuestas FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to respuestas"
  ON public.respuestas FOR INSERT
  WITH CHECK (true);

-- Políticas para sesiones
CREATE POLICY "Allow public read access to sesiones"
  ON public.sesiones FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to sesiones"
  ON public.sesiones FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to sesiones"
  ON public.sesiones FOR UPDATE
  USING (true);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de estadísticas por estudiante
CREATE OR REPLACE VIEW public.estadisticas_estudiante AS
SELECT
  e.estudiante_id,
  e.nombre,
  e.apellido,
  e.grado,
  p.categoria_principal,
  p.nivel_riesgo,
  COUNT(DISTINCT r.id) as total_respuestas,
  COUNT(DISTINCT CASE WHEN r.es_correcta THEN r.id END) as respuestas_correctas,
  ROUND(
    COUNT(DISTINCT CASE WHEN r.es_correcta THEN r.id END)::NUMERIC /
    NULLIF(COUNT(DISTINCT r.id), 0) * 100,
    2
  ) as porcentaje_acierto,
  COUNT(DISTINCT s.id) as total_sesiones,
  COUNT(DISTINCT CASE WHEN s.estado = 'completada' THEN s.id END) as sesiones_completadas
FROM public.estudiantes e
LEFT JOIN public.perfiles p ON e.estudiante_id = p.estudiante_id AND p.activo = true
LEFT JOIN public.respuestas r ON e.estudiante_id = r.estudiante_id
LEFT JOIN public.sesiones s ON e.estudiante_id = s.estudiante_id
GROUP BY e.estudiante_id, e.nombre, e.apellido, e.grado, p.categoria_principal, p.nivel_riesgo;

-- Vista de ejercicios más difíciles
CREATE OR REPLACE VIEW public.ejercicios_dificiles AS
SELECT
  eg.ejercicio_id,
  eg.titulo,
  eg.curso,
  eg.tipo,
  eg.nivel,
  COUNT(r.id) as total_intentos,
  COUNT(CASE WHEN r.es_correcta THEN 1 END) as aciertos,
  ROUND(
    COUNT(CASE WHEN r.es_correcta THEN 1 END)::NUMERIC /
    NULLIF(COUNT(r.id), 0) * 100,
    2
  ) as porcentaje_acierto
FROM public.ejercicios_generados eg
LEFT JOIN public.respuestas r ON eg.ejercicio_id = r.ejercicio_id
GROUP BY eg.ejercicio_id, eg.titulo, eg.curso, eg.tipo, eg.nivel
HAVING COUNT(r.id) >= 5
ORDER BY porcentaje_acierto ASC;

-- =====================================================
-- COMENTARIOS EN TABLAS
-- =====================================================

COMMENT ON TABLE public.estudiantes IS 'Información básica de los estudiantes del sistema';
COMMENT ON TABLE public.perfiles IS 'Perfiles clasificados de estudiantes basados en formularios psicopedagógicos';
COMMENT ON TABLE public.ejercicios_generados IS 'Ejercicios generados por Gemini AI personalizados por estudiante';
COMMENT ON TABLE public.respuestas IS 'Respuestas de estudiantes a ejercicios';
COMMENT ON TABLE public.sesiones IS 'Sesiones de práctica de estudiantes';

-- =====================================================
-- FIN DE LA MIGRACIÓN
-- =====================================================
