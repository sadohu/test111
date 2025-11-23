# Análisis del Sistema Educativo Adaptativo

## 📋 Resumen Ejecutivo

Este es un **Sistema Educativo Adaptativo Multi-Colegio** que utiliza IA (Gemini AI) para personalizar ejercicios educativos basándose en perfiles psicopedagógicos de estudiantes de primaria (6-13 años). El sistema gestiona múltiples instituciones educativas (públicas y privadas) con registro centralizado de colegios, estudiantes y apoderados.

### 🎯 Características Clave

- **Sistema Multi-Colegio**: Gestión centralizada de múltiples instituciones
- **Clasificación Inteligente**: 10 dimensiones psicopedagógicas con sistema híbrido
- **Adaptación Progresiva**: Perfil inicial (40-60% confianza) → Perfil refinado (95%+ confianza)
- **Generación con IA**: Ejercicios personalizados por perfil usando Gemini AI
- **Sin Machine Learning Complejo**: Sistema de métricas y reglas (factible para MVP)
- **Escalable**: Arquitectura preparada para miles de colegios

### 📚 Documentos Técnicos de Referencia

- **`clasificador.py`**: Sistema de clasificación implementado con 10 preguntas diferenciadas por grado
- **`FACTIBILIDAD_ML_ADAPTATIVO_MVP.md`**: Análisis técnico del sistema adaptativo sin ML complejo
- **Método**: Análisis de métricas básicas (promedios, tendencias) en lugar de algoritmos complejos

## 🎯 Objetivo del Sistema

Clasificar estudiantes según sus características de aprendizaje y generar ejercicios personalizados que se adapten a:
- Estilo de aprendizaje
- Velocidad de procesamiento
- Nivel de atención
- Intereses personales
- Nivel académico actual
- Factores motivacionales

## 👥 Usuarios del Sistema

### Colegios
- **Tipos**: Públicos (con código MINEDU) y Privados
- **Datos institucionales**: RUC, razón social, UGEL
- **Representantes**: Director y Representante legal
- **Gestión**: Estado (activo, inactivo, prueba), fechas de suscripción

### Estudiantes
- **Rango de edad**: 6-13 años
- **Grados individuales**: 1°, 2°, 3°, 4°, 5°, 6° de primaria
- **Código único**: Autogenerado (formato: AL{año}{cod_colegio}{correlativo})
  - Ejemplo: `AL2502340001` (año 2025, colegio 0234, alumno 0001)
- **Cursos disponibles**: Matemáticas y Verbal

### Apoderados
- **Relación**: Padre, madre, tutor legal u otro
- **Datos completos**: DNI, contacto, dirección
- **Gestión**: Un apoderado puede tener múltiples estudiantes

## 🧩 Componentes Principales del Sistema

### 1. **Gestión de Colegios**
- Registro institucional completo
- Datos legales: RUC, razón social, UGEL
- Representantes: Director y representante legal con DNI
- Contacto: Teléfono principal, alternativo, página web, emails
- Dirección completa de la institución
- Control de estado y fechas de suscripción
- Código de colegio único (4 dígitos)

### 2. **Gestión de Apoderados**
- Información completa del tutor legal
- Datos personales: DNI, nombres, apellidos, género
- Contacto: Teléfono principal, alternativo, email
- Dirección completa
- Relación con el estudiante (padre, madre, tutor, otro)
- Fecha de nacimiento y foto (opcional)
- Un apoderado puede tener múltiples estudiantes a cargo

### 3. **Gestión de Estudiantes**
- Registro centralizado por nosotros (no por el colegio)
- Datos básicos: nombres, apellidos, DNI (opcional), género, fecha de nacimiento
- Código único autogenerado: `AL{año}{cod_colegio_4dig}{correlativo_4dig}`
  - Formato sin guiones: `AL2502340001`
  - Correlativo se reinicia cada año por colegio
- Grado individual (1° a 6°) y sección
- Foto del estudiante (opcional)
- Relación con colegio y apoderado
- Estado: activo, retirado, trasladado, egresado
- Fecha de registro en el sistema

### 4. **Sistema de Perfilamiento Psicopedagógico**

El sistema clasifica a los estudiantes en **10 dimensiones**:

| Dimensión | Valores Posibles | Descripción |
|-----------|-----------------|-------------|
| **Estilo de Aprendizaje** | visual, auditivo, kinestésico, lectoescritura | Cómo procesa mejor la información |
| **Velocidad** | lento, moderado, rápido | Ritmo de procesamiento |
| **Atención** | baja, media, alta | Capacidad de concentración |
| **Interés** | científico, deportivo, artístico, tecnológico | Áreas de motivación |
| **Nivel Matemáticas** | básico, intermedio, avanzado | Competencia actual en matemáticas |
| **Nivel Lectura** | en_desarrollo, desarrollado, avanzado | Competencia lectora |
| **Motivación** | baja, media, alta | Nivel de motivación general |
| **Frustración** | alta, moderado, resiliente | Manejo de la frustración |
| **Trabajo** | individual, colaborativo, mixto | Preferencia de trabajo |
| **Energía** | matutino, vespertino, nocturno | Momento de mayor energía |

#### Categorías de Perfil (Ejemplos del sistema)
- 🔬 **El Científico Resiliente**: Alta motivación, interés científico, resiliente
- 🏃 **El Explorador Kinestésico**: Aprende haciendo, necesita movimiento
- 🎨 **El Artista Creativo**: Lectoescritura avanzada, interés artístico

#### Sistema de Riesgo
- **Bajo**: Estudiante con desarrollo normal, pocos factores de riesgo
- **Medio**: Requiere atención moderada y ajustes pedagógicos
- **Alto**: Necesita intervención y seguimiento cercano

### 5. **Generación de Ejercicios con IA**

#### Características de los Ejercicios
- **Cursos**: Matemáticas, Verbal
- **Niveles**: Básico, Intermedio, Avanzado
- **Dificultad**: Fácil, Medio, Difícil
- **Personalización**: Adaptados al perfil del estudiante
- **Componentes**:
  - Título
  - Enunciado contextualizado
  - Opciones múltiples (JSONB)
  - Respuesta correcta
  - Explicación pedagógica
  - Operación principal
  - Apoyo visual (opcional)
  - Tags para clasificación

### 6. **Sistema de Sesiones de Práctica**

Gestiona sesiones donde los estudiantes resuelven ejercicios:
- Seguimiento de progreso (ejercicios completados vs. totales)
- Estadísticas en tiempo real (correctas, incorrectas, porcentaje)
- Control de tiempo total
- Estados: en_progreso, completada, abandonada

### 7. **Registro de Respuestas**

Almacena cada respuesta del estudiante con:
- Respuesta seleccionada
- Corrección (es_correcta)
- Tiempo de respuesta en milisegundos
- Snapshot del ejercicio (por si se elimina)
- Metadata del dispositivo/conexión

## 📊 Análisis de Datos Disponibles

### Vistas Analíticas Implementadas

#### 1. **estadisticas_estudiante**
Dashboard por estudiante mostrando:
- Perfil y categoría asignada
- Total de respuestas y porcentaje de acierto
- Sesiones totales y completadas
- Nivel de riesgo

#### 2. **ejercicios_dificiles**
Identifica ejercicios problemáticos:
- Ejercicios con bajo porcentaje de acierto
- Mínimo 5 intentos para ser estadísticamente relevante
- Útil para ajustar dificultad o mejorar enunciados

## 🔒 Seguridad y Permisos

- **Row Level Security (RLS)** activado en todas las tablas
- Políticas actuales: **permisivas** (acceso público)
- **Nota importante**: Las políticas están configuradas para desarrollo

## 🏗️ Arquitectura Técnica

### Base de Datos: PostgreSQL (Supabase)
- Extensiones: `uuid-ossp`, `pgcrypto`
- **IDs autoincrementales (SERIAL/BIGSERIAL)** como claves primarias
- Códigos de negocio únicos (código de alumno, código de colegio)
- Índices optimizados para consultas frecuentes
- Triggers automáticos para:
  - `updated_at` en todas las tablas
  - Generación automática de código de alumno
  - Cálculo de edad desde fecha de nacimiento
- Constraints para integridad de datos y relaciones

### Edge Functions Identificadas
1. `clasificar-perfil`: Procesa formulario y clasifica estudiante
2. `generar-ejercicios`: Usa Gemini AI para crear ejercicios personalizados
3. `guardar-respuesta`: Registra respuestas de estudiantes
4. `validar-respuesta`: Verifica corrección y actualiza estadísticas
5. `obtener-perfil`: Recupera perfil de un estudiante
6. `obtener-estadisticas`: Genera reportes y métricas

## 📈 Flujo de Negocio

```
1. REGISTRO DE COLEGIO
   Sistema (Admin) → Registra colegio
   → Asigna código de colegio (4 dígitos)
   → Tabla colegios

2. REGISTRO DE APODERADOS
   Sistema (Admin) → Registra apoderados
   → Datos completos del tutor
   → Tabla apoderados

3. REGISTRO DE ESTUDIANTES
   Sistema (Admin) → Recibe lista del colegio
   → Genera código automático (AL{año}{colegio}{correlativo})
   → Asocia con colegio y apoderado
   → Tabla estudiantes

4. CLASIFICACIÓN
   Formulario psicopedagógico (10 preguntas) →
   Edge Function: clasificar-perfil →
   Gemini AI analiza →
   Tabla perfiles (con recomendaciones)

5. GENERACIÓN DE EJERCICIOS
   Perfil del estudiante →
   Edge Function: generar-ejercicios →
   Gemini AI crea ejercicios personalizados →
   Tabla ejercicios_generados

6. SESIÓN DE PRÁCTICA
   Inicio sesión → Tabla sesiones (en_progreso)
   
7. RESOLUCIÓN
   Estudiante responde →
   Edge Function: validar-respuesta →
   Tabla respuestas →
   Actualiza sesiones

8. ANÁLISIS
   Edge Function: obtener-estadisticas →
   Vistas analíticas →
   Dashboard/Reportes
```

## 🎓 Casos de Uso Principales

### Para Administradores del Sistema
1. Registrar nuevos colegios (públicos y privados)
2. Gestionar datos institucionales (RUC, UGEL, representantes)
3. Asignar códigos de colegio únicos
4. Controlar estados y suscripciones
5. Importar listas de estudiantes por colegio
6. Generar códigos de alumno automáticamente
7. Gestionar apoderados y sus relaciones

### Para Docentes
1. Aplicar formulario de clasificación a estudiantes
2. Revisar perfiles y recomendaciones pedagógicas
3. Asignar sesiones de práctica personalizadas
4. Monitorear progreso y estadísticas por estudiante/grupo
5. Identificar estudiantes en riesgo
6. Analizar ejercicios problemáticos
7. Generar reportes por aula/sección

### Para Estudiantes
1. Resolver ejercicios personalizados
2. Recibir feedback inmediato
3. Practicar en sesiones estructuradas
4. Ver su progreso

### Para el Sistema
1. Generar ejercicios únicos y contextualizados
2. Adaptar dificultad según desempeño
3. Identificar patrones de aprendizaje
4. Proporcionar insights pedagógicos

## 🗄️ Esquema de Base de Datos Actualizado

### Tabla: colegios
```sql
CREATE TABLE colegios (
  id SERIAL PRIMARY KEY,
  codigo_colegio VARCHAR(4) UNIQUE NOT NULL,  -- 4 dígitos: 0001-9999
  nombre VARCHAR(255) NOT NULL,
  tipo_institucion VARCHAR(10) CHECK (tipo_institucion IN ('publica', 'privada')),
  codigo_modular VARCHAR(20),  -- Solo para públicos (MINEDU)
  
  -- Datos legales
  ruc VARCHAR(11) UNIQUE,
  razon_social VARCHAR(255),
  ugel VARCHAR(100),
  
  -- Dirección
  direccion TEXT,
  
  -- Representantes
  director_nombre VARCHAR(255),
  director_dni VARCHAR(8),
  director_email VARCHAR(255),
  representante_nombre VARCHAR(255),
  representante_dni VARCHAR(8),
  representante_email VARCHAR(255),
  
  -- Contacto
  telefono_principal VARCHAR(20),
  telefono_alternativo VARCHAR(20),
  pagina_web VARCHAR(255),
  
  -- Gestión
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'prueba')),
  fecha_registro TIMESTAMPTZ DEFAULT NOW(),
  fecha_vencimiento TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: apoderados
```sql
CREATE TABLE apoderados (
  id SERIAL PRIMARY KEY,
  
  -- Datos personales
  nombres VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  dni VARCHAR(8) UNIQUE NOT NULL,
  genero VARCHAR(10) CHECK (genero IN ('masculino', 'femenino', 'otro')),
  fecha_nacimiento DATE,
  foto_url TEXT,
  
  -- Contacto
  telefono_principal VARCHAR(20),
  telefono_alternativo VARCHAR(20),
  email VARCHAR(255),
  
  -- Dirección
  direccion TEXT,
  
  -- Gestión
  estado VARCHAR(20) DEFAULT 'activo',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: grados
```sql
CREATE TABLE grados (
  id SERIAL PRIMARY KEY,
  numero INT UNIQUE NOT NULL CHECK (numero BETWEEN 1 AND 6),
  nombre VARCHAR(50) NOT NULL,  -- "Primer Grado", "Segundo Grado", etc.
  abreviatura VARCHAR(10) NOT NULL,  -- "1°", "2°", etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO grados (numero, nombre, abreviatura) VALUES
  (1, 'Primer Grado', '1°'),
  (2, 'Segundo Grado', '2°'),
  (3, 'Tercer Grado', '3°'),
  (4, 'Cuarto Grado', '4°'),
  (5, 'Quinto Grado', '5°'),
  (6, 'Sexto Grado', '6°');
```

### Tabla: estudiantes (actualizada)
```sql
CREATE TABLE estudiantes (
  id SERIAL PRIMARY KEY,
  codigo_alumno VARCHAR(12) UNIQUE NOT NULL,  -- AL{año}{cod_colegio}{correlativo}
  
  -- Referencias
  colegio_id INT NOT NULL REFERENCES colegios(id),
  apoderado_id INT REFERENCES apoderados(id),
  grado_id INT NOT NULL REFERENCES grados(id),
  
  -- Datos personales
  nombres VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  dni VARCHAR(8),
  genero VARCHAR(10) CHECK (genero IN ('masculino', 'femenino')),
  fecha_nacimiento DATE NOT NULL,
  edad INT GENERATED ALWAYS AS (
    EXTRACT(YEAR FROM age(CURRENT_DATE, fecha_nacimiento))
  ) STORED,
  foto_url TEXT,
  
  -- Datos académicos
  seccion VARCHAR(10),  -- A, B, C, etc.
  
  -- Gestión
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'retirado', 'trasladado', 'egresado')),
  fecha_registro TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Función para generar código de alumno
CREATE OR REPLACE FUNCTION generar_codigo_alumno()
RETURNS TRIGGER AS $$
DECLARE
  year_code VARCHAR(2);
  colegio_code VARCHAR(4);
  correlativo VARCHAR(4);
  max_correlativo INT;
BEGIN
  -- Obtener año actual (2 dígitos)
  year_code := RIGHT(EXTRACT(YEAR FROM CURRENT_DATE)::TEXT, 2);
  
  -- Obtener código del colegio
  SELECT codigo_colegio INTO colegio_code FROM colegios WHERE id = NEW.colegio_id;
  
  -- Obtener el máximo correlativo del año actual para este colegio
  SELECT COALESCE(MAX(
    CAST(RIGHT(codigo_alumno, 4) AS INT)
  ), 0) INTO max_correlativo
  FROM estudiantes
  WHERE codigo_alumno LIKE 'AL' || year_code || colegio_code || '%';
  
  -- Incrementar correlativo
  correlativo := LPAD((max_correlativo + 1)::TEXT, 4, '0');
  
  -- Generar código completo
  NEW.codigo_alumno := 'AL' || year_code || colegio_code || correlativo;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar código automáticamente
CREATE TRIGGER trigger_generar_codigo_alumno
  BEFORE INSERT ON estudiantes
  FOR EACH ROW
  WHEN (NEW.codigo_alumno IS NULL)
  EXECUTE FUNCTION generar_codigo_alumno();
```

### Tabla: estudiante_apoderado (relación muchos a muchos)
```sql
CREATE TABLE estudiante_apoderado (
  id SERIAL PRIMARY KEY,
  estudiante_id INT NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
  apoderado_id INT NOT NULL REFERENCES apoderados(id) ON DELETE CASCADE,
  relacion VARCHAR(20) NOT NULL CHECK (relacion IN ('padre', 'madre', 'tutor', 'otro')),
  es_principal BOOLEAN DEFAULT FALSE,  -- Apoderado principal para notificaciones
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(estudiante_id, apoderado_id)
);
```

### Tabla: perfiles (actualizada)
```sql
CREATE TABLE perfiles (
  id SERIAL PRIMARY KEY,
  estudiante_id INT NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
  grado_id INT NOT NULL REFERENCES grados(id),

  -- Características del perfil (sin cambios)
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

  -- Metadata
  version TEXT DEFAULT '1.0.0',
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_estudiante_perfil_activo UNIQUE (estudiante_id, activo)
);
```

### Índices Importantes
```sql
-- Colegios
CREATE INDEX idx_colegios_codigo ON colegios(codigo_colegio);
CREATE INDEX idx_colegios_tipo ON colegios(tipo_institucion);
CREATE INDEX idx_colegios_estado ON colegios(estado);

-- Apoderados
CREATE INDEX idx_apoderados_dni ON apoderados(dni);
CREATE INDEX idx_apoderados_email ON apoderados(email);

-- Estudiantes
CREATE INDEX idx_estudiantes_codigo ON estudiantes(codigo_alumno);
CREATE INDEX idx_estudiantes_colegio ON estudiantes(colegio_id);
CREATE INDEX idx_estudiantes_apoderado ON estudiantes(apoderado_id);
CREATE INDEX idx_estudiantes_grado ON estudiantes(grado_id);
CREATE INDEX idx_estudiantes_estado ON estudiantes(estado);
CREATE INDEX idx_estudiantes_dni ON estudiantes(dni);

-- Estudiante-Apoderado
CREATE INDEX idx_est_apo_estudiante ON estudiante_apoderado(estudiante_id);
CREATE INDEX idx_est_apo_apoderado ON estudiante_apoderado(apoderado_id);
```

### Vistas Actualizadas
```sql
-- Vista completa de estudiantes
CREATE OR REPLACE VIEW vista_estudiantes_completa AS
SELECT 
  e.id,
  e.codigo_alumno,
  e.nombres,
  e.apellidos,
  e.dni,
  e.genero,
  e.fecha_nacimiento,
  e.edad,
  e.seccion,
  e.estado,
  
  -- Colegio
  c.nombre as colegio_nombre,
  c.tipo_institucion,
  
  -- Grado
  g.numero as grado_numero,
  g.nombre as grado_nombre,
  g.abreviatura as grado_abreviatura,
  
  -- Apoderado principal
  a.nombres as apoderado_nombres,
  a.apellidos as apoderado_apellidos,
  a.telefono_principal as apoderado_telefono,
  a.email as apoderado_email,
  ea.relacion as apoderado_relacion,
  
  -- Perfil
  p.categoria_principal,
  p.nivel_riesgo,
  p.confianza_perfil,
  
  e.fecha_registro,
  e.created_at
FROM estudiantes e
INNER JOIN colegios c ON e.colegio_id = c.id
INNER JOIN grados g ON e.grado_id = g.id
LEFT JOIN estudiante_apoderado ea ON e.id = ea.estudiante_id AND ea.es_principal = true
LEFT JOIN apoderados a ON ea.apoderado_id = a.id
LEFT JOIN perfiles p ON e.id = p.estudiante_id AND p.activo = true;
```

## 📊 Datos de Ejemplo (Seed)

### Estudiante 1: EST001 - Juan Pérez
- **Perfil**: El Científico Resiliente
- **Características**: Visual, moderado, interés científico
- **Riesgo**: Bajo (85% confianza)
- **Recomendaciones**: Organizadores visuales, experimentos, bloques de 20-25 min

### Estudiante 2: EST002 - María García
- **Perfil**: El Explorador Kinestésico
- **Características**: Kinestésico, lento, interés deportivo
- **Riesgo**: Medio (70% confianza)
- **Recomendaciones**: Actividades prácticas, permitir movimiento, manipulativos

### Estudiante 3: EST003 - Carlos López
- **Perfil**: El Artista Creativo
- **Características**: Lectoescritura, rápido, interés artístico, niveles avanzados
- **Riesgo**: Bajo (95% confianza)
- **Recomendaciones**: Lecturas complementarias, toma de notas, proyectos creativos

---

## ✅ RESPUESTAS A PREGUNTAS CLAVE - DEFINICIONES DEL PROYECTO

### 📌 Nota de Versionado
**Formato**: `vX.Y` indica la versión en la que se implementará la funcionalidad
- **Sin versión**: Se implementa en la primera versión (MVP)
- **v2.0, v3.0, v4.0, v5.0**: Versiones futuras planificadas

---

### 🎯 Estrategia y Alcance

**1. Objetivo del proyecto**
- ✅ Sistema multi-colegio (SaaS)
- Gestión centralizada de múltiples instituciones educativas

**2. Proyección de colegios y estudiantes**
- Inicialmente: **1-3 colegios piloto para MVP**
- Escalabilidad: Arquitectura preparada para crecimiento
- Definir proyección exacta según avance de implementación

---

### 👥 Roles y Autenticación

**3. Roles de usuario implementados**

| Rol | Acceso | Funcionalidades Principales |
|-----|--------|----------------------------|
| **Administrador Global** | Sistema completo | Gestión de colegios, importación masiva, configuración global |
| **Director** | Su colegio | Panel ejecutivo, métricas institucionales, reportes |
| **Docente** | Sus aulas/grados | Gestión estudiantes, asignación actividades, seguimiento (v2.0) |
| **Apoderado** | Sus hijos | Seguimiento de progreso, reportes individuales (v3.0) |
| **Estudiante** | Su perfil | Resolución de ejercicios, sesiones de práctica |

**Detalles adicionales:**
- **Coordinadores pedagógicos**: Similar a docentes con más amplitud (años y secciones generales) - v5.0
- **Auxiliares**: Incluidos como coordinadores pedagógicos - v5.0

**4. Sistema de autenticación**

**Fase v1.0 (MVP) - Correlativos simples:**
```
┌─────────────────┬───────────────────────────┬─────────────────────┐
│ Rol             │ Usuario                   │ Contraseña          │
├─────────────────┼───────────────────────────┼─────────────────────┤
│ Administrador   │ admin@sistema.com         │ Hash seguro         │
│ Director        │ DIR-{cod_colegio}-001     │ PIN o contraseña    │ -> v3.0
│ Docente         │ DOC-{cod_colegio}-001     │ PIN o contraseña    │ -> v2
│ Estudiante      │ AL2502340001              │ PIN simple (4-6 dig)│
│ Apoderado       │ DNI (12345678)            │ Contraseña          │ -> v3
└─────────────────┴───────────────────────────┴─────────────────────┘
```

**Fase v2.0+ - Dominio propio:**
- Email institucional para docentes (v10.0 - Producción real)
- SSO (Single Sign-On) opcional (v10.0)
- Sistema robusto de recuperación de contraseñas

---

### 📝 Sistema de Clasificación de Perfiles

**5. Formulario Psicopedagógico - IMPLEMENTADO**

✅ **Sistema completo en `clasificador.py`**

**Estructura del formulario:**
```
10 Preguntas Base (P1 - P10)
├─ Grado 1°-2°: 3 opciones (A, B, C)
├─ Grado 3°-4°: 4-5 opciones (A, B, C, D, E)
└─ Grado 5°-6°: Hasta 6 opciones (A, B, C, D, E, F)
```

**Mapeo automático a 10 dimensiones:**
1. **P1**: Estilo de Aprendizaje (visual, auditivo, kinestésico, multimodal)
2. **P2**: Velocidad de procesamiento (rápido, moderado, pausado)
3. **P3**: Nivel de Atención (alta, media, baja)
4. **P4**: Interés principal (artístico, deportivo, científico, literario, social, matemático)
5. **P5**: Nivel Matemáticas (avanzado, intermedio, básico)
6. **P6**: Nivel Lectura (experto, desarrollado, inicial)
7. **P7**: Motivación (alta, media, baja)
8. **P8**: Manejo de Frustración (resiliente, intermedio, sensible)
9. **P9**: Preferencia de Trabajo (independiente, colaborativo, guiado)
10. **P10**: Energía diaria (matutino, vespertino, flexible)

**Sistema de puntuación de riesgo:**
```python
# Factores de RIESGO ALTO (+3 puntos cada uno)
- Matemáticas básico: +3
- Lectura inicial: +3
- Motivación baja: +3

# Factores de RIESGO MEDIO (+2 puntos)
- Atención baja: +2
- Frustración sensible: +2

# Factores PROTECTORES (-2 puntos)
- Motivación alta: -2
- Frustración resiliente: -2
- Nivel avanzado: -1

# Clasificación final:
- >= 7 puntos: ALTO riesgo
- >= 3 puntos: MEDIO riesgo
- < 3 puntos: BAJO riesgo
```

**6. ¿Quién responde el formulario?**

✅ **Sistema flexible sin reglas específicas de tiempo/momento:**

- ✅ Docente observando al estudiante
- ✅ Apoderado desde casa
- ✅ Estudiante con asistencia
- ✅ Proceso mixto según conveniencia

**Resultado:**
- **Perfil inicial**: Confianza 40-60% (basado en autopercepción)
- **Perfil refinado**: Confianza 95%+ (después de 5 sesiones con datos objetivos)

---

### 🤖 Sistema Adaptativo e Integración con IA

**7. Configuración de Gemini AI**

✅ **Estrategia de costos para MVP:**

```
┌─────────────────────────────────────────────────────────────┐
│ FASE MVP - Optimización de Costos                          │
├─────────────────────────────────────────────────────────────┤
│ Modelo primario:   gemini-1.5-flash (tier gratuito)        │
│ Modelo alternativo: gemini-pro (si necesita mayor calidad) │
│                                                              │
│ OPTIMIZACIONES:                                              │
│ ✓ Caché de ejercicios generados (evita regeneración)       │
│ ✓ Generación en lotes nocturnos (horario económico)        │
│ ✓ Límites: Max 30 ejercicios/día por estudiante (v1.0)     │
│ ✓ Reutilización inteligente de ejercicios similares        │
└─────────────────────────────────────────────────────────────┘
```

**8. Personalización de Ejercicios - Sistema Progresivo**

✅ **Implementación por niveles:**

**NIVEL 1 - MVP (Factible y funcional):**
```javascript
// Sistema implementado con clasificador.py
{
  personalizacion: {
    dificultad: "Ajustada según perfil y desempeño real",
    contexto: "Adaptado a intereses (deportivo, científico, artístico)",
    estilo: "Según preferencia de aprendizaje",
    ejemplos: "Personalizados por perfil",
    explicaciones: "Adaptadas al nivel del estudiante"
  },
  
  // Ejemplo de prompt a Gemini:
  prompt: `
    Crea un ejercicio de matemáticas para un estudiante de 3° grado:
    - Perfil: Kinestésico, interés deportivo
    - Nivel: Intermedio en matemáticas
    - Contexto: Usar ejemplos de fútbol
    - Dificultad: Media
    - Formato: Problema con explicación paso a paso
  `
}
```

**NIVEL 2 - Con Imágenes (v2.0):**
```javascript
// Pseudocódigo de implementación
async function generarEjercicioVisual(perfil, tema) {
  // Paso 1: Generar ejercicio con Gemini
  const ejercicio = await gemini.generate({
    prompt: crearPromptPersonalizado(perfil, tema),
    incluir_descripcion_visual: true
  })
  
  // Paso 2: Si perfil es visual, generar imagen
  if (perfil.estilo === 'visual' || perfil.estilo === 'kinestesico') {
    const imagen = await generadorImagenes.crear({
      motor: 'DALL-E-3' || 'Stable Diffusion',
      descripcion: ejercicio.descripcion_visual,
      estilo: 'educativo_primaria',
      edad_objetivo: calcularEdad(perfil.grado),
      seguro_para_ninos: true
    })
    
    ejercicio.imagen_url = await subirAStorage(imagen)
  }
  
  // Paso 3: Si es kinestésico, agregar elementos interactivos
  if (perfil.estilo === 'kinestesico') {
    ejercicio.elementos_interactivos = [
      { tipo: 'arrastrar_soltar', activo: true },
      { tipo: 'click_multiple', activo: true }
    ]
  }
  
  return ejercicio
}
```

**NIVEL 3 - Totalmente Adaptativo (v3.0):**
- Diagramas interactivos generados dinámicamente
- Animaciones personalizadas por tema
- Gamificación con avatares personalizables
- Realidad aumentada (AR) para conceptos complejos

**Factibilidad técnica:**
```
✅ NIVEL 1: 100% factible (solo Gemini text)
✅ NIVEL 2: 90% factible (Gemini + API imágenes)
⚠️ NIVEL 3: 60% factible (requiere más desarrollo)
```

---

### 📚 Contenido Educativo

**9. Tipos de ejercicios por grado**

✅ **Sistema con escalado automático de dificultad:**

| Grado | Matemáticas | Verbal |
|-------|-------------|--------|
| **1°-2°** | Conteo, sumas/restas básicas, figuras geométricas simples, comparación de cantidades | Lectura básica, sílabas, vocabulario simple, comprensión literal |
| **3°-4°** | Multiplicación, división, fracciones básicas, geometría, problemas de 2 pasos | Comprensión lectora, sinónimos/antónimos, ortografía, redacción simple |
| **5°-6°** | Fracciones avanzadas, decimales, porcentajes, problemas complejos multi-paso, álgebra básica | Comprensión avanzada, analogías, inferencias, redacción estructurada |

**Sistema de escalado:**
```javascript
// Si el estudiante destaca, incrementa dificultad
if (estudiante.porcentaje_acierto > 85 && estudiante.velocidad === 'rapido') {
  nivel_siguiente = aumentarDificultad(nivel_actual)
  // Ejemplo: Si está en "intermedio", pasa a "avanzado"
  // Si está en "avanzado", agregar desafíos extra
}

// Si tiene dificultades, reduce dificultad
if (estudiante.porcentaje_acierto < 50 && estudiante.intentos > 3) {
  nivel_siguiente = reducirDificultad(nivel_actual)
  // Reforzar conceptos básicos antes de avanzar
}
```

**10. Currículo base**

- ❌ **v1.0 (MVP)**: Sin alineación a currículo oficial (contenido ficticio educativo)
- ✅ **v4.0**: Alineación con Currículo Nacional de Educación Peruana
- ✅ **v4.0**: Competencias específicas por grado según MINEDU

**Justificación:** Enfoque inicial en mecánica del sistema adaptativo. Alineación curricular es refinamiento posterior.

---

### 📊 Reportes y Analytics

**11. Sistema de reportes progresivo**

| Tipo de Reporte | Versión | Detalles |
|-----------------|---------|----------|
| Individual por estudiante | v2.0 | Progreso, fortalezas, áreas de mejora, recomendaciones |
| Grupal por grado/sección | v3.0 | Estadísticas agregadas, comparativas intra-aula |
| Comparativo entre colegios | v4.0 | Benchmarking anónimo, mejores prácticas |
| Progreso temporal | ❌ | No implementado (puede agregarse en v5.0+) |
| Exportación PDF/Excel | v3.0 | Reportes descargables para reuniones |
| Dashboard directores | v3.0 | Panel ejecutivo con KPIs institucionales |

**12. Sistema de alertas automáticas**

| Tipo de Alerta | Versión | Trigger |
|----------------|---------|---------|
| Estudiante en riesgo alto | v2.0 | `nivel_riesgo === 'alto' && porcentaje_acierto < 50%` |
| Bajo rendimiento en sesiones | v2.0 | `sesiones_abandonadas > 3 && tasa_completado < 40%` |
| Notificaciones a apoderados | v3.0 | Email/SMS automático semanal o por evento crítico |
| Alertas para docentes | v3.0 | Dashboard con estudiantes que requieren atención |
| Reportes mensuales automáticos | v3.0 | Generación y envío automático a directores |

---

### 🎮 Experiencia del Usuario

**13. Interfaz para estudiantes**

**v1.0 (MVP) - Básico funcional:**
- Diseño limpio y simple
- Colores diferenciados por edad
- Navegación intuitiva

**v2.0 - Elementos visuales:**
```
✓ Imágenes en ejercicios (si perfil es visual)
✓ Diagramas básicos
✓ Iconos y pictogramas
✓ Retroalimentación visual (✓/✗)
```

**v3.0+ - Gamificación:**
```
✓ Sistema de puntos por ejercicio completado
✓ Badges por logros (racha de 5 días, 100% acierto, etc.)
✓ Avatares personalizables
✓ Barras de progreso visuales
✓ Celebraciones animadas por logros
```

**14. Límites de tiempo en sesiones**

✅ **v2.0 - Sistema de límites adaptativos:**

```javascript
// Configuración por perfil de atención
const limitesPorPerfil = {
  atencion_baja: {
    tiempo_max_ejercicio: 5,  // minutos
    tiempo_max_sesion: 15,    // minutos
    pausas_sugeridas: 3       // cada 5 min
  },
  atencion_media: {
    tiempo_max_ejercicio: 8,
    tiempo_max_sesion: 25,
    pausas_sugeridas: 2
  },
  atencion_alta: {
    tiempo_max_ejercicio: 15,
    tiempo_max_sesion: 45,
    pausas_sugeridas: 1
  }
}

// Los estudiantes PUEDEN pausar y retomar
permitir_pausar = true
permitir_retomar = true
guardar_progreso_automatico = true
```

---

### 🔄 Flujo de Trabajo y Adaptación

**15. Creación de sesiones de práctica**

✅ **Sistema híbrido:**

```
┌──────────────────────────────────────────────────────┐
│ FLUJO DE ASIGNACIÓN DE SESIONES                     │
├──────────────────────────────────────────────────────┤
│                                                       │
│ 1. DOCENTE asigna manualmente                       │
│    ├─ Selecciona estudiantes                        │
│    ├─ Define tema/curso                             │
│    ├─ Establece cantidad de ejercicios             │
│    └─ Programa fecha/hora (opcional)                │
│                                                       │
│ 2. ESTUDIANTE inicia práctica libre                 │
│    ├─ Accede a "Modo práctica"                      │
│    ├─ Sistema genera ejercicios según perfil        │
│    └─ Sin límite de ejercicios                      │
│                                                       │
│ 3. SISTEMA genera automática (v3.0)                │
│    ├─ Detecta inactividad > 3 días                  │
│    ├─ Sugiere sesión de refuerzo                    │
│    └─ Notifica a estudiante/apoderado               │
└──────────────────────────────────────────────────────┘
```

**16. Ajuste automático ante múltiples fallos**

✅ **Sistema de adaptación en tiempo real (NO ML - Estadística simple):**

```javascript
// Monitoreo en sesión activa
async function monitore arSesion(sesion_id, estudiante_id) {
  const sesion = await obtenerSesionActiva(sesion_id)
  const ejercicios_recientes = sesion.ejercicios.slice(-5) // Últimos 5
  
  // Calcular tasa de error reciente
  const errores = ejercicios_recientes.filter(e => !e.es_correcta).length
  const tasa_error = errores / ejercicios_recientes.length
  
  // REGLA 1: Demasiados errores consecutivos
  if (tasa_error >= 0.6) { // 60%+ de errores
    await ajustarDificultad(estudiante_id, 'reducir')
    await notificarDocente({
      tipo: 'alerta_bajo_rendimiento',
      estudiante_id,
      mensaje: 'Estudiante tiene dificultades. Dificultad reducida automáticamente.'
    })
  }
  
  // REGLA 2: Demasiado fácil (acierto perfecto y rápido)
  const velocidad_promedio = calcularPromedioTiempo(ejercicios_recientes)
  const aciertos = ejercicios_recientes.filter(e => e.es_correcta).length
  
  if (aciertos === 5 && velocidad_promedio < perfil.tiempo_esperado * 0.7) {
    await ajustarDificultad(estudiante_id, 'aumentar')
  }
  
  // REGLA 3: Patrón de abandono
  if (sesion.ejercicios_abandonados >= 3) {
    await generarReporteIntervencion(estudiante_id)
    await sugerirCambioEstrategia(perfil)
  }
}

// Función de ajuste de dificultad
async function ajustarDificultad(estudiante_id, direccion) {
  const perfil = await obtenerPerfil(estudiante_id)
  
  if (direccion === 'reducir') {
    // Bajar un nivel
    const niveles = ['basico', 'intermedio', 'avanzado']
    const index_actual = niveles.indexOf(perfil.nivel_matematicas)
    
    if (index_actual > 0) {
      perfil.nivel_matematicas = niveles[index_actual - 1]
      perfil.recomendaciones.push('🔽 Dificultad reducida para reforzar conceptos base')
    }
  } else if (direccion === 'aumentar') {
    // Subir un nivel
    const niveles = ['basico', 'intermedio', 'avanzado']
    const index_actual = niveles.indexOf(perfil.nivel_matematicas)
    
    if (index_actual < niveles.length - 1) {
      perfil.nivel_matematicas = niveles[index_actual + 1]
      perfil.recomendaciones.push('🔼 Dificultad aumentada - ¡Excelente progreso!')
    }
  }
  
  await actualizarPerfil(estudiante_id, perfil)
}
```

**No se usa Machine Learning:**
- Solo estadística básica: promedios, porcentajes, conteos
- Reglas if/else basadas en umbrales
- Totalmente transparente y explicable
- Ver `FACTIBILIDAD_ML_ADAPTATIVO_MVP.md` para detalles completos

---

### 🔒 Seguridad y Privacidad

**17. Cumplimiento normativo**

✅ **Alcance definido:**
- ❌ GDPR: No aplica (sin usuarios europeos)
- ❌ COPPA: No aplica (sin usuarios de EE.UU.)
- ✅ Ley de Protección de Datos Personales del Perú (v5.0)
- ✅ Políticas institucionales del MINEDU (v5.0)

✅ **Medidas de seguridad:**
- Encriptación de contraseñas (bcrypt) - v5.0
- HTTPS obligatorio - ✅ v1.0 (Supabase y Vercel proporcionan HTTPS por defecto)
- Políticas de privacidad claras - v5.0
- Consentimiento de apoderados (formulario) - v5.0

**18. Sensibilidad de datos**

✅ **Política de datos:**
- Datos de estudiantes: **NO son anónimos** (nombre, DNI)
- Datos de análisis: **Pueden anonimizarse** para estudios agregados (v5.0)
- Datos de apoderados: **Protegidos** (no compartidos entre colegios)

❌ **No se implementa anonimización en MVP** - Se posterga para v5.0+

---

### 🚀 Timeline y Tecnologías

**19. Timeline del proyecto**

✅ **Según completación - Entre más pronto mejor**

**Fases sugeridas:**
```
MVP (v1.0):      4-6 semanas
v2.0:            +3-4 semanas
v3.0:            +4-6 semanas
v4.0:            +6-8 semanas
v5.0+:           Según necesidad
```

**Hitos críticos:**
- ✅ Schema BD: Completado
- ✅ Clasificador: Implementado (clasificador.py)
- ⏳ Backend Edge Functions: En progreso
- ⏳ Frontend: Por definir
- ⏳ Integración Gemini: Por implementar

**20. Tecnologías frontend**

⚠️ **Aún no contemplado - Opciones a evaluar:**

```
Opción A - Next.js + React
├─ Ventajas: SSR, SEO, ecosistema rico
├─ Desventajas: Curva de aprendizaje
└─ Recomendado: ✅ (para SaaS profesional)

Opción B - Vite + React
├─ Ventajas: Más simple, rápido, menor complejidad
├─ Desventajas: No SSR out-of-the-box
└─ Recomendado: ✅ (para MVP rápido)

Opción C - Vue + Nuxt
├─ Ventajas: Sintaxis simple, buena documentación
├─ Desventajas: Ecosistema más pequeño que React
└─ Recomendado: ⚠️ (si equipo conoce Vue)
```

**Decisión pendiente según:**
- Experiencia del equipo de desarrollo
- Timeline disponible
- Requisitos de SEO/performance

---

### 🏢 Gestión Multi-Colegio

**21. Importación de estudiantes**

✅ **Formatos soportados:**

```
📄 OPCIÓN 1: Excel (.xlsx)
├─ Plantilla predefinida descargable
├─ Validación de columnas requeridas
├─ Preview antes de confirmar
└─ Manejo de errores por fila

📄 OPCIÓN 2: CSV
├─ Formato estándar UTF-8
├─ Delimitador: coma (,)
├─ Texto entre comillas si contiene comas
└─ Compatible con Excel y Google Sheets
```

**Plantilla Excel:**
```
| estudiante_id* | nombres* | apellidos* | dni | genero* | fecha_nac* | grado* | seccion | apoderado_dni | apoderado_nombres | apoderado_apellidos | apoderado_tel | apoderado_email |
|----------------|----------|------------|-----|---------|------------|--------|---------|---------------|-------------------|---------------------|---------------|-----------------|
```
*Campos obligatorios

**Validaciones automáticas:**
- DNI único (si se proporciona)
- Edad coherente con grado
- Formato de fecha correcto
- Email válido (apoderado)
- Matching de apoderado por DNI (evita duplicados)

**22. Estudiantes trasladados**

✅ **Sistema híbrido según indicación del colegio (v5.0):**

```javascript
// Opciones de traslado
const opcionesTraslado = {
  
  // OPCIÓN A: Mantener historial completo
  mantener_todo: {
    perfil: 'mantener',
    historial_ejercicios: 'mantener',
    sesiones: 'mantener',
    codigo_alumno: 'mantener',
    colegio_anterior: 'visible'
  },
  
  // OPCIÓN B: Empezar de cero
  resetear: {
    perfil: 'archivar_y_recrear',
    historial_ejercicios: 'archivar',
    sesiones: 'archivar',
    codigo_alumno: 'generar_nuevo',
    colegio_anterior: 'no_visible'
  },
  
  // OPCIÓN C: Híbrido (recomendado)
  hibrido: {
    perfil: 'mantener_ajustado',  // Se re-evalúa en nuevo colegio
    historial_ejercicios: 'mantener_para_analisis',
    sesiones: 'archivar',  // No contar en estadísticas del nuevo colegio
    codigo_alumno: 'generar_nuevo',  // Nuevo código del nuevo colegio
    colegio_anterior: 'visible_solo_admin'
  }
}

// El colegio receptor decide la estrategia
```

**23. Códigos de colegio**

✅ **Asignación manual por administrador:**

```
Formato: 4 dígitos (0001 - 9999)

Estrategia de asignación:
├─ 0001-1000: Colegios públicos Lima
├─ 1001-2000: Colegios públicos provincias
├─ 2001-3000: Colegios privados Lima
├─ 3001-4000: Colegios privados provincias
└─ 4001-9999: Reserva futura/especiales

Proceso:
1. Admin revisa códigos disponibles
2. Asigna código manualmente al registrar colegio
3. Sistema valida unicidad
4. Código queda permanente (no reutilizable)
```

**24. Límites por colegio**

✅ **Sistema de planes diferenciados (v5.0):**

| Plan | Max Estudiantes | Max Docentes | Max Sesiones/Mes | Soporte |
|------|-----------------|--------------|------------------|---------|
| **Básico** | 100 | 10 | 500 | Email |
| **Premium** | 500 | 50 | 5,000 | Email + Chat |
| **Enterprise** | Ilimitado | Ilimitado | Ilimitado | Dedicado |

**Notas:**
- MVP: Sin límites (monitorear uso)
- v5.0: Implementar sistema de planes
- Facturación diferenciada público vs. privado

---

## ❓ PREGUNTAS PARA DEFINIR DETALLES

### 🎯 Estrategia y Alcance
Te especificaré v0.0 indicando el numero de la version cuando consideraremos la implementacion.
Lo que no tenga version, sera hará para primera version.

1. **¿Cuál es el objetivo principal del proyecto?**
   - ✅ **Confirmado**: Sistema multi-colegio (SaaS)
   - Gestión centralizada de múltiples instituciones
      Sí por ahora al ser un mvp será un servicio centralizado

2. **¿Cuántos colegios y estudiantes se espera gestionar?**
   - ✅ **Definido para MVP**: 1-3 colegios ficticios con 10-30 estudiantes c/u
   - Propósito: Demostración y presentación del sistema
   - Escalabilidad: Arquitectura preparada para crecimiento real futuro
   - Plan de crecimiento: Por definir según resultados de presentación MVP

### 👨‍🏫 Roles y Usuarios

3. **¿Qué roles de usuario necesitas implementar?**
   - ✅ **Confirmado**: Todos los actores tendrán accesos propios:
     - **Administradores del sistema**: Gestión global multi-colegio
     - **Directores**: Panel administrativo de su colegio
     - **Docentes**: Gestión de estudiantes y sesiones
     - **Apoderados**: Seguimiento de sus hijos
     - **Estudiantes**: Resolución de ejercicios y actividades

   - ✅ **Confirmado**: Administradores del sistema (registran colegios/estudiantes)
   - ¿Docentes tendrán acceso?
      Como docente, quiero acceder a un panel de control centralizado donde pueda visualizar el progreso de mis estudiantes, identificar alertas tempranas, asignar actividades, generar reportes y gestionar mi aula virtual, para optimizar mi tiempo, tomar decisiones pedagógicas informadas y brindar apoyo personalizado a quienes más lo necesitan. (v2.0)
   - ¿Apoderados podrán ver reportes de sus hijos?
      Sí tendrán acceso y ver reportes de todos sus hijos(v3.0)
   - ¿Directores de colegios tendrán panel administrativo?
      Como director de institución educativa, quiero acceder a un panel ejecutivo con métricas agregadas de desempeño institucional, comparativas entre grupos y tendencias a lo largo del tiempo, para tomar decisiones estratégicas, evaluar el impacto de la plataforma y presentar resultados a stakeholders.
   - ¿Coordinadores pedagógicos?
      Si se refieren a axuliares, podría ser como los profesores, solo que con más aplitud de información años y secciones generales (v3.0)

4. **¿Cómo se autenticarán los usuarios?**
   - ✅ **Plan de autenticación por fases**:
     - **v1 (MVP)**: Sistema de correlativos simple
       - Administradores: Email/contraseña del sistema
       - Docentes: Usuario correlativo por colegio (DOC001, DOC002, etc.)
       - Estudiantes: Código de alumno (AL2502340001) + PIN simple
       - Apoderados: DNI + contraseña
     - **v2+**: Migración a dominio propio con SSO
       - Email institucional para docentes
       - Autenticación federada opcional
       - Sistema de recuperación robusto

### 📝 Formulario de Clasificación

5. **¿Ya tienes definidas las 10 preguntas del formulario psicopedagógico?**
   - ¿Necesitas ayuda para crearlas?
   Te dejaré un archivo llamada clasificador.py en /docs/analsis Analisalo y especificalo en este analisis
   - ¿Son diferentes por grado individual (1° a 6°)?
   Sí son diferentes, en cuanto formularios se agrupar en parejas
   - ¿El formulario se adapta según la edad del estudiante?
   Por grado y sí se sobre entiende su edad

6. **¿Quién responde el formulario?**
   - ¿El docente observando al estudiante?
   Sí
   - ¿El apoderado desde casa?
   Sí
   - ¿El estudiante directamente (con asistencia)?
   Sí
   - ¿Es un proceso mixto?
   Sí. En conclusión no hay regla específica para el tiempo y momento específico del uso de la plataforma

### 🤖 Integración con IA

7. **¿Ya tienes configurado el API de Gemini?**
   - ¿Qué modelo planeas usar? (gemini-pro, gemini-1.5-flash, etc.)
   Gemini
   - ¿Tienes límites de cuota/presupuesto?
   Para el MVP, lo más gratuito posible

8. **¿Qué tan personalizados deben ser los ejercicios?**
   - ¿Solo ajustar dificultad?
   Ajustar dificultad al alumno además de considerar su tipo de perfil
   - ¿Cambiar contexto según intereses? (deportes, ciencia, arte)
   Sí, tambien como ejemplos y explicacion personalizada.
   - ¿Incluir elementos visuales generados?
   Se espera que sí, sin embargo, no estoy seguro si es posible (me ayudarías si puedes especificar si es posible y como es posible en pseudo)

### 📚 Contenido Educativo

9. **¿Qué tipos de ejercicios específicos necesitas por grado?**
   - **Matemáticas 1°-2°**: ¿Conteo, sumas/restas básicas, figuras?
   - **Matemáticas 3°-4°**: ¿Multiplicación, división, fracciones básicas?
   - **Matemáticas 5°-6°**: ¿Fracciones avanzadas, decimales, problemas complejos?
   - **Verbal 1°-2°**: ¿Lectura básica, sílabas, vocabulario simple?
   - **Verbal 3°-4°**: ¿Comprensión lectora, sinónimos/antónimos?
   - **Verbal 5°-6°**: ¿Comprensión avanzada, analogías, redacción?
   Todo bien de la anterior, puede puede aumentar la dificultad en caso el alumno destaque

10. **¿Tienes un currículo base o estándares educativos que seguir?**
    - ¿Currículo Nacional de Educación Peruana?
    - ¿Competencias específicas por grado individual?
    - ¿Alineado con MINEDU para colegios públicos?
    Por el momento ninguno de lo anterior, sera fictisio (v4)

### 📊 Reportes y Analytics

11. **¿Qué reportes necesitas generar?**
    - ¿Reportes individuales por estudiante?
    si (v2)
    - ¿Reportes grupales por colegio/grado/sección?
    sí (v3)
    - ¿Reportes comparativos entre colegios?
    si (v4.0)
    - ¿Reportes de progreso temporal?
    no
    - ¿Exportación a PDF/Excel?
    (v3)
    - ¿Dashboard para directores de colegio?
    (v3)

12. **¿Necesitas alertas automáticas?**
    - ¿Para estudiantes en riesgo alto?
    (v2)
    - ¿Para bajo rendimiento en sesiones?
    (v2)
    - ¿Notificaciones a apoderados por email/SMS?
    no
    - ¿Alertas para docentes?
    (v2)
    - ¿Reportes automáticos mensuales a directores?
    (v3)

### 🎮 Experiencia del Usuario

13. **¿Cómo visualizas la interfaz para estudiantes?**
    - ¿Gamificación? (puntos, badges, avatares)
    (v3)
    - ¿Colores y diseño específico por edad?
    (v4)
    - ¿Lectura de enunciados por audio para 1-2 grado?
    (v2 si fuera posible así como imagenes y diagramas)

14. **¿Las sesiones tienen límite de tiempo?**
    - ¿Tiempo máximo por ejercicio?
    sin limite de tiempo, pero si se anota el tiempo que toma para saber si intervenir y mejorar su rendimiento
    - ¿Tiempo total de sesión?
    si v2
    - ¿Los estudiantes pueden pausar y retomar?
    si v2

### 🔄 Flujo de Trabajo

15. **¿Cómo se crean las sesiones de práctica?**
    - ¿El docente las asigna manualmente?
    aun no hay sesiones v2
    - ¿Se generan automáticamente?
    si como tareas a casa
    - ¿Los estudiantes pueden iniciar práctica libre?
    si

16. **¿Qué pasa si un estudiante falla muchos ejercicios?**
    - ¿Se ajusta la dificultad automáticamente en la misma sesión?
    si v1
    - ¿Se genera un reporte para el docente?
    si v2
    - ¿Se sugiere rehacer el perfilamiento?
    se debera ajustar miestras realice las actividades(NO ML, simple estadistica)

### 🔒 Seguridad y Privacidad

17. **¿Necesitas cumplir con alguna normativa específica?**
    - ¿GDPR, COPPA (protección de menores)?
    NO (no aplica para el mercado peruano)
    - ¿Políticas institucionales?
    Sí, considerar normativas locales del MINEDU (v5.0)

18. **¿Los datos de estudiantes son sensibles?**
    - ¿Necesitas anonimización para análisis?
    Sí (para reportes agregados y estudios comparativos)
    - ¿Consentimiento de padres?
    No requerido en v1.0 (considerar para v5.0)

### 🚀 Implementación

19. **¿Cuál es el timeline del proyecto?**
    - ¿Fecha de entrega o presentación?
    10/12/2025
    - ¿Fases de implementación?
    Según completación, entre más pronto mejor

20. **¿Qué tecnologías frontend planeas usar?**
    - ¿React, Vue, Angular?
    React
    - ¿Framework específico (Next.js, Nuxt)?
    Aún no contemplado (evaluar Next.js, Vite+React según MVP)
    - ¿Mobile (React Native, Flutter)?
    Aún no contemplado (v5.0+)

### 🏢 Gestión de Colegios (Nuevas Preguntas)

21. **¿Cómo se gestionan las importaciones de estudiantes?**
    - ¿Formato de archivo? (Excel, CSV)
    ambos v2
    - ¿Plantilla específica?
    aun no
    - ¿Validaciones de datos requeridas?
    Sí, pero con flexibilidad: campos opcionales deben permitir NULL en DB
    - ¿Importación masiva o individual?
    Ambas (masiva para colegios completos, individual para casos puntuales)

22. **¿Qué pasa cuando un estudiante se traslada de colegio?**
    - ¿Mantiene su historial?
   si se copia su historial v5
    - ¿Se genera nuevo código de alumno?
    si v5
    - ¿El perfil se mantiene o se reclasifica?
   hibrido, segun la indicacion del colegio v5

23. **¿Los códigos de colegio cómo se asignan?**
    - ¿Manual por el administrador?
    manual v1
    - ¿Automático secuencial?
   si tiene codigo (como el caso de estatales, se asigna el mismo), caso de particulares automatico (v5 para ambos)
    - ¿Basado en UGEL o región?
    Ugel podría contribuir v5

24. **¿Hay límites por colegio?**
    - ¿Máximo de estudiantes por colegio?
    no hay limite
    - ¿Máximo de docentes/usuarios?
    no hay limite
    - ¿Planes diferenciados? (básico, premium, enterprise)
    los 3, v5

Tambien de Deje en la misma ruta del clasificador, el modelo de adapativo de pefil sin ML
docs/analisis/factibilidad
---

## 🤖 Sistema Adaptativo - Detalles Técnicos

### 🎯 Aclaración Importante: NO es Machine Learning Complejo

El sistema propuesto **NO utiliza Machine Learning tradicional** (redes neuronales, algoritmos supervisados, TensorFlow, PyTorch).

Es un **sistema de análisis de métricas y ajuste basado en reglas** - mucho más simple y factible para MVP.

| Machine Learning Real | Nuestro Sistema (Métricas) |
|----------------------|----------------------------|
| Requiere miles de datos de entrenamiento | Solo necesita promedios y comparaciones |
| TensorFlow, PyTorch, scikit-learn | JavaScript/Python básico |
| Complejidad: Alta | Complejidad: Baja |
| Tiempo de desarrollo: Meses | Tiempo: Días/Semanas |
| Costo computacional: Alto | Costo: Mínimo |

### 📊 Ejemplo Concreto: Caso de Carlos (8 años, 3° grado)

#### Fase 1: Perfil Inicial (Formulario)
```
Respuestas del formulario:
P1: "C" → Kinestésico
P3: "C" → Atención baja
P5: "B" → Matemáticas normales
P8: "B" → Sensible a frustración

Resultado: "Estudiante kinestésico con atención baja"
Confianza: 40% (solo autopercepción)
```

#### Fase 2: Evaluación Diagnóstica (5 ejercicios)
```
Ejercicio 1 (intermedio): ✅ 2 minutos
Ejercicio 2 (avanzado):   ❌ 1 intento
Ejercicio 3 (intermedio): ✅ 3 minutos
Ejercicio 4 (intermedio): ❌
Ejercicio 5 (básico):     ✅ 1 minuto

Resultado: 60% aciertos → Básico-Intermedio
Confianza: 70% (formulario + datos objetivos)
```

#### Fase 3: Análisis de Comportamiento (5 sesiones)
```javascript
// El sistema observa automáticamente:
Sesión 1 - Lunes 9:00 AM:
  tiempo_plataforma: 15 min
  completados: 3/8 (37%)
  abandonos_tras_error: 3/5 (60%)

Sesión 2 - Martes 2:00 PM:
  tiempo_plataforma: 22 min ⬆️
  completados: 7/10 (70%) ⬆️
  abandonos_tras_error: 1/3 (33%) ⬇️

Sesión 3 - Miércoles 9:00 AM:
  Similar a Sesión 1 (poca atención)

Sesión 4-5 - Tardes:
  Mejor rendimiento consistente
```

#### Fase 4: Sistema "Aprende" Automáticamente
```javascript
// ANÁLISIS 1: Horario de Energía
const analisisHorario = {
  mañanas: { atencion: 8 min, tasa_abandono: 0.60, completados: 0.40 },
  tardes:  { atencion: 18 min, tasa_abandono: 0.20, completados: 0.70 }
}
// ✅ CONCLUSIÓN: Carlos rinde MEJOR en tardes
//    (Contrario al formulario: "Matutino")

// ANÁLISIS 2: Manejo de Frustración
const analisisFrustracion = {
  errores_totales: 23,
  abandonos_tras_primer_error: 8,  // 35%
  reintentos_despues_error: 15,     // 65%
  ratio_resiliencia: 0.65
}
// ✅ CONCLUSIÓN: Más resiliente de lo que pensaba
//    (Formulario: "Sensible" → Real: "Intermedio")

// ANÁLISIS 3: Tipo de Contenido
const analisisContenido = {
  video_imagen: { completados: 0.80 },
  solo_texto:   { completados: 0.40 },
  interactivos: { completados: 0.90 }
}
// ✅ CONCLUSIÓN: Confirma Visual-Kinestésico
```

#### Resultado: Perfil Final Consolidado
```javascript
{
  perfil_final: {
    estilo: "Visual-Kinestésico",         // ✅ Confirmado
    horario_optimo: "Tardes (14:00-16:00)", // 📈 Corregido
    nivel_matematicas: "Básico-Intermedio",
    atencion: "15-20 minutos",             // 🎯 Medido
    frustracion: "Intermedio",             // 💪 Corregido
    confianza: 95                          // ⬆️ vs 40% inicial
  },
  
  recomendaciones_actualizadas: [
    "🕐 Agendar sesiones para las tardes (2-4 PM)",
    "🎮 Contenido interactivo y visual (90% efectividad)",
    "⏱️ Ejercicios de máximo 15 minutos",
    "🔄 Dar 2-3 intentos antes de ofrecer ayuda",
    "📱 Minimizar distracciones en mañanas"
  ]
}
```

### ⚙️ Implementación Técnica Simplificada

**Solo necesitas 3 análisis básicos:**

```python
# ANÁLISIS 1: Detectar horario óptimo
def detectar_mejor_horario(estudiante_id):
    sesiones = obtener_sesiones(estudiante_id)
    
    manana = [s for s in sesiones if s.hora < 12]
    tarde = [s for s in sesiones if s.hora >= 12]
    
    efectividad_manana = promedio([s.tasa_aciertos for s in manana])
    efectividad_tarde = promedio([s.tasa_aciertos for s in tarde])
    
    return "tarde" if efectividad_tarde > efectividad_manana else "manana"

# ANÁLISIS 2: Medir atención sostenida
def medir_atencion_real(estudiante_id):
    sesiones = obtener_sesiones(estudiante_id)
    
    tiempos = [e.duracion_minutos for s in sesiones for e in s.ejercicios]
    atencion_promedio = promedio(tiempos)
    
    if atencion_promedio > 20:
        return "alta"
    elif atencion_promedio > 10:
        return "media"
    else:
        return "baja"

# ANÁLISIS 3: Medir resiliencia
def medir_resiliencia(estudiante_id):
    ejercicios = obtener_ejercicios_con_errores(estudiante_id)
    
    errores = [e for e in ejercicios if not e.es_correcto]
    reintentos = [e for e in errores if e.siguiente_accion == "reintentar"]
    
    tasa = len(reintentos) / len(errores) if errores else 0
    
    if tasa > 0.6:
        return "resiliente"
    elif tasa > 0.3:
        return "intermedio"
    else:
        return "sensible"
```

**Eso es TODO. No hay algoritmos complejos, solo promedios y comparaciones.**

### 📋 Datos Mínimos a Capturar

Por cada ejercicio resuelto:
```javascript
{
  estudiante_id: "EST001",
  ejercicio_id: "MAT_suma_01",
  timestamp_inicio: "2025-11-21T14:30:00",
  timestamp_fin: "2025-11-21T14:32:30",
  duracion_segundos: 150,
  resultado: "correcto",  // o "incorrecto"
  intentos: 1,
  abandonado: false,
  hora_dia: 14  // Para análisis de horario
}
```

**Nada más.** Con estos datos simples, el sistema puede hacer los 3 análisis y refinar el perfil.

### 🚀 Roadmap de Implementación del Sistema Adaptativo

#### Fase MVP 1 - COMPLETADO ✅
- Formulario de clasificación (10 preguntas)
- Algoritmo de clasificación básico
- Backend con endpoints
- Almacenamiento en JSON
- Documentación completa

#### Fase MVP 2 - Semanas 3-4 (2-3 días desarrollo)
**Objetivo:** Capturar métricas de uso

```python
# Crear modelo de datos para sesiones
class MetricaEjercicio(BaseModel):
    ejercicio_id: str
    timestamp_inicio: datetime
    timestamp_fin: datetime
    duracion_segundos: int
    resultado: str  # "correcto" | "incorrecto"
    intentos: int
    abandonado: bool

# Endpoint para guardar métricas
@router.post("/sesion/metricas")
async def guardar_metricas(metricas: SesionMetricas):
    json_storage.guardar_sesion(metricas.dict())
    return {"success": True}
```

#### Fase MVP 3 - Semanas 5-6 (3-4 días desarrollo)
**Objetivo:** Analizar métricas y ajustar perfiles automáticamente

```python
# Implementar analizador de métricas
class AnalizadorMetricas:
    def analizar_estudiante(self, estudiante_id: str):
        sesiones = self.obtener_sesiones(estudiante_id, limit=5)
        
        if len(sesiones) < 5:
            return None  # No hay suficientes datos
        
        # Análisis automático
        horario = self._detectar_horario_optimo(sesiones)
        atencion = self._medir_atencion_sostenida(sesiones)
        frustracion = self._medir_resiliencia(sesiones)
        
        # Consolidar perfil refinado
        perfil_refinado = self._consolidar_perfil(
            estudiante_id, horario, atencion, frustracion
        )
        
        return perfil_refinado

# Cron job nocturno (2:00 AM)
@scheduler.scheduled_job('cron', hour=2)
async def actualizar_perfiles_diariamente():
    analizador = AnalizadorMetricas()
    estudiantes = await obtener_estudiantes_activos()
    
    for estudiante in estudiantes:
        if estudiante.sesiones_completadas >= 5:
            perfil = analizador.analizar_estudiante(estudiante.id)
            if perfil:
                await guardar_perfil_actualizado(estudiante.id, perfil)
```

#### Fase MVP 4 - Semanas 7-8 (5-6 días desarrollo)
**Objetivo:** Dashboard de visualización

- Vista de perfil con timeline
- Gráficos de evolución
- Comparación perfil inicial vs. refinado
- Alertas visuales para docentes

### 📊 Estimación de Esfuerzo

| Fase | Esfuerzo | Valor | Complejidad |
|------|----------|-------|-------------|
| MVP 1: Formulario | ✅ 1 semana | ⭐⭐⭐ Alto | 🟢 Baja |
| MVP 2: Captura métricas | 2-3 días | ⭐⭐ Medio | 🟢 Baja |
| MVP 3: Análisis automático | 3-4 días | ⭐⭐⭐⭐⭐ Muy Alto | 🟡 Media |
| MVP 4: Dashboard | 5-6 días | ⭐⭐⭐⭐ Alto | 🟡 Media |

**Total código nuevo: ~500 líneas**
**Tiempo total: 2-3 semanas**
**Valor agregado: ENORME**

### ✅ Métricas de Éxito

Sabrás que funciona cuando:
- ✅ Perfiles se actualizan automáticamente después de 5 sesiones
- ✅ Precisión sube de 40% → 95%
- ✅ Detección de horario óptimo con 85%+ acierto
- ✅ Identificación temprana de estudiantes en riesgo
- ✅ Recomendaciones basadas en datos reales

**Referencia completa:** Ver `FACTIBILIDAD_ML_ADAPTATIVO_MVP.md`

---

## 💡 Recomendaciones Iniciales

### Prioridades Sugeridas (Actualizadas)

1. **Corto Plazo (MVP)**
   - ✅ Migración de schema actualizado (colegios, apoderados, grados)
   - ⚡ Panel de administración para registro de colegios
   - ⚡ Sistema de importación masiva de estudiantes (Excel/CSV)
   - ⚡ Generación automática de códigos de alumno
   - ⚡ Implementar clasificación básica de perfiles por grado
   - ⚡ Generación de ejercicios simples con Gemini (diferenciados por grado)
   - ⚡ Sistema de respuestas y validación

2. **Mediano Plazo**
   - Dashboard administrativo (gestión de colegios)
   - Dashboard para docentes por colegio
   - Portal para apoderados (ver progreso de hijos)
   - Refinamiento de perfiles con más datos
   - Ajuste adaptativo de dificultad por grado
   - Reportes básicos por colegio/grado/sección
   - Sistema de alertas a apoderados

3. **Largo Plazo**
   - Gamificación diferenciada por edad
   - Analytics avanzados multi-colegio
   - Comparativas entre colegios/regiones
   - Sistema de recomendaciones predictivo
   - Integración con SIAGIE (MINEDU)
   - App móvil para estudiantes y apoderados
   - Sistema de facturación para colegios privados

### Consideraciones Técnicas Actualizadas

#### Base de Datos
- **IDs autoincrementales**: Usar SERIAL/BIGSERIAL correctamente
- **Trigger de código de alumno**: Manejo de concurrencia para correlativo
- **Índices compuestos**: Para queries frecuentes (colegio+grado+sección)
- **Particionamiento**: Considerar por año si el volumen crece mucho

#### Generación de Códigos
- **Unicidad garantizada**: Trigger con lock para evitar duplicados
- **Validación de año**: Reinicio automático de correlativo cada 1 de enero
- **Backup de correlativo**: Tabla auxiliar con último número usado

#### Importación Masiva
- **Validación de datos**: DNI únicos, edades coherentes con grados
- **Manejo de errores**: Reporte detallado de filas con problemas
- **Transaccionalidad**: Todo o nada (rollback si falla algún registro)
- **Asociación de apoderados**: Matching por DNI en importación

#### Seguridad
- **RLS por colegio**: Cada colegio solo ve sus datos
- **Roles diferenciados**: Admin global, admin de colegio, docente, apoderado
- **Audit log**: Registro de cambios en datos sensibles
- **GDPR/Protección de menores**: Consentimiento de apoderados

#### Performance
- **Caché de ejercicios**: Por grado y perfil para reducir llamadas a Gemini AI
- **Queue de generación**: Generar ejercicios en lotes durante la noche
- **Backup de respuestas**: Sistema crítico, necesita redundancia y réplicas
- **Monitoreo**: Logs de Edge Functions, queries lentas, uso de Gemini API
- **CDN para fotos**: Almacenamiento de fotos de estudiantes/apoderados

#### Escalabilidad
- **Multi-tenancy**: Diseño preparado para miles de colegios
- **Sharding por región**: Si crece a nivel nacional
- **Read replicas**: Para reportes y analytics sin afectar operación

---

## 📊 Ejemplo de Código de Alumno

```
Formato: AL{AA}{CCCC}{NNNN}

Ejemplo 1: AL25023400001
  - AL: Prefijo fijo
  - 25: Año 2025
  - 0234: Código del colegio "San José"
  - 0001: Primer alumno del año en ese colegio

Ejemplo 2: AL25023400150
  - AL: Prefijo fijo
  - 25: Año 2025
  - 0234: Código del colegio "San José"
  - 0150: Alumno número 150 del año en ese colegio

Ejemplo 3: AL26023400001
  - AL: Prefijo fijo
  - 26: Año 2026
  - 0234: Código del colegio "San José"
  - 0001: Correlativo reinicia en el nuevo año
```

## 🔄 Flujo de Importación de Estudiantes

```
1. PREPARACIÓN
   Administrador descarga plantilla Excel
   ├─ Columnas: nombres, apellidos, dni, fecha_nac, genero, grado, seccion
   ├─ Columnas apoderado: nombres_apo, apellidos_apo, dni_apo, telefono_apo, etc.
   └─ Colegio completa la plantilla

2. CARGA
   Administrador sube archivo Excel
   ├─ Sistema valida formato
   ├─ Valida DNIs únicos
   ├─ Valida edades vs grados
   ├─ Valida datos obligatorios
   └─ Muestra preview con errores

3. PROCESAMIENTO
   Administrador confirma importación
   ├─ Crea/encuentra apoderados por DNI
   ├─ Genera códigos de alumno automáticamente
   ├─ Inserta estudiantes en lote
   ├─ Crea relaciones estudiante-apoderado
   └─ Genera reporte de importación

4. RESULTADO
   Sistema muestra resumen
   ├─ X estudiantes importados
   ├─ Y apoderados nuevos creados
   ├─ Z apoderados existentes vinculados
   └─ Descarga PDF con códigos de alumno para el colegio
```

---

## 📝 Notas Adicionales

### Ventajas del Nuevo Diseño
✅ **Escalabilidad multi-colegio**: Gestión centralizada de múltiples instituciones
✅ **Trazabilidad completa**: Códigos únicos permiten seguimiento histórico
✅ **Flexibilidad de apoderados**: Relación muchos a muchos (tutores compartidos)
✅ **Grados individuales**: Mayor precisión en personalización por nivel
✅ **IDs autoincrementales**: Mejor performance que UUIDs para BD grandes
✅ **Separación de responsabilidades**: Admin vs. Docente vs. Apoderado

### Puntos Críticos a Resolver
⚠️ **Autenticación**: Definir flujo para cada rol
⚠️ **Frontend**: Tecnología y estructura de aplicaciones
⚠️ **Importación**: Plantilla Excel y validaciones exactas
⚠️ **Reportes**: Qué información necesita cada rol
⚠️ **Modelo de negocio**: ¿Gratis para públicos? ¿Suscripción para privados?
⚠️ **Currículo**: Alineación con MINEDU y competencias por grado

### Próximos Pasos Sugeridos
1. Responder preguntas pendientes del análisis
2. Crear nueva migración con schema actualizado
3. Actualizar seed.sql con datos de ejemplo de colegios/apoderados
4. Definir estructura de proyecto frontend
5. Crear Edge Functions actualizadas con nuevas tablas
6. Diseñar plantilla Excel para importación
7. Documentar API endpoints

