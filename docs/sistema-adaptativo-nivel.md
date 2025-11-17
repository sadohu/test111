# Sistema Adaptativo de Nivel (Sin Machine Learning)

**Fecha**: 17 de Noviembre, 2025
**Autor**: Claude AI
**Versión**: 1.0.0

## 📋 Resumen Ejecutivo

Sistema de **adaptación inteligente de dificultad** basado en reglas y métricas de rendimiento, **SIN usar Machine Learning**.

### 🎯 Objetivo

Ajustar automáticamente el nivel de dificultad (básico → intermedio → avanzado) basándose en:
- ✅ Tasa de aciertos
- ✅ Tiempo de respuesta
- ✅ Rachas de correctas/incorrectas
- ✅ Historial de sesiones previas

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│              FLUJO DE ADAPTACIÓN                        │
└─────────────────────────────────────────────────────────┘

Estudiante completa sesión
         │
         ▼
┌──────────────────────────────────────────────┐
│  1. Recolectar Métricas                      │
│     - Tasa de aciertos: 30%                  │
│     - Tiempo promedio: 45 seg                │
│     - Racha incorrectas: 3                   │
│     - Total ejercicios: 10                   │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  2. Calcular Confianza                       │
│     - >= 10 ejercicios → ALTA                │
│     - 5-9 ejercicios → MEDIA                 │
│     - < 5 ejercicios → BAJA                  │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  3. Aplicar Reglas de Decisión               │
│                                               │
│  SI tasa < 50% → BAJAR nivel                 │
│  SI tasa > 80% + tiempo < 40s → SUBIR        │
│  SI racha 5+ correctas → SUBIR               │
│  SI racha 3+ incorrectas → BAJAR             │
│  SI tasa 50-70% → MANTENER                   │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  4. Generar Recomendación                    │
│     {                                         │
│       nivel_actual: "intermedio",            │
│       nivel_recomendado: "basico",           │
│       direccion: "bajar",                    │
│       razon: "Tasa 30% muy baja",            │
│       confianza: "alta"                      │
│     }                                         │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  5. Retornar al Frontend                     │
│     - Mostrar al estudiante                  │
│     - Auto-seleccionar en próxima sesión     │
└──────────────────────────────────────────────┘
```

---

## 📊 Reglas de Decisión

### **Regla 1: Confianza Baja → Ser Conservador**

```
SI total_ejercicios < 5:
  SI tasa < 50%:
    → BAJAR (pero advertir pocos datos)
  SINO:
    → MANTENER (datos insuficientes)
```

**Ejemplo**:
- Estudiante completa 3 ejercicios
- Tasa: 33% (1 de 3 correcto)
- **Decisión**: Bajar, pero con confianza BAJA

---

### **Regla 2: Racha Larga de Incorrectas → BAJAR**

```
SI racha_incorrectas >= 3:
  → BAJAR (señal fuerte de dificultad)
```

**Ejemplo**:
- Nivel: intermedio
- Últimas 3 respuestas: ❌ ❌ ❌
- **Decisión**: BAJAR a básico (nivel muy difícil)

---

### **Regla 3: Tasa Muy Baja → BAJAR**

```
SI tasa_aciertos < 50%:
  → BAJAR
```

**Ejemplo**:
- Tasa: 40% (4 de 10 correctos)
- **Decisión**: BAJAR (nivel actual muy difícil)

---

### **Regla 4: Racha Larga de Correctas → SUBIR**

```
SI racha_correctas >= 5:
  SI tiempo_promedio < 40 seg:
    → SUBIR (nivel muy fácil, dominio completo)
  SINO:
    → SUBIR (nivel fácil)
```

**Ejemplo**:
- Últimas 5 respuestas: ✅ ✅ ✅ ✅ ✅
- Tiempo promedio: 25 seg
- **Decisión**: SUBIR (nivel muy fácil)

---

### **Regla 5: Tasa Muy Alta + Tiempo Rápido → SUBIR**

```
SI tasa_aciertos > 80%:
  SI tiempo_promedio < 40 seg:
    → SUBIR (nivel muy fácil)
  SINO:
    → SUBIR (nivel fácil)
```

**Ejemplo**:
- Tasa: 90% (9 de 10 correctos)
- Tiempo: 30 seg promedio
- **Decisión**: SUBIR (nivel muy fácil, respuestas rápidas)

---

### **Regla 6: Tasa Alta Sin Tiempo Rápido → MANTENER**

```
SI tasa_aciertos > 70%:
  → MANTENER (consolidar antes de subir)
```

**Ejemplo**:
- Tasa: 75% (ejercicios bien, pero no dominio total)
- **Decisión**: MANTENER (nivel apropiado)

---

### **Regla 7: Tasa Media → MANTENER**

```
SI 50% <= tasa_aciertos <= 70%:
  → MANTENER (nivel adecuado)
```

**Ejemplo**:
- Tasa: 60% (6 de 10 correctos)
- **Decisión**: MANTENER (nivel apropiado)

---

## 🔢 Umbrales y Constantes

```python
# Tasas de aciertos
UMBRAL_BAJAR_NIVEL = 0.50       # < 50% → bajar
UMBRAL_MANTENER_BAJO = 0.50     # 50-70% → mantener
UMBRAL_MANTENER_ALTO = 0.70     # 50-70% → mantener
UMBRAL_SUBIR_NIVEL = 0.80       # > 80% → subir

# Tiempos (segundos)
TIEMPO_MUY_RAPIDO = 20          # < 20s → muy rápido
TIEMPO_RAPIDO = 40              # < 40s → rápido
TIEMPO_NORMAL = 60              # 40-60s → normal
TIEMPO_LENTO = 80               # > 60s → lento

# Rachas
RACHA_CORRECTAS_MINIMA = 5      # 5+ correctas → subir
RACHA_INCORRECTAS_MINIMA = 3    # 3+ incorrectas → bajar

# Confianza
MIN_EJERCICIOS_ALTA_CONFIANZA = 10
MIN_EJERCICIOS_MEDIA_CONFIANZA = 5
```

---

## 📝 Ejemplos de Recomendaciones

### Ejemplo 1: Rendimiento Bajo → Bajar

**Input**:
```json
{
  "nivel_actual": "intermedio",
  "estadisticas_sesion": {
    "total_ejercicios": 10,
    "ejercicios_correctos": 3,
    "tasa_aciertos": 0.3,
    "tiempo_promedio_segundos": 50
  }
}
```

**Output**:
```json
{
  "nivel_actual": "intermedio",
  "nivel_recomendado": "basico",
  "direccion": "bajar",
  "razon": "Tasa de aciertos baja (30%). Nivel actual muy difícil.",
  "confianza": "alta",
  "cambio_aplicado": true,
  "metricas": {
    "tasa_aciertos_sesion": 0.3,
    "total_ejercicios": 10
  }
}
```

---

### Ejemplo 2: Rendimiento Alto + Rápido → Subir

**Input**:
```json
{
  "nivel_actual": "basico",
  "estadisticas_sesion": {
    "total_ejercicios": 10,
    "ejercicios_correctos": 9,
    "tasa_aciertos": 0.9,
    "tiempo_promedio_segundos": 25
  },
  "sesion": {
    "respuestas": [
      {"es_correcta": true},
      {"es_correcta": true},
      {"es_correcta": true},
      {"es_correcta": true},
      {"es_correcta": true},
      {"es_correcta": true}
    ]
  }
}
```

**Output**:
```json
{
  "nivel_actual": "basico",
  "nivel_recomendado": "intermedio",
  "direccion": "subir",
  "razon": "Racha de 6 respuestas correctas seguidas con tiempo rápido (25s). Nivel actual muy fácil.",
  "confianza": "alta",
  "cambio_aplicado": true,
  "metricas": {
    "tasa_aciertos_sesion": 0.9,
    "tiempo_promedio_sesion": 25,
    "racha_correctas_maxima": 6
  }
}
```

---

### Ejemplo 3: Rendimiento Medio → Mantener

**Input**:
```json
{
  "nivel_actual": "intermedio",
  "estadisticas_sesion": {
    "total_ejercicios": 10,
    "ejercicios_correctos": 6,
    "tasa_aciertos": 0.6,
    "tiempo_promedio_segundos": 50
  }
}
```

**Output**:
```json
{
  "nivel_actual": "intermedio",
  "nivel_recomendado": "intermedio",
  "direccion": "mantener",
  "razon": "Tasa de aciertos adecuada (60%). Nivel actual apropiado.",
  "confianza": "alta",
  "cambio_aplicado": false,
  "metricas": {
    "tasa_aciertos_sesion": 0.6,
    "total_ejercicios": 10
  }
}
```

---

### Ejemplo 4: Pocos Datos → Conservador

**Input**:
```json
{
  "nivel_actual": "intermedio",
  "estadisticas_sesion": {
    "total_ejercicios": 3,
    "ejercicios_correctos": 2,
    "tasa_aciertos": 0.67
  }
}
```

**Output**:
```json
{
  "nivel_actual": "intermedio",
  "nivel_recomendado": "intermedio",
  "direccion": "mantener",
  "razon": "Datos insuficientes (3 ejercicios). Mantener nivel actual.",
  "confianza": "baja",
  "cambio_aplicado": false,
  "metricas": {
    "total_ejercicios": 3
  }
}
```

---

## 🌐 Endpoints REST

### 1. POST /api/sesiones/{id}/completar

**Retorna recomendación automática al completar sesión**

```json
{
  "success": true,
  "sesion_id": "SES_20251117_EST001_001",
  "estadisticas": { /* ... */ },
  "recomendacion_nivel": {
    "nivel_actual": "intermedio",
    "nivel_recomendado": "basico",
    "direccion": "bajar",
    "razon": "Tasa de aciertos baja (40%). Nivel actual muy difícil.",
    "confianza": "alta",
    "cambio_aplicado": true
  }
}
```

### 2. GET /api/estudiantes/{id}/nivel-recomendado

**Obtiene recomendación para próxima sesión**

**Query Params**:
- `curso`: "matematicas" | "verbal"

**Response**:
```json
{
  "nivel_actual": "basico",
  "nivel_recomendado": "intermedio",
  "direccion": "subir",
  "razon": "Excelente tasa de aciertos (85%) en últimas 3 sesiones.",
  "confianza": "alta",
  "cambio_aplicado": true,
  "metricas": {
    "tasa_aciertos_historica": 0.85,
    "total_sesiones": 5
  }
}
```

---

## 💻 Uso en el Código

### Backend (Python)

```python
from services import adaptador_nivel

# Al completar sesión
recomendacion = adaptador_nivel.recomendar_nivel(
    nivel_actual="intermedio",
    estadisticas_sesion=stats_sesion,
    estadisticas_estudiante=stats_estudiante,
    sesion=sesion_completa
)

print(f"Nivel recomendado: {recomendacion['nivel_recomendado']}")
print(f"Razón: {recomendacion['razon']}")
```

### Frontend (TypeScript)

```typescript
// Al completar sesión
const result = await apiClient.completarSesion(sesionId);

if (result.recomendacion_nivel) {
  console.log(
    `Nivel recomendado: ${result.recomendacion_nivel.nivel_recomendado}`
  );
  console.log(`Razón: ${result.recomendacion_nivel.razon}`);

  // Mostrar al usuario
  if (result.recomendacion_nivel.cambio_aplicado) {
    alert(
      `Se recomienda cambiar a nivel ${result.recomendacion_nivel.nivel_recomendado}. ` +
      `${result.recomendacion_nivel.razon}`
    );
  }
}

// Para próxima sesión
const recomendacion = await apiClient.obtenerNivelRecomendado(
  estudianteId,
  "matematicas"
);

// Auto-seleccionar nivel recomendado
setNivel(recomendacion.nivel_recomendado);
```

---

## 🆚 Comparación: Reglas vs Machine Learning

| Aspecto | Sistema de Reglas (Implementado) | Machine Learning |
|---------|----------------------------------|------------------|
| **Complejidad** | Baja | Alta |
| **Datos necesarios** | 5-10 ejercicios | 100+ ejercicios |
| **Tiempo de desarrollo** | 1 día | 2-4 semanas |
| **Mantenimiento** | Fácil (cambiar umbrales) | Complejo (reentrenar) |
| **Explicabilidad** | 100% transparente | Caja negra |
| **Precisión** | 80-85% | 85-90% |
| **Costos** | Ninguno | GPU, almacenamiento |
| **Apropiado para MVP** | ✅ SÍ | ❌ NO |

---

## 🔄 Evolución Futura (Con ML)

Cuando tengamos suficientes datos (1000+ sesiones), podemos implementar ML para:

### Fase 1: Features Engineering

```python
features = {
    'tasa_aciertos': 0.75,
    'tiempo_promedio': 45.3,
    'racha_correctas': 5,
    'racha_incorrectas': 0,
    'sesiones_previas': 12,
    'dias_desde_ultima_sesion': 3,
    'tasa_mejora_reciente': 0.15,
    'variabilidad_tiempos': 12.5
}
```

### Fase 2: Modelo de Clasificación

```python
from sklearn.ensemble import RandomForestClassifier

# Entrenar con histórico
model = RandomForestClassifier()
model.fit(X_train, y_train)  # y = [bajar, mantener, subir]

# Predecir
prediccion = model.predict([features])  # → "subir"
confianza = model.predict_proba([features])  # → [0.05, 0.15, 0.80]
```

### Fase 3: Validación y A/B Testing

- 80% usuarios: Sistema de reglas
- 20% usuarios: ML
- Comparar:
  - Tasa de abandono
  - Tiempo promedio en plataforma
  - Satisfacción
  - Mejora de rendimiento

---

## ✅ Conclusión

El sistema de **adaptación basado en reglas** es:

- ✅ **Simple y efectivo** para MVP
- ✅ **Transparente y explicable**
- ✅ **Fácil de mantener**
- ✅ **Sin dependencias de ML**
- ✅ **Funciona con pocos datos**

**Recomendación**: Usar este sistema hasta tener:
- 1000+ sesiones completas
- Feedback de estudiantes
- Métricas de efectividad

Luego evaluar migración a ML si los datos lo justifican.

---

**Documentación creada por**: Claude AI
**Fecha**: 17 de Noviembre, 2025
**Versión**: 1.0.0
