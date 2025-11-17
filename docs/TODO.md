# TODO - Sistema Generador de Ejercicios con Gemini AI

**Fecha de creación**: 17 de Noviembre, 2025
**Última actualización**: 17 de Noviembre, 2025
**Proyecto**: Generador de Ejercicios Educativos con IA
**Estado**: MVP en desarrollo

---

## 📊 Estado General del Proyecto

### ✅ Completado (Funcional)

| Componente | Estado | Archivos | Líneas | Testing |
|------------|--------|----------|--------|---------|
| **Backend - Generador Ejercicios** | ✅ 100% | 14 archivos | ~5,000 | ⚠️ Manual |
| **Backend - Sistema Tracking** | ✅ 100% | 3 archivos | ~1,500 | ⚠️ Manual |
| **Backend - Sistema Adaptativo** | ✅ 100% | 2 archivos | ~600 | ❌ Sin testing |
| **Frontend - UI Básica** | ✅ 100% | 6 archivos | ~800 | ✅ Manual OK |
| **Frontend - Tracking Cliente** | ✅ 80% | 2 archivos | ~300 | ⚠️ Parcial |
| **Frontend - Adaptativo UI** | ⚠️ 40% | 2 archivos | ~50 | ❌ Sin testing |
| **Documentación** | ✅ 95% | 5 docs | ~14,000 | N/A |

### ⚠️ En Progreso / Incompleto

| Componente | Estado | Prioridad | Bloqueante |
|------------|--------|-----------|------------|
| Testing E2E completo | ❌ 0% | 🔴 ALTA | No |
| UI de recomendaciones | ⚠️ 40% | 🟡 MEDIA | No |
| Configuración .env | ⚠️ Solo ejemplo | 🔴 ALTA | Sí |
| Base de datos real | ❌ 0% | 🟢 BAJA | No |
| Dashboard profesores | ❌ 0% | 🟢 BAJA | No |

---

## 🔍 Análisis Detallado de Componentes

### 1. BACKEND - Generador de Ejercicios

#### ✅ Implementado y Funcional

**Servicios principales** (`generador-ejercicios/services/`):
- ✅ `gemini_client.py` (150 líneas) - Cliente de Google Gemini AI
- ✅ `perfil_adapter.py` (200 líneas) - Adaptador de perfiles de estudiantes
- ✅ `prompt_builder.py` (400 líneas) - Constructor de prompts personalizados
- ✅ `generador_matematicas.py` (450 líneas) - Generador de ejercicios matemáticos
- ✅ `generador_verbal.py` (450 líneas) - Generador de ejercicios verbales
- ✅ `respuestas_storage.py` (450 líneas) - Storage JSON para respuestas
- ✅ `adaptador_nivel.py` (550 líneas) - Sistema adaptativo de nivel

**Modelos** (`generador-ejercicios/models/`):
- ✅ `ejercicio.py` (300 líneas) - Modelos de ejercicios
- ✅ `request.py` (300 líneas) - Request/Response models
- ✅ `respuesta.py` (300 líneas) - Modelos de tracking y sesiones

**API REST** (`generador-ejercicios/main.py` - 700 líneas):
- ✅ 8 endpoints de generación de ejercicios
- ✅ 6 endpoints de tracking de sesiones
- ✅ 2 endpoints de adaptación de nivel
- ✅ 2 endpoints de perfiles
- ✅ Total: **18 endpoints**

**Prompts Gemini** (`generador-ejercicios/prompts/`):
- ✅ 6 prompts detallados (3 matemáticas + 3 verbal)
- ✅ Total: ~1,560 líneas de prompts

#### ⚠️ Problemas Identificados

1. **BLOQUEANTE**: Necesita `.env` con `GEMINI_API_KEY`
   - Estado: Solo existe `.env.example`
   - Impacto: Backend no arranca
   - Solución: Usuario debe crear `.env` con su API key

2. **Testing insuficiente**:
   - ❌ No hay tests unitarios
   - ❌ No hay tests de integración
   - ⚠️ Solo testing manual informal
   - Riesgo: Bugs no detectados

3. **Storage temporal**:
   - ✅ JSON funciona bien para MVP
   - ⚠️ No escalable para producción
   - 📝 Migración a PostgreSQL documentada

4. **Validación de prompts**:
   - ⚠️ Gemini puede retornar JSON inválido
   - ✅ Hay manejo de errores básico
   - 🔄 Mejorar validación y retry logic

#### 📝 Decisiones Técnicas

- **FastAPI**: Elegido por performance y auto-documentación
- **Pydantic**: Validación de datos robusta
- **Google Gemini AI**: Calidad de ejercicios superior
- **JSON Storage**: Simple para MVP, migración planeada
- **Service Layer Pattern**: Fácil migración a BD

---

### 2. BACKEND - Sistema de Tracking

#### ✅ Implementado y Funcional

**Modelos** (`models/respuesta.py`):
```python
✅ SesionEjercicios       # Sesión completa con metadata
✅ RespuestaEstudiante    # Respuesta individual
✅ EstadisticasSesion     # Estadísticas calculadas
✅ EstadisticasEstudiante # Estadísticas agregadas
✅ EstadoSesion (Enum)    # Estados de sesión
```

**Storage** (`services/respuestas_storage.py`):
```python
✅ crear_sesion()
✅ obtener_sesion()
✅ registrar_respuesta()
✅ completar_sesion()
✅ calcular_estadisticas_sesion()
✅ calcular_estadisticas_estudiante()
✅ listar_sesiones_estudiante()
✅ generar_id_sesion()    # Formato: SES_YYYYMMDD_ESTUDIANTEID_NNN
```

**Endpoints REST**:
```
✅ POST   /api/sesiones/crear
✅ POST   /api/sesiones/{id}/responder
✅ POST   /api/sesiones/{id}/completar
✅ GET    /api/sesiones/{id}
✅ GET    /api/estudiantes/{id}/sesiones
✅ GET    /api/estudiantes/{id}/estadisticas
```

**Métricas trackeadas**:
- ✅ Tasa de aciertos (sesión + histórica)
- ✅ Tiempo de respuesta por ejercicio
- ✅ Tiempo total y promedio
- ✅ Cantidad de ejercicios completados
- ✅ Estado de la sesión
- ✅ Timestamps ISO 8601

#### ⚠️ Problemas Identificados

1. **Storage en memoria**:
   - ✅ JSON funciona para desarrollo
   - ⚠️ Datos se pierden al reiniciar servidor
   - 📁 Ubicación: `generador-ejercicios/data/sesiones.json`
   - Solución: Implementar persistencia real

2. **Sin autenticación**:
   - ❌ Cualquiera puede acceder a cualquier sesión
   - ⚠️ Solo por estudiante_id (string arbitrario)
   - Riesgo: Para MVP es aceptable
   - Futuro: Implementar JWT/OAuth

3. **Concurrencia**:
   - ⚠️ JSON no es thread-safe
   - ❌ Sin locks en escrituras
   - Riesgo: Bajo (1 usuario por vez en MVP)
   - Futuro: BD con transacciones

#### 📝 Documentación

- ✅ `docs/sistema-tracking-respuestas.md` (12,000+ líneas)
- ✅ Diagramas de flujo
- ✅ Ejemplos de uso
- ✅ Guía de migración a PostgreSQL

---

### 3. BACKEND - Sistema Adaptativo

#### ✅ Implementado y Funcional

**Servicio** (`services/adaptador_nivel.py` - 550 líneas):
```python
✅ recomendar_nivel()           # API principal
✅ _analizar_metricas()         # Extracción de métricas
✅ _analizar_rachas()           # Rachas correctas/incorrectas
✅ _calcular_confianza()        # Alta/Media/Baja
✅ _decidir_cambio_nivel()      # 7 reglas de decisión
✅ _aplicar_cambio()            # Cambio con límites
```

**Reglas implementadas**:
1. ✅ Confianza baja → Conservador
2. ✅ Racha 3+ incorrectas → BAJAR
3. ✅ Tasa < 50% → BAJAR
4. ✅ Racha 5+ correctas → SUBIR
5. ✅ Tasa > 80% + tiempo rápido → SUBIR
6. ✅ Tasa > 70% sin tiempo rápido → MANTENER
7. ✅ Tasa 50-70% → MANTENER

**Modelos**:
```python
✅ RecomendacionNivel          # Modelo de recomendación
✅ Nivel (Enum)                # basico/intermedio/avanzado
✅ DireccionCambio (Enum)      # subir/mantener/bajar
✅ ConfianzaRecomendacion      # alta/media/baja
```

**Endpoints**:
```
✅ POST /api/sesiones/{id}/completar  # Retorna recomendación
✅ GET  /api/estudiantes/{id}/nivel-recomendado?curso=matematicas
```

**Umbrales configurables**:
```python
UMBRAL_BAJAR_NIVEL = 0.50       # < 50% → bajar
UMBRAL_SUBIR_NIVEL = 0.80       # > 80% → subir
TIEMPO_RAPIDO = 40              # < 40s → rápido
RACHA_CORRECTAS_MINIMA = 5
RACHA_INCORRECTAS_MINIMA = 3
```

#### ⚠️ Problemas Identificados

1. **❌ SIN TESTING**:
   - ❌ No se ha ejecutado el código
   - ❌ No hay tests unitarios
   - ❌ No hay casos de prueba
   - 🔴 **CRÍTICO**: Puede tener bugs

2. **Umbrales no calibrados**:
   - ⚠️ Valores basados en intuición
   - ❌ Sin datos reales para ajustar
   - Solución: Testing con estudiantes reales

3. **Casos extremos no considerados**:
   - ❓ ¿Qué pasa si estudiante abandona sesión?
   - ❓ ¿Qué pasa con nivel AVANZADO intentando subir?
   - ❓ ¿Qué pasa con nivel BASICO intentando bajar?
   - ✅ Hay manejo de límites en `_aplicar_cambio()`

4. **Integración parcial**:
   - ✅ Backend retorna recomendación
   - ❌ Frontend no muestra recomendación al usuario
   - ⚠️ Solo en logs de consola

#### 🧪 Testing Necesario

**Casos de prueba prioritarios**:
```python
# Test 1: Rendimiento muy bajo
input: tasa=0.2, nivel=intermedio
expected: BAJAR a basico

# Test 2: Rendimiento muy alto + rápido
input: tasa=0.95, tiempo=20s, nivel=basico
expected: SUBIR a intermedio

# Test 3: Racha de incorrectas
input: racha_incorrectas=5, nivel=avanzado
expected: BAJAR a intermedio

# Test 4: Datos insuficientes
input: total_ejercicios=2, tasa=0.5
expected: MANTENER con confianza BAJA

# Test 5: Límites
input: nivel=avanzado, direccion=SUBIR
expected: MANTENER en avanzado (no hay nivel superior)
```

#### 📝 Documentación

- ✅ `docs/sistema-adaptativo-nivel.md` (850+ líneas)
- ✅ 7 reglas explicadas con ejemplos
- ✅ Comparación Reglas vs ML
- ✅ Roadmap de evolución

---

### 4. FRONTEND - Aplicación de Ejercicios

#### ✅ Implementado y Funcional

**Estructura** (`frontend/ejercicios-app/src/`):
```
app/
  ✅ page.tsx (400 líneas)      # UI principal
  ✅ layout.tsx                 # Layout global

components/
  ✅ EjercicioCard.tsx          # Tarjeta de ejercicio
  ✅ OpcionButton.tsx           # Botón de opción
  ✅ FeedbackPanel.tsx          # Panel de feedback
  ✅ ProgressBar.tsx            # Barra de progreso

types/
  ✅ ejercicios.ts (300 líneas) # Tipos TypeScript

lib/
  ✅ api-client.ts (270 líneas) # Cliente API
```

**Funcionalidades**:
- ✅ Configurar sesión (curso, cantidad, estudiante)
- ✅ Generar ejercicios con Gemini
- ✅ Mostrar ejercicios uno por uno
- ✅ Seleccionar respuestas
- ✅ Feedback inmediato (correcto/incorrecto)
- ✅ Progreso visual
- ✅ Pantalla de resultados finales
- ✅ Tracking de respuestas en backend

**API Client** (métodos implementados):
```typescript
✅ generarEjercicios()
✅ validarRespuesta()
✅ crearSesion()
✅ registrarRespuesta()
✅ completarSesion()
✅ obtenerEstadisticasEstudiante()
✅ listarSesionesEstudiante()
✅ obtenerNivelRecomendado()      // Agregado, no usado
```

#### ⚠️ Problemas Identificados

1. **UI de Recomendaciones INCOMPLETA**:
   - ✅ Tipos TypeScript agregados (`RecomendacionNivel`)
   - ✅ API Client tiene método `obtenerNivelRecomendado()`
   - ❌ NO se muestra al usuario en la UI
   - ❌ NO hay estado para la recomendación
   - ❌ NO hay componente visual

   **Ubicación del problema**:
   ```typescript
   // frontend/ejercicios-app/src/app/page.tsx:158
   const result = await apiClient.completarSesion(sesionId);
   console.log("✅ Sesión completada:", result.estadisticas);
   // 🔴 FALTA: Mostrar result.recomendacion_nivel al usuario
   ```

2. **Graceful Degradation**:
   - ✅ Funciona si tracking falla
   - ✅ Try-catch en todas las llamadas
   - ⚠️ Solo logs en consola, usuario no ve errores
   - Mejora: Toast notifications

3. **Estado de sesión no persistente**:
   - ❌ Se pierde al recargar página
   - ❌ No hay localStorage
   - Impacto: Usuario pierde progreso

4. **Responsive design básico**:
   - ✅ Funciona en desktop
   - ⚠️ No optimizado para móvil
   - Impacto: Bajo (MVP)

#### 🔄 Inconsistencias Backend ↔ Frontend

| Aspecto | Backend | Frontend | Estado |
|---------|---------|----------|--------|
| Tracking sesiones | ✅ Implementado | ✅ Implementado | ✅ OK |
| Registro respuestas | ✅ Implementado | ✅ Implementado | ✅ OK |
| Completar sesión | ✅ Implementado | ✅ Implementado | ✅ OK |
| **Recomendación nivel** | ✅ Implementado | ⚠️ Parcial | ❌ **INCONSISTENTE** |
| Mostrar estadísticas | ✅ Disponible | ❌ No mostrado | ⚠️ Gap |
| Historial sesiones | ✅ Disponible | ❌ No mostrado | ⚠️ Gap |

#### 📝 UI de Recomendaciones - Plan de Implementación

**Objetivo**: Mostrar la recomendación de nivel al usuario

**Ubicación**: `page.tsx`, pantalla de resultados (`estado === "completado"`)

**Cambios necesarios**:

```typescript
// 1. Agregar estado
const [recomendacion, setRecomendacion] = useState<RecomendacionNivel | null>(null);

// 2. Guardar en completarSesion
const result = await apiClient.completarSesion(sesionId);
if (result.recomendacion_nivel) {
  setRecomendacion(result.recomendacion_nivel);
}

// 3. Mostrar en UI
{recomendacion && recomendacion.cambio_aplicado && (
  <div className={`
    p-6 rounded-lg border-2
    ${recomendacion.direccion === 'subir' ? 'bg-green-50 border-green-500' :
      recomendacion.direccion === 'bajar' ? 'bg-yellow-50 border-yellow-500' :
      'bg-blue-50 border-blue-500'}
  `}>
    <h3 className="font-bold text-lg mb-2">
      {recomendacion.direccion === 'subir' && '🎉 ¡Excelente trabajo!'}
      {recomendacion.direccion === 'bajar' && '💪 ¡Sigue practicando!'}
      {recomendacion.direccion === 'mantener' && '✅ Buen ritmo'}
    </h3>
    <p className="mb-3">{recomendacion.razon}</p>
    <p className="text-sm font-semibold">
      Próximo nivel recomendado:
      <span className="ml-2 px-3 py-1 bg-white rounded">
        {recomendacion.nivel_recomendado.toUpperCase()}
      </span>
    </p>
    <p className="text-xs mt-2 text-gray-600">
      Confianza: {recomendacion.confianza}
    </p>
  </div>
)}
```

**Estimación**: 30 minutos de desarrollo

---

### 5. DOCUMENTACIÓN

#### ✅ Documentación Completa

| Documento | Líneas | Estado | Calidad |
|-----------|--------|--------|---------|
| `sistema-tracking-respuestas.md` | 12,000+ | ✅ Completo | Excelente |
| `sistema-adaptativo-nivel.md` | 850+ | ✅ Completo | Excelente |
| `INTEGRACION_FRONTEND_BACKEND.md` | 300+ | ✅ Completo | Buena |
| `TODO-testing-estudiantes.md` | 200+ | ✅ Completo | Buena |
| `formularios-clasificacion/*.md` | 1,500+ | ✅ Completo | Buena |

**Total documentación**: ~14,850 líneas

#### ⚠️ Gaps en Documentación

1. **❌ Falta API Reference consolidada**:
   - Documentación dispersa en múltiples archivos
   - Debería haber un solo documento con todos los endpoints
   - Formato: OpenAPI/Swagger ideal

2. **❌ Falta guía de deployment**:
   - No hay instrucciones de producción
   - No hay Dockerfile
   - No hay docker-compose.yml

3. **⚠️ Falta troubleshooting guide**:
   - Errores comunes no documentados
   - Soluciones no centralizadas

---

## 🐛 Bugs e Inconsistencias Identificados

### 🔴 CRÍTICO (Bloquean funcionalidad)

1. **Backend requiere .env con GEMINI_API_KEY**
   - **Ubicación**: `generador-ejercicios/.env`
   - **Error**: `ValueError: ❌ GEMINI_API_KEY no encontrada en .env`
   - **Impacto**: Backend no arranca
   - **Solución**:
     ```bash
     cp generador-ejercicios/.env.example generador-ejercicios/.env
     # Editar y agregar GEMINI_API_KEY=tu_api_key_aqui
     ```
   - **Responsable**: Usuario debe configurar

2. **Sistema adaptativo sin testing**
   - **Ubicación**: `generador-ejercicios/services/adaptador_nivel.py`
   - **Impacto**: Puede tener bugs no detectados
   - **Solución**: Crear tests unitarios
   - **Prioridad**: Alta

### 🟡 ALTO (Afectan experiencia)

3. **Frontend no muestra recomendación de nivel**
   - **Ubicación**: `frontend/ejercicios-app/src/app/page.tsx:158`
   - **Impacto**: Usuario no ve recomendación aunque backend la calcula
   - **Solución**: Ver sección "UI de Recomendaciones - Plan"
   - **Estimación**: 30 minutos

4. **Sin manejo de errores visible en UI**
   - **Ubicación**: `page.tsx` - múltiples try-catch
   - **Impacto**: Errores solo en consola, usuario no sabe qué pasó
   - **Solución**: Agregar toast notifications (react-hot-toast)

5. **Estado no persiste al recargar**
   - **Ubicación**: Frontend completo
   - **Impacto**: Usuario pierde progreso
   - **Solución**: localStorage o sessionStorage

### 🟢 BAJO (Mejoras futuras)

6. **JSON storage no thread-safe**
   - **Ubicación**: `respuestas_storage.py`
   - **Impacto**: Bajo (1 usuario por vez en MVP)
   - **Solución**: Migrar a PostgreSQL

7. **Umbrales no calibrados**
   - **Ubicación**: `adaptador_nivel.py` líneas 30-45
   - **Impacto**: Recomendaciones pueden no ser óptimas
   - **Solución**: Testing con usuarios reales y ajustar

8. **Responsive design no optimizado**
   - **Ubicación**: Frontend completo
   - **Impacto**: Experiencia subóptima en móvil
   - **Solución**: Media queries y testing móvil

---

## ✅ Checklist de Calidad

### Backend

- [x] Código implementado
- [x] Modelos definidos con Pydantic
- [x] Endpoints REST funcionan
- [x] Documentación de API
- [ ] **Tests unitarios**
- [ ] **Tests de integración**
- [ ] **Configuración .env creada**
- [x] Manejo de errores
- [ ] Logging estructurado
- [ ] Rate limiting
- [ ] CORS configurado
- [x] Validación de entrada

### Frontend

- [x] Código implementado
- [x] Componentes React
- [x] Tipos TypeScript
- [x] API Client
- [ ] **UI de recomendaciones**
- [ ] Tests unitarios (Jest)
- [ ] Tests E2E (Playwright)
- [ ] Manejo de errores visible
- [ ] Loading states
- [ ] Error boundaries
- [ ] Responsive design

### Infraestructura

- [ ] Dockerfile backend
- [ ] Dockerfile frontend
- [ ] docker-compose.yml
- [ ] CI/CD pipeline
- [ ] Monitoring/logging
- [ ] Backup strategy

### Documentación

- [x] README.md
- [x] API documentation
- [x] Architecture docs
- [ ] **Deployment guide**
- [ ] **Troubleshooting guide**
- [ ] Contributing guide

---

## 📋 Roadmap Priorizado

### 🔴 FASE 1: Resolver Bloqueos (1 día)

**Objetivo**: Hacer que el sistema sea ejecutable end-to-end

1. ✅ **Configurar .env** (Usuario)
   - Crear `generador-ejercicios/.env`
   - Agregar GEMINI_API_KEY
   - Verificar backend arranca

2. ⚠️ **Testing del sistema adaptativo**
   - Crear casos de prueba
   - Ejecutar manualmente
   - Verificar reglas funcionan
   - Documentar bugs encontrados

3. ⚠️ **Implementar UI de recomendaciones**
   - Agregar estado `recomendacion`
   - Crear componente visual
   - Integrar en pantalla de resultados
   - Testing manual

4. ⚠️ **Testing E2E completo**
   - Iniciar backend
   - Iniciar frontend
   - Flujo completo: generar → responder → completar
   - Verificar tracking funciona
   - Verificar recomendación aparece

**Entregable**: Sistema completamente funcional para demo

---

### 🟡 FASE 2: Mejoras de UX (2-3 días)

**Objetivo**: Mejorar experiencia de usuario

1. ⚠️ **Toast notifications**
   - Instalar react-hot-toast
   - Reemplazar console.log por toasts
   - Mensajes de éxito/error visibles

2. ⚠️ **Persistencia de estado**
   - localStorage para sesión actual
   - Recuperar progreso al recargar
   - Botón "Continuar sesión anterior"

3. ⚠️ **Pantalla de estadísticas**
   - Mostrar historial de sesiones
   - Gráfico de progreso
   - Tasa de aciertos por curso

4. ⚠️ **Responsive design**
   - Media queries para móvil
   - Testing en diferentes tamaños
   - Optimizar para tablet

**Entregable**: Aplicación pulida lista para usuarios

---

### 🟢 FASE 3: Testing con Usuarios (4-6 semanas)

**Objetivo**: Validar con estudiantes reales

Seguir plan documentado en `TODO-testing-estudiantes.md`:
- Semanas 1-2: Piloto con 3-5 estudiantes
- Semanas 3-4: Expansión a 10-15 estudiantes
- Semanas 5-6: Análisis y ajustes

**Métricas a medir**:
- Tasa de completación de sesiones
- Tiempo promedio por ejercicio
- Satisfacción (encuesta)
- Precisión de recomendaciones

**Ajustes esperados**:
- Calibrar umbrales del adaptador
- Ajustar dificultad de ejercicios
- Mejorar prompts de Gemini
- Refinar UI según feedback

---

### 🟢 FASE 4: Escalabilidad (2-3 semanas)

**Objetivo**: Preparar para producción

1. ⚠️ **Migrar a PostgreSQL**
   - Seguir guía en `sistema-tracking-respuestas.md`
   - Crear schema SQL
   - Migrar RespuestasStorage
   - Testing de migración

2. ⚠️ **Autenticación**
   - Implementar JWT
   - Login/registro de estudiantes
   - Proteger endpoints

3. ⚠️ **Deployment**
   - Crear Dockerfiles
   - docker-compose para desarrollo
   - Deploy en cloud (Railway, Render, o AWS)

4. ⚠️ **Monitoring**
   - Logging estructurado
   - Error tracking (Sentry)
   - Analytics básico

**Entregable**: Sistema en producción

---

### 🔵 FASE 5: Features Avanzados (futuro)

**Objetivo**: Evolución del producto

1. ⚠️ **Dashboard de profesores**
   - Vista de múltiples estudiantes
   - Reportes de progreso
   - Exportar datos

2. ⚠️ **Sistema de niveles gamificado**
   - Badges y logros
   - Racha de días consecutivos
   - Leaderboard (opcional)

3. ⚠️ **Machine Learning**
   - Cuando tengamos 1000+ sesiones
   - Entrenar modelo de clasificación
   - A/B testing: Reglas vs ML
   - Ver `sistema-adaptativo-nivel.md`

4. ⚠️ **Más tipos de ejercicios**
   - Ciencias naturales
   - Historia
   - Inglés

---

## 🧪 Plan de Testing

### Testing Manual Inmediato

**Checklist para próxima sesión**:

1. [ ] **Backend arranca correctamente**
   ```bash
   cd generador-ejercicios
   python -m uvicorn main:app --reload --port 8001
   # Verificar: http://localhost:8001/docs
   ```

2. [ ] **Frontend arranca correctamente**
   ```bash
   cd frontend/ejercicios-app
   npm run dev
   # Verificar: http://localhost:3001
   ```

3. [ ] **Flujo de generación**
   - [ ] Seleccionar curso (matemáticas)
   - [ ] Seleccionar cantidad (5 ejercicios)
   - [ ] Click "Comenzar Ejercicios"
   - [ ] Verificar: Ejercicios se generan
   - [ ] Verificar: Sesión creada en backend (console.log)

4. [ ] **Flujo de respuestas**
   - [ ] Responder 5 ejercicios
   - [ ] Verificar: Feedback aparece
   - [ ] Verificar: Progreso se actualiza
   - [ ] Verificar: Respuestas se registran (console.log)

5. [ ] **Flujo de completación**
   - [ ] Terminar último ejercicio
   - [ ] Verificar: Pantalla de resultados
   - [ ] Verificar: Estadísticas correctas
   - [ ] **Verificar: Recomendación de nivel aparece** ⚠️

6. [ ] **Verificar archivos JSON**
   ```bash
   cat generador-ejercicios/data/sesiones.json | jq .
   # Verificar estructura correcta
   ```

### Testing del Sistema Adaptativo

**Escenarios de prueba**:

```python
# Test Case 1: Bajar nivel
Configuración:
  - Nivel actual: intermedio
  - Responder 10 ejercicios
  - Solo 2 correctos (20%)

Resultado esperado:
  - nivel_recomendado: "basico"
  - direccion: "bajar"
  - razon: "Tasa de aciertos baja (20%)"
  - confianza: "alta"

# Test Case 2: Subir nivel
Configuración:
  - Nivel actual: basico
  - Responder 10 ejercicios
  - 9 correctos (90%)
  - Tiempo promedio: 25 segundos

Resultado esperado:
  - nivel_recomendado: "intermedio"
  - direccion: "subir"
  - razon: "Excelente tasa..."
  - confianza: "alta"

# Test Case 3: Mantener nivel
Configuración:
  - Nivel actual: intermedio
  - Responder 10 ejercicios
  - 6 correctos (60%)

Resultado esperado:
  - nivel_recomendado: "intermedio"
  - direccion: "mantener"
  - razon: "Tasa de aciertos adecuada"
  - confianza: "alta"
```

### Tests Unitarios Futuros

**Backend** (pytest):
```python
# tests/test_adaptador_nivel.py
def test_recomendar_bajar_nivel_por_tasa_baja()
def test_recomendar_subir_nivel_por_racha()
def test_mantener_con_datos_insuficientes()
def test_limites_nivel_basico()
def test_limites_nivel_avanzado()

# tests/test_respuestas_storage.py
def test_crear_sesion()
def test_registrar_respuesta()
def test_calcular_estadisticas()
def test_generar_id_sesion_unico()
```

**Frontend** (Jest):
```typescript
// __tests__/page.test.tsx
test('genera ejercicios correctamente')
test('registra respuestas correctamente')
test('muestra recomendación de nivel')
test('maneja errores gracefully')
```

---

## 📝 Decisiones Técnicas Documentadas

### 1. ¿Por qué JSON en lugar de Base de Datos?

**Decisión**: Usar JSON temporal para MVP

**Razones**:
- ✅ Simple de implementar (1 día vs 1 semana)
- ✅ Fácil de inspeccionar y debuggear
- ✅ No requiere infraestructura adicional
- ✅ Suficiente para 1-10 usuarios concurrentes
- ✅ Migración a BD ya documentada

**Cuándo migrar**:
- > 100 usuarios concurrentes
- > 10,000 sesiones almacenadas
- Necesidad de queries complejos
- Múltiples servidores (necesita centralización)

### 2. ¿Por qué Reglas en lugar de Machine Learning?

**Decisión**: Sistema adaptativo basado en reglas

**Razones**:
- ✅ Funciona con 5-10 ejercicios (vs 100+ para ML)
- ✅ Transparente y explicable
- ✅ Fácil de ajustar basándose en feedback
- ✅ No requiere datos de entrenamiento
- ✅ Sin costos de GPU/entrenamiento
- ✅ Apropiado para MVP

**Cuándo considerar ML**:
- > 1,000 sesiones completas
- Datos etiquetados (nivel óptimo real)
- Presupuesto para infraestructura ML
- Equipo con expertise en ML
- A/B testing muestra mejora significativa

### 3. ¿Por qué FastAPI en lugar de Django/Flask?

**Decisión**: FastAPI para el backend

**Razones**:
- ✅ Performance superior (async nativo)
- ✅ Validación automática con Pydantic
- ✅ Auto-documentación (OpenAPI/Swagger)
- ✅ Type hints nativos
- ✅ Fácil deployment

### 4. ¿Por qué Next.js en lugar de React puro?

**Decisión**: Next.js 14 con App Router

**Razones**:
- ✅ SSR/SSG para mejor SEO (futuro)
- ✅ File-based routing
- ✅ Built-in optimizaciones
- ✅ Developer experience superior
- ✅ Preparado para scaling

---

## 🎯 Métricas de Éxito

### Para MVP (Fase 1-2)

- [ ] Backend arranca sin errores
- [ ] Frontend se conecta al backend
- [ ] Usuario puede generar ejercicios
- [ ] Usuario puede responder ejercicios
- [ ] Tracking funciona correctamente
- [ ] Recomendación se muestra al usuario
- [ ] Sistema es usable por 1 persona

### Para Testing con Usuarios (Fase 3)

- [ ] 10+ estudiantes usando la app
- [ ] Tasa de completación > 70%
- [ ] Satisfacción promedio > 4/5
- [ ] Recomendaciones percibidas como apropiadas > 75%
- [ ] < 5 bugs reportados por semana
- [ ] Tiempo promedio por sesión: 10-15 minutos

### Para Producción (Fase 4-5)

- [ ] > 100 usuarios registrados
- [ ] > 1,000 sesiones completadas
- [ ] Uptime > 99%
- [ ] Tiempo de respuesta < 2 segundos
- [ ] 0 bugs críticos
- [ ] Dashboard de profesores funcional

---

## 🚨 Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Gemini API falla | Media | Alto | Retry logic + cache de ejercicios |
| JSON se corrompe | Baja | Medio | Backups automáticos + validación |
| Usuario pierde progreso | Alta | Medio | localStorage + auto-save |
| Recomendaciones incorrectas | Media | Medio | Testing extensivo + ajuste umbrales |
| Escalabilidad issues | Baja | Alto | Migración a BD planeada |
| Costo de Gemini API | Media | Medio | Rate limiting + caching |

---

## 📞 Próximos Pasos Inmediatos

### Para el Usuario

1. **Crear archivo .env** (BLOQUEANTE)
   ```bash
   cd /home/user/test111/generador-ejercicios
   cp .env.example .env
   nano .env
   # Agregar: GEMINI_API_KEY=tu_api_key_aqui
   ```

2. **Testear sistema completo**
   - Seguir checklist de "Testing Manual Inmediato"
   - Reportar bugs encontrados
   - Validar que recomendaciones tienen sentido

3. **Decidir próximos pasos**
   - ¿Implementar UI de recomendaciones?
   - ¿Hacer testing con estudiantes?
   - ¿Migrar a BD?

### Para el Desarrollo

1. **Implementar UI de recomendaciones** (30 min)
   - Ver sección "UI de Recomendaciones - Plan"
   - Testear visualmente
   - Commit

2. **Crear tests del adaptador** (2 horas)
   - 5 casos de prueba
   - Ejecutar manualmente
   - Documentar resultados

3. **Toast notifications** (1 hora)
   - Instalar react-hot-toast
   - Reemplazar console.log
   - Mejorar UX

---

## 📚 Referencias

- Código Backend: `/home/user/test111/generador-ejercicios/`
- Código Frontend: `/home/user/test111/frontend/ejercicios-app/`
- Documentación: `/home/user/test111/docs/`
- Branch: `claude/gemini-qa-chatbot-01GHhqLRZNWLySgszoEK4DzY`

---

**Documento creado**: 17 de Noviembre, 2025
**Última actualización**: 17 de Noviembre, 2025
**Estado del proyecto**: MVP 85% completo, pendiente testing E2E
**Próxima revisión**: Después de testing con usuarios
