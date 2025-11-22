# Diagrama de Base de Datos - Sistema Educativo Adaptativo

## 📊 Diagrama de Relaciones (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SISTEMA MULTI-COLEGIO                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│     COLEGIOS        │
├─────────────────────┤
│ id (PK)            │
│ codigo_colegio (UK)│ ────┐
│ nombre             │     │
│ tipo_institucion   │     │
│ codigo_modular     │     │
│ ruc                │     │
│ razon_social       │     │
│ ugel               │     │
│ direccion          │     │
│ director_*         │     │
│ representante_*    │     │
│ telefono_*         │     │
│ pagina_web         │     │
│ estado             │     │
│ fecha_registro     │     │
│ fecha_vencimiento  │     │
└─────────────────────┘     │
                            │
                            │ 1:N
                            │
┌─────────────────────┐     │        ┌─────────────────────┐
│      GRADOS         │     │        │    ESTUDIANTES      │
├─────────────────────┤     │        ├─────────────────────┤
│ id (PK)            │────┐ │        │ id (PK)            │
│ numero (UK)        │    │ └────────│ colegio_id (FK)    │
│ nombre             │    │ 1:N      │ codigo_alumno (UK) │◄────┐
│ abreviatura        │    │          │ apoderado_id (FK)  │     │
└─────────────────────┘    │          │ grado_id (FK)      │─────┘
                           │          │ nombres            │
                           │          │ apellidos          │
                           │          │ dni                │
                           │          │ genero             │
                           └──────────│ fecha_nacimiento   │
                               N:1    │ edad (GENERATED)   │
                                      │ foto_url           │
                                      │ seccion            │
                                      │ estado             │
                                      │ fecha_registro     │
                                      └─────────────────────┘
                                               │
                                               │
                                               │ N:M
                                               │
                           ┌───────────────────┴───────────────────┐
                           │                                       │
                           ▼                                       ▼
┌─────────────────────┐   ┌──────────────────────────┐   ┌─────────────────────┐
│    APODERADOS       │   │ ESTUDIANTE_APODERADO     │   │     PERFILES        │
├─────────────────────┤   ├──────────────────────────┤   ├─────────────────────┤
│ id (PK)            │◄──│ id (PK)                  │   │ id (PK)            │
│ nombres            │   │ estudiante_id (FK)       │   │ estudiante_id (FK) │
│ apellidos          │   │ apoderado_id (FK)        │   │ grado_id (FK)      │
│ dni (UK)           │   │ relacion                 │   │ estilo_aprendizaje │
│ genero             │   │ es_principal             │   │ velocidad          │
│ fecha_nacimiento   │   └──────────────────────────┘   │ atencion           │
│ foto_url           │                                   │ interes            │
│ telefono_principal │                                   │ nivel_matematicas  │
│ telefono_alternativo│                                  │ nivel_lectura      │
│ email              │                                   │ motivacion         │
│ direccion          │                                   │ frustracion        │
│ estado             │                                   │ trabajo            │
└─────────────────────┘                                  │ energia            │
                                                         │ categoria_principal│
                                                         │ nivel_riesgo       │
                                                         │ confianza_perfil   │
                                                         │ recomendaciones    │
                                                         │ respuestas_orig    │
                                                         │ activo             │
                                                         └─────────────────────┘
                                                                  │
                                                                  │ 1:1
                                                                  │
                                                                  ▼
                                      ┌───────────────────────────────────────┐
                                      │                                       │
                                      │         SISTEMA DE PRÁCTICA           │
                                      │                                       │
                                      └───────────────────────────────────────┘
                                                       │
                                   ┌───────────────────┼───────────────────┐
                                   │                   │                   │
                                   ▼                   ▼                   ▼
                    ┌─────────────────────┐ ┌─────────────────────┐ ┌──────────────────┐
                    │     SESIONES        │ │ EJERCICIOS_GENERADOS│ │   RESPUESTAS     │
                    ├─────────────────────┤ ├─────────────────────┤ ├──────────────────┤
                    │ id (PK)            │ │ id (PK)            │ │ id (PK)         │
                    │ sesion_id (UK)     │ │ ejercicio_id (UK)  │ │ respuesta_id(UK)│
                    │ estudiante_id (FK) │ │ estudiante_id (FK) │ │ estudiante_id(FK)│
                    │ curso              │ │ curso              │ │ ejercicio_id(FK)│
                    │ cantidad_ejercicios│ │ tipo               │ │ sesion_id      │
                    │ ejercicios_complet.│ │ nivel              │ │ curso          │
                    │ correctas          │ │ dificultad         │ │ respuesta_sel  │
                    │ incorrectas        │ │ titulo             │ │ es_correcta    │
                    │ porcentaje_acierto │ │ enunciado          │ │ tiempo_resp_ms │
                    │ tiempo_total_ms    │ │ opciones (JSONB)   │ │ ejercicio_snap │
                    │ estado             │ │ respuesta_correcta │ │ fecha_respuesta│
                    │ fecha_inicio       │ │ explicacion        │ └──────────────────┘
                    │ fecha_fin          │ │ contexto           │
                    └─────────────────────┘ │ operacion_principal│
                                            │ incluye_visual     │
                                            │ tags (JSONB)       │
                                            │ perfil_usado (JSONB)│
                                            │ usado              │
                                            │ fecha_generacion   │
                                            └─────────────────────┘
```

## 🔑 Claves y Relaciones

### Relaciones Principales

1. **COLEGIOS → ESTUDIANTES** (1:N)
   - Un colegio tiene múltiples estudiantes
   - Un estudiante pertenece a un solo colegio (actualmente)

2. **GRADOS → ESTUDIANTES** (1:N)
   - Un grado tiene múltiples estudiantes
   - Un estudiante está en un grado específico

3. **ESTUDIANTES ↔ APODERADOS** (N:M)
   - Un estudiante puede tener múltiples apoderados (padre, madre, tutor)
   - Un apoderado puede tener múltiples estudiantes (hermanos)
   - Tabla intermedia: `estudiante_apoderado`

4. **ESTUDIANTES → PERFILES** (1:1)
   - Un estudiante tiene un perfil activo
   - Histórico de perfiles con campo `activo`

5. **ESTUDIANTES → SESIONES** (1:N)
   - Un estudiante tiene múltiples sesiones de práctica

6. **ESTUDIANTES → EJERCICIOS_GENERADOS** (1:N)
   - Ejercicios personalizados para un estudiante específico

7. **ESTUDIANTES → RESPUESTAS** (1:N)
   - Un estudiante tiene múltiples respuestas registradas

8. **EJERCICIOS_GENERADOS → RESPUESTAS** (1:N)
   - Un ejercicio puede ser respondido múltiples veces

## 📋 Índices Críticos

### Por Performance
```sql
-- Búsqueda de estudiantes por colegio y grado
CREATE INDEX idx_estudiantes_colegio_grado ON estudiantes(colegio_id, grado_id);

-- Búsqueda de estudiantes por código
CREATE INDEX idx_estudiantes_codigo ON estudiantes(codigo_alumno);

-- Apoderados de un estudiante
CREATE INDEX idx_est_apo_estudiante ON estudiante_apoderado(estudiante_id);

-- Estudiantes de un apoderado
CREATE INDEX idx_est_apo_apoderado ON estudiante_apoderado(apoderado_id);

-- Perfil activo de un estudiante
CREATE INDEX idx_perfiles_estudiante_activo ON perfiles(estudiante_id, activo);

-- Sesiones de un estudiante
CREATE INDEX idx_sesiones_estudiante ON sesiones(estudiante_id);

-- Ejercicios por estudiante y curso
CREATE INDEX idx_ejercicios_estudiante_curso ON ejercicios_generados(estudiante_id, curso);

-- Respuestas de un estudiante por fecha
CREATE INDEX idx_respuestas_estudiante_fecha ON respuestas(estudiante_id, fecha_respuesta);
```

## 🔐 Políticas RLS (Row Level Security)

### Separación por Colegio

```sql
-- Ejemplo: Docentes solo ven estudiantes de su colegio
CREATE POLICY "Docentes ven solo su colegio"
ON estudiantes FOR SELECT
USING (
  colegio_id IN (
    SELECT colegio_id FROM docentes WHERE user_id = auth.uid()
  )
);

-- Ejemplo: Apoderados solo ven a sus hijos
CREATE POLICY "Apoderados ven solo sus hijos"
ON estudiantes FOR SELECT
USING (
  id IN (
    SELECT estudiante_id FROM estudiante_apoderado
    WHERE apoderado_id IN (
      SELECT id FROM apoderados WHERE user_id = auth.uid()
    )
  )
);

-- Ejemplo: Admin global ve todo
CREATE POLICY "Admin ve todo"
ON estudiantes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin'
  )
);
```

## 📊 Cardinalidades

```
COLEGIOS (1) ───────── (N) ESTUDIANTES
GRADOS (1) ─────────── (N) ESTUDIANTES
APODERADOS (N) ──────── (M) ESTUDIANTES (via tabla intermedia)
ESTUDIANTES (1) ──────── (1) PERFILES (activo=true)
ESTUDIANTES (1) ──────── (N) SESIONES
ESTUDIANTES (1) ──────── (N) EJERCICIOS_GENERADOS
ESTUDIANTES (1) ──────── (N) RESPUESTAS
EJERCICIOS_GENERADOS (1) ── (N) RESPUESTAS
SESIONES (1) ──────────── (N) RESPUESTAS
```

## 🎯 Constraints Importantes

### Unicidad
- `colegios.codigo_colegio` - UNIQUE
- `colegios.ruc` - UNIQUE
- `estudiantes.codigo_alumno` - UNIQUE
- `estudiantes.dni` - UNIQUE (si se proporciona)
- `apoderados.dni` - UNIQUE
- `grados.numero` - UNIQUE

### Check Constraints
- `colegios.tipo_institucion` IN ('publica', 'privada')
- `colegios.estado` IN ('activo', 'inactivo', 'prueba')
- `estudiantes.estado` IN ('activo', 'retirado', 'trasladado', 'egresado')
- `estudiantes.genero` IN ('masculino', 'femenino')
- `grados.numero` BETWEEN 1 AND 6
- `perfiles.nivel_riesgo` IN ('bajo', 'medio', 'alto')
- `perfiles.confianza_perfil` BETWEEN 0 AND 100
- `sesiones.estado` IN ('en_progreso', 'completada', 'abandonada')

### Foreign Keys con Acciones
- `estudiantes.colegio_id` → `colegios.id` (RESTRICT - no eliminar colegio con estudiantes)
- `estudiantes.grado_id` → `grados.id` (RESTRICT)
- `perfiles.estudiante_id` → `estudiantes.id` (CASCADE - eliminar perfil si se elimina estudiante)
- `estudiante_apoderado.estudiante_id` → `estudiantes.id` (CASCADE)
- `respuestas.estudiante_id` → `estudiantes.id` (CASCADE)

## 🔄 Triggers Automáticos

### 1. Generación de Código de Alumno
```sql
CREATE TRIGGER trigger_generar_codigo_alumno
  BEFORE INSERT ON estudiantes
  FOR EACH ROW
  WHEN (NEW.codigo_alumno IS NULL)
  EXECUTE FUNCTION generar_codigo_alumno();
```

### 2. Actualización Automática de Timestamps
```sql
CREATE TRIGGER update_estudiantes_updated_at
  BEFORE UPDATE ON estudiantes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. Cálculo de Edad
```sql
-- Usando columna GENERATED:
edad INT GENERATED ALWAYS AS (
  EXTRACT(YEAR FROM age(CURRENT_DATE, fecha_nacimiento))
) STORED
```

### 4. Validación de Edad vs Grado
```sql
CREATE TRIGGER trigger_validar_edad_grado
  BEFORE INSERT OR UPDATE ON estudiantes
  FOR EACH ROW
  EXECUTE FUNCTION validar_edad_grado();
```

## 📈 Vistas Materializadas Sugeridas

### Para Performance en Reportes

```sql
-- Vista materializada de estadísticas por colegio
CREATE MATERIALIZED VIEW stats_por_colegio AS
SELECT 
  c.id as colegio_id,
  c.nombre,
  COUNT(DISTINCT e.id) as total_estudiantes,
  COUNT(DISTINCT CASE WHEN e.estado = 'activo' THEN e.id END) as estudiantes_activos,
  COUNT(DISTINCT p.id) as perfiles_creados,
  COUNT(DISTINCT s.id) as sesiones_completadas,
  AVG(s.porcentaje_acierto) as promedio_acierto
FROM colegios c
LEFT JOIN estudiantes e ON c.id = e.colegio_id
LEFT JOIN perfiles p ON e.id = p.estudiante_id AND p.activo = true
LEFT JOIN sesiones s ON e.id = s.estudiante_id AND s.estado = 'completada'
GROUP BY c.id, c.nombre;

-- Refrescar cada hora
REFRESH MATERIALIZED VIEW CONCURRENTLY stats_por_colegio;
```

## 🎨 Diagrama Visual Simplificado

```
                    ┌──────────┐
                    │ COLEGIOS │
                    └─────┬────┘
                          │
                    ┌─────┴─────┐
                    │           │
               ┌────▼────┐ ┌───▼────┐
               │ GRADOS  │ │APODERADOS│
               └────┬────┘ └───┬────┘
                    │          │
                    └─────┬────┘
                          │
                    ┌─────▼─────┐
                    │ESTUDIANTES│
                    └─────┬─────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
       ┌────▼────┐  ┌────▼─────┐  ┌───▼────┐
       │PERFILES │  │SESIONES  │  │RESPUESTAS│
       └─────────┘  └──────────┘  └────────┘
                          │
                    ┌─────▼──────┐
                    │EJERCICIOS  │
                    └────────────┘
```

---

## 💾 Estimación de Almacenamiento

### Por 1000 Estudiantes (aprox.)

| Tabla | Registros | Tamaño/Registro | Total |
|-------|-----------|-----------------|-------|
| colegios | 10 | 1 KB | 10 KB |
| apoderados | 500-700 | 500 B | ~350 KB |
| estudiantes | 1000 | 1 KB | 1 MB |
| perfiles | 1000 | 2 KB | 2 MB |
| sesiones | 10,000 | 500 B | 5 MB |
| ejercicios | 50,000 | 2 KB | 100 MB |
| respuestas | 100,000 | 500 B | 50 MB |
| **TOTAL** | | | **~158 MB** |

### Proyección 10,000 Estudiantes: ~1.6 GB
### Proyección 100,000 Estudiantes: ~16 GB

*Nota: No incluye índices (agregar ~30-40% más)*
