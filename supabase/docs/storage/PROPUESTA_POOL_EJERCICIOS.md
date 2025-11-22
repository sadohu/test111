# Propuesta: Sistema de Pool de Ejercicios Reutilizables

**Versión:** 1.0  
**Fecha:** 22/11/2025  
**Estado:** En Evaluación  
**Tipo:** Propuesta de Optimización

---

## 📋 Índice

1. [Contexto y Problema](#contexto-y-problema)
2. [Propuesta de Solución](#propuesta-de-solución)
3. [Comparativa: Sistema Actual vs Propuesto](#comparativa-sistema-actual-vs-propuesto)
4. [Implementación Técnica](#implementación-técnica)
5. [Beneficios](#beneficios)
6. [Riesgos y Desventajas](#riesgos-y-desventajas)
7. [Análisis de Riesgos Detallado](#análisis-de-riesgos-detallado)
8. [Recomendación Final](#recomendación-final)

---

## 🎯 Contexto y Problema

### Situación Actual (Sistema con Generación Directa)

```
Estudiante solicita ejercicio
         │
         ▼
Llamar API Gemini
         │
         ▼
Generar ejercicio personalizado
         │
         ▼
Guardar en ejercicios_generados
         │
         ▼
Mostrar a estudiante
         │
         ▼
❌ Ejercicio se usa UNA sola vez
❌ Nunca se reutiliza
❌ Costo por cada generación
```

**Problemas identificados:**

1. **Alto costo operativo**
   - Cada ejercicio requiere llamada a Gemini API
   - Costo aproximado: $0.0001 - $0.001 por ejercicio
   - 1000 estudiantes × 30 ejercicios/día = 30,000 llamadas/día
   - Costo mensual estimado: $30 - $300 USD

2. **Latencia en generación**
   - Tiempo de respuesta Gemini: 2-5 segundos
   - Experiencia de usuario más lenta
   - Posible timeout en conexiones lentas

3. **Desperdicio de contenido**
   - Ejercicios generados se usan una sola vez
   - No hay aprovechamiento de contenido de calidad
   - Regeneración de ejercicios similares

---

## 💡 Propuesta de Solución

### Sistema de Pool de Ejercicios Reutilizables

```
Estudiante solicita ejercicio
         │
         ▼
¿Hay ejercicio en pool no respondido?
         │
    ┌────┴────┐
    │         │
   Sí        No
    │         │
    │         ▼
    │    Generar con Gemini
    │         │
    │         ▼
    │    Agregar al pool
    │         │
    └────┬────┘
         │
         ▼
Entregar ejercicio al estudiante
         │
         ▼
Marcar como usado
         │
         ▼
✅ Ejercicio queda disponible para otros
```

**Concepto clave:** Crear un repositorio central de ejercicios que:
- Se generan una vez
- Se reutilizan múltiples veces
- Se distribuyen inteligentemente
- No se repiten por estudiante

---

## ⚖️ Comparativa: Sistema Actual vs Propuesto

| Aspecto | Sistema Actual (Generación Directa) | Sistema Propuesto (Pool) |
|---------|-------------------------------------|--------------------------|
| **Costo por ejercicio** | $0.0001 - $0.001 (siempre) | $0.0001 - $0.001 (primera vez), $0 (reutilización) |
| **Tiempo de respuesta** | 2-5 segundos (siempre) | < 100ms (desde pool), 2-5s (generación) |
| **Escalabilidad** | Lineal (más usuarios = más costo) | Sublineal (pool compartido) |
| **Calidad** | Variable (cada generación diferente) | Consistente (ejercicios validados por uso) |
| **Repetición** | Baja probabilidad | Controlada (nunca al mismo estudiante) |
| **Complejidad** | Baja (simple) | Media-Alta (requiere lógica adicional) |
| **Mantenimiento** | Bajo | Medio (requiere limpieza y balanceo) |
| **Almacenamiento** | Bajo (~1GB/año) | Alto (~5-10GB/año) |
| **Dependencia Gemini** | Alta (siempre online) | Media (puede funcionar offline corto plazo) |

---

## 🔧 Implementación Técnica

### Arquitectura del Pool

```sql
-- Tabla principal del pool
CREATE TABLE ejercicios_pool (
  id SERIAL PRIMARY KEY,
  
  -- Criterios de matching
  grado_id INT NOT NULL REFERENCES grados(id),
  curso VARCHAR(50) NOT NULL,
  nivel VARCHAR(50) NOT NULL,
  dificultad VARCHAR(50) NOT NULL,
  
  -- Personalización opcional
  estilo_aprendizaje VARCHAR(50),
  interes VARCHAR(50),
  
  -- Contenido
  titulo TEXT NOT NULL,
  enunciado TEXT NOT NULL,
  opciones JSONB NOT NULL,
  respuesta_correcta VARCHAR(1) NOT NULL,
  explicacion TEXT NOT NULL,
  operacion_principal VARCHAR(100),
  apoyo_visual TEXT,
  tags JSONB DEFAULT '[]',
  
  -- Métricas de uso
  veces_usado INT DEFAULT 0,
  ultima_vez_usado TIMESTAMPTZ,
  reportes_error INT DEFAULT 0,
  
  -- Auditoría
  generado_por VARCHAR(50) DEFAULT 'gemini',
  prompt_version VARCHAR(10) DEFAULT '1.0',
  fecha_generacion TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX idx_pool_busqueda 
ON ejercicios_pool(grado_id, curso, nivel, dificultad);

CREATE INDEX idx_pool_uso 
ON ejercicios_pool(veces_usado, ultima_vez_usado);
```

### Algoritmo de Obtención

```javascript
async function obtenerEjercicio(estudiante_id, curso, dificultad) {
  const perfil = await obtenerPerfilActivo(estudiante_id)
  
  // PASO 1: Buscar en pool
  let ejercicio = await buscarEnPool(perfil, curso, dificultad, estudiante_id)
  
  if (ejercicio) {
    // Ejercicio encontrado en pool
    await incrementarUsoEjercicio(ejercicio.id)
    return ejercicio
  }
  
  // PASO 2: No hay en pool, generar nuevo
  console.log(`Generando nuevo ejercicio con Gemini AI...`)
  const ejercicio_nuevo = await generarConGemini(perfil, curso, dificultad)
  
  // PASO 3: Agregar al pool para futura reutilización
  const ejercicio_guardado = await agregarAlPool(ejercicio_nuevo, perfil)
  
  return ejercicio_guardado
}

async function buscarEnPool(perfil, curso, dificultad, estudiante_id) {
  // Obtener IDs de ejercicios ya respondidos por este estudiante
  const respondidos_ids = await db.respuestas
    .find({ estudiante_id: estudiante_id })
    .distinct('ejercicio_snapshot.pool_id')
  
  // Buscar ejercicio que NO haya sido respondido
  const ejercicio = await db.ejercicios_pool.findOne({
    id: { $nin: respondidos_ids },  // Excluir ya respondidos
    grado_id: perfil.grado_id,
    curso: curso,
    nivel: perfil[`nivel_${curso}`],
    dificultad: dificultad,
    reportes_error: { $lt: 3 }  // Excluir problemáticos
  })
  .sort({ veces_usado: 1 })  // Priorizar menos usados
  .limit(1)
  
  return ejercicio
}
```

### Cron Job de Mantenimiento

```javascript
/**
 * Ejecutar diariamente a las 3:00 AM
 * Mantiene pool con mínimo de ejercicios
 */
async function mantenimientoPool() {
  const MIN_EJERCICIOS = 20
  const combinaciones = await obtenerCombinacionesActivas()
  
  for (const combo of combinaciones) {
    const count = await db.ejercicios_pool.count(combo)
    
    if (count < MIN_EJERCICIOS) {
      const faltantes = MIN_EJERCICIOS - count
      await generarEjerciciosParaCombinacion(combo, faltantes)
    }
  }
}
```

---

## ✅ Beneficios

### 1. **Reducción de Costos Operativos**

**Escenario:**
- 1000 estudiantes activos
- 30 ejercicios por estudiante al día
- 30 días al mes

**Sistema Actual (Generación Directa):**
```
1000 estudiantes × 30 ejercicios × 30 días = 900,000 generaciones/mes
Costo: 900,000 × $0.0005 = $450 USD/mes
```

**Sistema Propuesto (Pool):**
```
Mes 1:
  - Generaciones iniciales: ~5,000 ejercicios
  - Costo inicial: 5,000 × $0.0005 = $2.50
  - Reutilizaciones: 895,000 (gratis)
  - Costo total mes 1: ~$50 (generación + mantenimiento)

Mes 2-12:
  - Generaciones nuevas: ~500/mes (10% del pool)
  - Costo: 500 × $0.0005 = $0.25
  - Reutilizaciones: 899,500 (gratis)
  - Costo total mes 2-12: ~$5/mes

Ahorro anual: ~$450×12 - ($50 + $5×11) = $5,400 - $105 = $5,295 USD/año
```

### 2. **Mejor Performance (Latencia)**

```
Generación directa:
  - Tiempo promedio: 3 segundos
  - Usuario espera cada ejercicio

Pool:
  - Tiempo promedio: 50ms (cache hit)
  - 98% de los casos < 100ms
  - Solo 2% requiere generación (3s)
  
Experiencia de usuario: 60× más rápida en promedio
```

### 3. **Resiliencia ante Fallas**

```javascript
// Si Gemini API está caído
if (!geminiDisponible) {
  // Sistema actual: ❌ No puede generar ejercicios
  throw new Error('Servicio temporalmente no disponible')
  
  // Sistema con pool: ✅ Sigue funcionando
  return await buscarEnPool(perfil, curso, dificultad, estudiante_id)
}
```

### 4. **Control de Calidad**

- Ejercicios validados por uso múltiple
- Identificación de ejercicios problemáticos (reportes de error)
- Mejora continua basada en feedback

### 5. **Análisis y Métricas**

```sql
-- Ejercicios más efectivos
SELECT titulo, veces_usado, 
       AVG(respuestas.es_correcta) as tasa_acierto
FROM ejercicios_pool
JOIN respuestas ON respuestas.ejercicio_pool_id = ejercicios_pool.id
GROUP BY ejercicios_pool.id
ORDER BY tasa_acierto ASC
LIMIT 10;  -- Los 10 más difíciles
```

---

## ⚠️ Riesgos y Desventajas

### Desventajas Generales

| Desventaja | Impacto | Severidad |
|------------|---------|-----------|
| Mayor complejidad de código | Más difícil de mantener | 🟡 Media |
| Requiere almacenamiento adicional | ~5-10 GB/año | 🟢 Baja |
| Lógica de distribución compleja | Bugs potenciales | 🟡 Media |
| Requiere mantenimiento periódico | Cron jobs, limpieza | 🟡 Media |
| Curva de aprendizaje para desarrolladores | Onboarding más lento | 🟢 Baja |

---

## 🚨 Análisis de Riesgos Detallado

### Riesgo 1: Agotamiento del Pool

**Descripción:** Estudiante muy activo responde todos los ejercicios disponibles.

**Escenario:**
```javascript
// Pool tiene 50 ejercicios de matemáticas intermedias grado 3
const pool_size = 50

// Estudiante ha respondido todos
const respondidos = 50

// ❌ No hay ejercicios nuevos para mostrar
```

**Probabilidad:** 🟡 Media (20-30% de estudiantes muy activos)

**Impacto:** 🔴 Alto (estudiante no puede continuar)

**Mitigación:**
```javascript
// Estrategia 1: Reutilización después de 7 días
if (pool_agotado) {
  ejercicio = await buscarEjerciciosRespondidosHaceMasDe7Dias(estudiante_id)
}

// Estrategia 2: Generación en tiempo real
if (!ejercicio) {
  ejercicio = await generarConGeminiUrgente(perfil)
  await agregarAlPool(ejercicio, perfil)
}

// Estrategia 3: Trigger para ampliar pool
await generarMasEjerciciosEnBackground(perfil, 20)
```

**Costo de mitigación:** Bajo (lógica adicional + generación puntual)

---

### Riesgo 2: Calidad Inconsistente

**Descripción:** Ejercicios generados en diferentes momentos con diferentes prompts.

**Escenario:**
```javascript
// Ejercicio antiguo (prompt v1.0)
{
  titulo: "Suma",
  enunciado: "2 + 2 = ?",
  prompt_version: "1.0"
}

// Ejercicio nuevo (prompt v2.5)
{
  titulo: "¡Aventura Matemática!",
  enunciado: "Pedro y sus amigos encuentran manzanas...",
  prompt_version: "2.5"
}

// ❌ Experiencia inconsistente
```

**Probabilidad:** 🟠 Alta (inevitable con el tiempo)

**Impacto:** 🟡 Medio (confusión, pero no bloquea sistema)

**Mitigación:**
```javascript
// Versionado de prompts
ALTER TABLE ejercicios_pool ADD COLUMN prompt_version VARCHAR(10);

// Cron de actualización semestral
async function actualizarEjerciciosAntiguos() {
  const ejercicios_v1 = await db.ejercicios_pool.find({
    prompt_version: { $lt: '2.0' },
    veces_usado: { $lt: 10 }  // Solo poco usados
  })
  
  // Archivar y regenerar
  for (const ej of ejercicios_v1) {
    await archivar(ej)
    await regenerar(ej, 'v2.5')
  }
}
```

**Costo de mitigación:** Medio (desarrollo + mantenimiento)

---

### Riesgo 3: Desbalance del Pool

**Descripción:** Distribución desigual de ejercicios por nivel de dificultad.

**Escenario:**
```javascript
// Distribución real después de 3 meses
{
  'facil': 500,      // ✅ Muchos
  'medio': 150,      // ⚠️ Regular
  'dificil': 20      // ❌ Muy pocos
}

// Estudiantes avanzados agotan ejercicios difíciles rápido
```

**Probabilidad:** 🟠 Alta (demanda desigual natural)

**Impacto:** 🟡 Medio (solo afecta a estudiantes avanzados)

**Mitigación:**
```javascript
// Monitoreo y balanceo automático
async function balancearPool() {
  const MIN = 20
  const MAX = 100
  
  const stats = await obtenerDistribucion()
  
  for (const [combo, count] of Object.entries(stats)) {
    if (count < MIN) {
      await generarMas(combo, MIN - count)
    }
    if (count > MAX) {
      await archivarSobrantes(combo, count - MAX)
    }
  }
}
```

**Costo de mitigación:** Bajo (automatizable)

---

### Riesgo 4: Database Bloat (Crecimiento de BD)

**Descripción:** Pool crece indefinidamente sin límites.

**Escenario:**
```sql
-- Después de 12 meses
SELECT COUNT(*) FROM ejercicios_pool;
-- Resultado: 100,000 ejercicios

SELECT pg_size_pretty(pg_total_relation_size('ejercicios_pool'));
-- Resultado: 8 GB

-- Queries lentos
SELECT * FROM ejercicios_pool WHERE grado_id = 3;
-- Tiempo: 2000ms ❌
```

**Probabilidad:** 🟠 Alta (crecimiento natural)

**Impacto:** 🟡 Medio (queries lentos, costos de almacenamiento)

**Mitigación:**
```sql
-- Particionamiento por grado
CREATE TABLE ejercicios_pool_grado_1 PARTITION OF ejercicios_pool 
FOR VALUES FROM (1) TO (2);

-- Política de retención
DELETE FROM ejercicios_pool 
WHERE fecha_generacion < NOW() - INTERVAL '1 year'
  AND veces_usado < 3;

-- Índices parciales
CREATE INDEX idx_ejercicios_activos 
ON ejercicios_pool(grado_id, curso) 
WHERE reportes_error < 3;
```

**Costo de mitigación:** Medio (configuración + mantenimiento)

---

### Riesgo 5: Race Conditions

**Descripción:** Dos estudiantes obtienen el mismo ejercicio simultáneamente.

**Escenario:**
```javascript
// T0: Estudiante A busca ejercicio
const ejA = await buscarEnPool(perfilA)  // ID: 123

// T1: Estudiante B busca ejercicio (casi simultáneo)
const ejB = await buscarEnPool(perfilB)  // ID: 123 (mismo!)

// Ambos obtienen el mismo ejercicio
```

**Probabilidad:** 🟢 Baja (solo con alta concurrencia)

**Impacto:** 🟢 Bajo (no crítico, solo estadísticas imprecisas)

**Mitigación:**
```javascript
// Usar transacciones con locks
async function obtenerEjercicioConLock(estudiante_id) {
  const session = await db.startSession()
  session.startTransaction()
  
  try {
    const ejercicio = await db.ejercicios_pool.findOneAndUpdate(
      { /* criteria */ },
      { $inc: { veces_usado: 1 } },
      { session, new: true }
    )
    
    await session.commitTransaction()
    return ejercicio
  } catch (error) {
    await session.abortTransaction()
    throw error
  }
}
```

**Costo de mitigación:** Bajo (patrón estándar)

---

### Riesgo 6: Ejercicios Duplicados

**Descripción:** Gemini genera ejercicios muy similares.

**Escenario:**
```javascript
{
  enunciado: "Juan tiene 5 manzanas y compra 3 más. ¿Cuántas tiene?",
  respuesta: "8"
}

{
  enunciado: "María tiene 5 naranjas y compra 3 más. ¿Cuántas tiene?",
  respuesta: "8"
}

// ❌ Esencialmente el mismo ejercicio
```

**Probabilidad:** 🟠 Alta (comportamiento de IA)

**Impacto:** 🟡 Medio (aburrimiento, falta de variedad)

**Mitigación:**
```javascript
async function validarDuplicados(ejercicio_nuevo) {
  // Buscar ejercicios similares
  const similares = await db.ejercicios_pool.find({
    curso: ejercicio_nuevo.curso,
    operacion_principal: ejercicio_nuevo.operacion_principal,
    respuesta_correcta: ejercicio_nuevo.respuesta_correcta
  })
  
  for (const similar of similares) {
    const similitud = calcularSimilitudLevenshtein(
      ejercicio_nuevo.enunciado,
      similar.enunciado
    )
    
    if (similitud > 0.85) {  // 85% similar
      console.warn('Ejercicio duplicado detectado, descartando')
      return false
    }
  }
  
  return true
}
```

**Costo de mitigación:** Medio (algoritmo de similitud)

---

### Riesgo 7: Contexto Temporal Desfasado

**Descripción:** Ejercicios con contexto estacional fuera de temporada.

**Escenario:**
```javascript
// Generado en diciembre
{
  enunciado: "Santa Claus tiene 12 regalos y entrega 5...",
  fecha_generacion: "2025-12-15",
  tags: ['navidad']
}

// Estudiante lo recibe en julio
// ❌ Contexto irrelevante
```

**Probabilidad:** 🟢 Baja (solo si se usan contextos estacionales)

**Impacto:** 🟢 Bajo (confusión menor)

**Mitigación:**
```javascript
// Filtrar por temporalidad
async function buscarEnPoolConTemporalidad(perfil) {
  const mes_actual = new Date().getMonth() + 1
  
  return await db.ejercicios_pool.findOne({
    // ... otros criterios
    $or: [
      { tags: 'general' },
      { tags: { $in: obtenerTagsActivosDelMes(mes_actual) } }
    ]
  })
}

function obtenerTagsActivosDelMes(mes) {
  const calendario = {
    12: ['navidad', 'general'],
    7: ['fiestas_patrias', 'general'],
    // ...
  }
  return calendario[mes] || ['general']
}
```

**Costo de mitigación:** Bajo (lógica simple)

---

## 📊 Matriz de Decisión

| Factor | Peso | Generación Directa | Pool Reutilizable |
|--------|------|-------------------|-------------------|
| **Costo operativo** | 25% | 2/10 (alto) | 9/10 (bajo) |
| **Performance** | 20% | 5/10 (lento) | 9/10 (rápido) |
| **Complejidad** | 15% | 9/10 (simple) | 4/10 (complejo) |
| **Escalabilidad** | 15% | 4/10 (lineal) | 9/10 (sublineal) |
| **Mantenimiento** | 10% | 8/10 (bajo) | 5/10 (medio) |
| **Resiliencia** | 10% | 3/10 (dependiente) | 8/10 (robusto) |
| **Calidad** | 5% | 6/10 (variable) | 7/10 (consistente) |
| **Total Ponderado** | 100% | **5.35/10** | **7.45/10** |

---

## 🎯 Recomendación Final

### Para v1.0 (MVP - Ahora)

**✅ USAR GENERACIÓN DIRECTA**

**Justificación:**
- Menor tiempo de desarrollo (2-3 días vs 2 semanas)
- Menos puntos de fallo durante demo/presentación
- Código más simple de debuggear
- Suficiente para validar concepto

```javascript
// Implementación MVP simple
async function obtenerEjercicio(estudiante_id, curso, dificultad) {
  const perfil = await obtenerPerfilActivo(estudiante_id)
  const ejercicio = await generarConGemini(perfil, curso, dificultad)
  await guardarEjercicio(ejercicio)
  return ejercicio
}
```

**Costo estimado MVP (3 meses de prueba):**
- 100 estudiantes ficticios
- 10 ejercicios/estudiante promedio
- Costo: ~$10-15 USD total

### Para v2.0-v3.0 (Producción)

**✅ MIGRAR A SISTEMA DE POOL**

**Justificación:**
- Ahorro significativo con más usuarios
- Performance crítico con escala
- ROI positivo después de 3-6 meses

**Plan de migración:**
```
Mes 1-2: Desarrollo del pool
Mes 3: Testing paralelo (dual system)
Mes 4: Migración gradual (10% → 50% → 100%)
Mes 5: Optimización basada en datos reales
```

### Indicadores para Decidir Migración

Migrar a Pool cuando:
- ✅ Más de 500 estudiantes activos
- ✅ Costo mensual Gemini > $100 USD
- ✅ Latencia promedio > 2 segundos
- ✅ Sistema estable y probado

---

## 📈 Plan de Implementación Gradual

### Fase 1: MVP (v1.0) - Generación Directa
**Duración:** 2-3 meses  
**Objetivo:** Validar concepto

```javascript
// Sistema simple
async function obtenerEjercicio(estudiante_id, curso) {
  const ejercicio = await generarConGemini(...)
  return ejercicio
}
```

### Fase 2: Híbrido (v2.0) - Pool + Generación
**Duración:** 3-4 meses  
**Objetivo:** Construir pool inicial

```javascript
// Sistema híbrido
async function obtenerEjercicio(estudiante_id, curso) {
  // Intentar pool primero
  let ejercicio = await buscarEnPool(...)
  
  if (!ejercicio) {
    // Generar si no hay en pool
    ejercicio = await generarConGemini(...)
    await agregarAlPool(ejercicio)
  }
  
  return ejercicio
}
```

### Fase 3: Pool Completo (v3.0) - Reutilización Total
**Duración:** Indefinido  
**Objetivo:** Optimización máxima

```javascript
// Pool maduro con mantenimiento automático
async function obtenerEjercicio(estudiante_id, curso) {
  const ejercicio = await buscarEnPoolInteligente(...)
  
  if (!ejercicio) {
    // Generación solo en casos excepcionales
    await alertarPoolInsuficiente(...)
    ejercicio = await generarConGeminiUrgente(...)
  }
  
  return ejercicio
}
```

---

## 💰 Análisis Costo-Beneficio

### Inversión Inicial (Desarrollo Pool)

| Concepto | Horas | Costo |
|----------|-------|-------|
| Diseño de tabla y esquema | 8h | - |
| Lógica de búsqueda/distribución | 24h | - |
| Cron jobs de mantenimiento | 16h | - |
| Testing y debugging | 32h | - |
| **Total desarrollo** | **80h** | **~$4,000 USD** |

### ROI (Retorno de Inversión)

**Escenario conservador:**
- 1,000 estudiantes activos
- Ahorro mensual: $400 USD
- ROI: 10 meses

**Escenario optimista:**
- 5,000 estudiantes activos
- Ahorro mensual: $2,000 USD
- ROI: 2 meses

---

## 📝 Conclusiones

### ✅ Sistema de Pool es VIABLE a mediano-largo plazo

**Ventajas claras:**
- Reducción de costos 90-95%
- Performance 60× mejor
- Mayor resiliencia

**Desventajas manejables:**
- Complejidad técnica (mitigable con buena arquitectura)
- Riesgos identificados tienen soluciones conocidas
- Requiere mantenimiento (automatizable)

### 🎯 Estrategia Recomendada

1. **v1.0 (Ahora)**: Generación directa simple
2. **v2.0 (3-6 meses)**: Implementar pool híbrido
3. **v3.0 (6-12 meses)**: Pool completo optimizado

**La decisión final depende de:**
- Timeline del proyecto
- Presupuesto disponible
- Expertise técnico del equipo
- Escala esperada de usuarios

---

**Documento:** `PROPUESTA_POOL_EJERCICIOS.md`  
**Versión:** 1.0  
**Fecha:** 22/11/2025  
**Requiere aprobación:** SÍ  
**Próxima revisión:** Después de v1.0 MVP
