# Sistema de Tracking de Respuestas

**Fecha**: 17 de Noviembre, 2025
**Autor**: Claude AI
**Versión**: 1.0.0

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Modelos de Datos](#modelos-de-datos)
4. [Service Layer - RespuestasStorage](#service-layer---respuestasstorage)
5. [Endpoints REST](#endpoints-rest)
6. [Integración Frontend](#integración-frontend)
7. [Flujo de Datos](#flujo-de-datos)
8. [Migración a Base de Datos](#migración-a-base-de-datos)
9. [Ejemplos de Uso](#ejemplos-de-uso)
10. [Testing](#testing)

---

## 1. Resumen Ejecutivo

### 🎯 Objetivo

Implementar un sistema de tracking de respuestas de estudiantes que:
- **Almacena** todas las respuestas de ejercicios con timestamps precisos
- **Calcula** estadísticas en tiempo real (tasa de aciertos, tiempos, progreso)
- **Prepara** el camino para migración a base de datos real
- **Sigue** buenas prácticas con **Service Layer Pattern**

### ✅ Características Implementadas

- ✅ **Seguimiento de sesiones**: Cada sesión de ejercicios se trackea independientemente
- ✅ **Registro de respuestas**: Cada respuesta incluye opción, corrección y tiempo
- ✅ **Estadísticas calculadas**: Tasas de acierto, tiempos promedio, completación
- ✅ **Storage JSON temporal**: Fácil de inspeccionar, sin dependencias de BD
- ✅ **API REST completa**: 6 endpoints para CRUD de sesiones
- ✅ **Graceful degradation**: El sistema continúa funcionando si el tracking falla
- ✅ **Type-safe**: Tipos espejados entre Pydantic (backend) y TypeScript (frontend)

---

## 2. Arquitectura del Sistema

### 📐 Patrón de Diseño: Service Layer + Repository Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                      │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   page.tsx   │───▶│ api-client.ts│───▶│  types.ts    │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              main.py (Endpoints/Controllers)         │  │
│  │  - POST /api/sesiones/crear                          │  │
│  │  - POST /api/sesiones/{id}/responder                 │  │
│  │  - POST /api/sesiones/{id}/completar                 │  │
│  │  - GET  /api/estudiantes/{id}/estadisticas           │  │
│  └───────────────────────┬──────────────────────────────┘  │
│                          │                                  │
│  ┌───────────────────────▼──────────────────────────────┐  │
│  │          SERVICE LAYER (Abstracción)                 │  │
│  │                                                       │  │
│  │  RespuestasStorage                                   │  │
│  │  ├── API Pública (no cambia)                         │  │
│  │  │   ├── crear_sesion()                              │  │
│  │  │   ├── registrar_respuesta()                       │  │
│  │  │   ├── completar_sesion()                          │  │
│  │  │   └── calcular_estadisticas()                     │  │
│  │  │                                                    │  │
│  │  └── Implementación Privada (cambia según storage)   │  │
│  │      ├── _read_json()    ← JSON ahora                │  │
│  │      └── _write_json()   ← DB después                │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         STORAGE (Temporal - JSON)                    │  │
│  │                                                       │  │
│  │  generador-ejercicios/data/                          │  │
│  │  └── sesiones.json                                   │  │
│  │      ├── sesiones: []                                │  │
│  │      └── metadata: {}                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 🔑 Ventajas del Service Layer Pattern

| Aspecto | Beneficio |
|---------|-----------|
| **Abstracción** | Controllers no saben si es JSON, PostgreSQL o MongoDB |
| **Migración fácil** | Solo cambiamos métodos privados (_read, _write) |
| **Testing** | Podemos mockear el storage sin cambiar controllers |
| **Mantenibilidad** | Lógica de negocio separada de persistencia |
| **Escalabilidad** | Podemos cambiar storage sin afectar API pública |

---

## 3. Modelos de Datos

### 📊 Diagrama de Entidades

```
┌─────────────────────────────────────────────────────────┐
│                   SesionEjercicios                      │
├─────────────────────────────────────────────────────────┤
│ sesion_id: str                (PK)                      │
│ estudiante_id: str                                      │
│ curso: CursoEnum             (matematicas|verbal)       │
│ nivel_determinado: str       (basico|inter|avanzado)    │
│ cantidad_ejercicios: int                                │
│ ejercicios_ids: List[str]                               │
│ respuestas: List[RespuestaEstudiante]  ───┐             │
│ fecha_inicio: str (ISO 8601)              │             │
│ fecha_fin: Optional[str]                  │             │
│ estado: EstadoSesion                      │             │
│ perfil_usado: Dict                        │             │
└───────────────────────────────────────────┼─────────────┘
                                            │
                                            │ 1:N
                                            │
                        ┌───────────────────▼─────────────┐
                        │   RespuestaEstudiante           │
                        ├─────────────────────────────────┤
                        │ ejercicio_id: str               │
                        │ opcion_seleccionada: str (A-D)  │
                        │ es_correcta: bool               │
                        │ tiempo_respuesta_segundos: int  │
                        │ timestamp: str (ISO 8601)       │
                        └─────────────────────────────────┘
```

### 📝 Modelo: SesionEjercicios

**Descripción**: Representa una sesión completa de ejercicios de un estudiante.

```python
class SesionEjercicios(BaseModel):
    sesion_id: str                    # Formato: SES_YYYYMMDD_ESTUDIANTEID_NNN
    estudiante_id: str
    curso: CursoEnum                  # "matematicas" | "verbal"
    nivel_determinado: str            # "basico" | "intermedio" | "avanzado"
    cantidad_ejercicios: int          # 1-20
    ejercicios_ids: List[str]         # ["MAT_INT_001", "MAT_INT_002", ...]
    respuestas: List[RespuestaEstudiante] = []
    fecha_inicio: str                 # ISO 8601
    fecha_fin: Optional[str] = None
    estado: EstadoSesion = INICIADA
    perfil_usado: Dict = {}
```

**Ejemplo JSON**:
```json
{
  "sesion_id": "SES_20251117_EST001_001",
  "estudiante_id": "EST001",
  "curso": "matematicas",
  "nivel_determinado": "intermedio",
  "cantidad_ejercicios": 5,
  "ejercicios_ids": ["MAT_INT_001", "MAT_INT_002", "MAT_INT_003"],
  "respuestas": [],
  "fecha_inicio": "2025-11-17T22:30:00",
  "fecha_fin": null,
  "estado": "iniciada",
  "perfil_usado": {
    "grado": "3-4",
    "nivel_matematicas": "intermedio"
  }
}
```

### 📝 Modelo: RespuestaEstudiante

**Descripción**: Representa una respuesta individual de un estudiante a un ejercicio.

```python
class RespuestaEstudiante(BaseModel):
    ejercicio_id: str                     # ID del ejercicio
    opcion_seleccionada: str              # "A", "B", "C", "D"
    es_correcta: bool                     # True | False
    tiempo_respuesta_segundos: int        # >= 0
    timestamp: str                        # ISO 8601 (auto-generated)
```

**Ejemplo JSON**:
```json
{
  "ejercicio_id": "MAT_INT_001",
  "opcion_seleccionada": "A",
  "es_correcta": true,
  "tiempo_respuesta_segundos": 45,
  "timestamp": "2025-11-17T22:31:15"
}
```

### 📝 Enum: EstadoSesion

```python
class EstadoSesion(str, Enum):
    INICIADA = "iniciada"           # Sesión creada, sin respuestas
    EN_PROGRESO = "en_progreso"     # Al menos 1 respuesta registrada
    COMPLETADA = "completada"       # Todas las respuestas registradas
    ABANDONADA = "abandonada"       # Usuario abandonó antes de terminar
```

### 📊 Modelo: EstadisticasSesion

**Descripción**: Estadísticas calculadas de una sesión completa.

```python
class EstadisticasSesion(BaseModel):
    sesion_id: str
    estudiante_id: str
    curso: CursoEnum

    # Contadores
    total_ejercicios: int
    ejercicios_completados: int
    ejercicios_correctos: int
    ejercicios_incorrectos: int

    # Tasas (0.0 - 1.0)
    tasa_aciertos: float              # correctos / completados
    tasa_completacion: float          # completados / total

    # Tiempos
    tiempo_total_segundos: int
    tiempo_promedio_segundos: float
    tiempo_min_segundos: Optional[int]
    tiempo_max_segundos: Optional[int]

    # Fechas
    fecha_inicio: str
    fecha_fin: Optional[str]
```

**Ejemplo de cálculo**:
```python
# Datos de entrada
sesion = SesionEjercicios(
    cantidad_ejercicios=5,
    respuestas=[
        RespuestaEstudiante(es_correcta=True, tiempo_respuesta_segundos=30),
        RespuestaEstudiante(es_correcta=True, tiempo_respuesta_segundos=45),
        RespuestaEstudiante(es_correcta=False, tiempo_respuesta_segundos=60),
        RespuestaEstudiante(es_correcta=True, tiempo_respuesta_segundos=25),
        RespuestaEstudiante(es_correcta=True, tiempo_respuesta_segundos=40),
    ]
)

# Estadísticas calculadas
estadisticas = EstadisticasSesion(
    total_ejercicios=5,
    ejercicios_completados=5,
    ejercicios_correctos=4,
    ejercicios_incorrectos=1,
    tasa_aciertos=0.8,              # 4/5 = 80%
    tasa_completacion=1.0,          # 5/5 = 100%
    tiempo_total_segundos=200,      # 30+45+60+25+40
    tiempo_promedio_segundos=40.0,  # 200/5
    tiempo_min_segundos=25,
    tiempo_max_segundos=60
)
```

---

## 4. Service Layer - RespuestasStorage

### 🏗️ Estructura de la Clase

```python
class RespuestasStorage:
    """
    Servicio de almacenamiento de respuestas y sesiones.

    IMPORTANTE: Este servicio usa JSON temporalmente.
    Cuando tengamos BD, solo cambiamos la implementación interna.
    La API pública (métodos públicos) permanece igual.
    """

    # ========================================================================
    # MÉTODOS PRIVADOS - Abstracción del storage
    # ESTOS MÉTODOS CAMBIARÁN cuando migremos a BD
    # ========================================================================

    def _init_storage(self):
        """Inicializa los archivos de storage si no existen"""

    def _read_json(self, file_path: Path) -> Dict:
        """Lee datos de un archivo JSON"""

    def _write_json(self, file_path: Path, data: Dict):
        """Escribe datos a un archivo JSON"""

    # ========================================================================
    # API PÚBLICA - Métodos que usan los controllers
    # ESTOS MÉTODOS NO CAMBIARÁN cuando migremos a BD
    # ========================================================================

    def crear_sesion(self, sesion: SesionEjercicios) -> SesionEjercicios:
        """Crea una nueva sesión de ejercicios"""

    def obtener_sesion(self, sesion_id: str) -> Optional[SesionEjercicios]:
        """Obtiene una sesión por ID"""

    def registrar_respuesta(
        self, sesion_id: str, respuesta: RespuestaEstudiante
    ) -> Optional[SesionEjercicios]:
        """Registra una respuesta en una sesión"""

    def completar_sesion(
        self, sesion_id: str, fecha_fin: Optional[str] = None
    ) -> Optional[SesionEjercicios]:
        """Marca una sesión como completada"""

    def calcular_estadisticas_sesion(
        self, sesion_id: str
    ) -> Optional[EstadisticasSesion]:
        """Calcula estadísticas de una sesión"""

    def calcular_estadisticas_estudiante(
        self, estudiante_id: str
    ) -> EstadisticasEstudiante:
        """Calcula estadísticas agregadas de un estudiante"""
```

### 📂 Estructura del JSON Storage

**Ubicación**: `generador-ejercicios/data/sesiones.json`

```json
{
  "sesiones": [
    {
      "sesion_id": "SES_20251117_EST001_001",
      "estudiante_id": "EST001",
      "curso": "matematicas",
      "nivel_determinado": "intermedio",
      "cantidad_ejercicios": 3,
      "ejercicios_ids": ["MAT_INT_001", "MAT_INT_002", "MAT_INT_003"],
      "respuestas": [
        {
          "ejercicio_id": "MAT_INT_001",
          "opcion_seleccionada": "A",
          "es_correcta": true,
          "tiempo_respuesta_segundos": 45,
          "timestamp": "2025-11-17T22:31:15"
        }
      ],
      "fecha_inicio": "2025-11-17T22:30:00",
      "fecha_fin": null,
      "estado": "en_progreso",
      "perfil_usado": {}
    }
  ],
  "metadata": {
    "created_at": "2025-11-17T22:00:00",
    "total_sesiones": 1,
    "last_updated": "2025-11-17T22:31:15"
  }
}
```

### 🔄 Generación de IDs Únicos

**Formato**: `SES_YYYYMMDD_ESTUDIANTEID_NNN`

**Ejemplo**: `SES_20251117_EST001_003`

**Ventajas**:
- ✅ Legible para humanos
- ✅ Ordenable cronológicamente
- ✅ Identificable por estudiante
- ✅ Único dentro del mismo día

**Implementación**:
```python
def generar_id_sesion(self, estudiante_id: str) -> str:
    fecha = datetime.now().strftime("%Y%m%d")
    sesiones_hoy = len([
        s for s in self._read_json(self.sesiones_file).get("sesiones", [])
        if s.get("sesion_id", "").startswith(f"SES_{fecha}_{estudiante_id}")
    ])
    numero = str(sesiones_hoy + 1).zfill(3)
    return f"SES_{fecha}_{estudiante_id}_{numero}"
```

---

## 5. Endpoints REST

### 🌐 API Completa

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/sesiones/crear` | Crear nueva sesión |
| POST | `/api/sesiones/{id}/responder` | Registrar respuesta |
| POST | `/api/sesiones/{id}/completar` | Completar sesión |
| GET | `/api/sesiones/{id}` | Obtener sesión |
| GET | `/api/estudiantes/{id}/sesiones` | Listar sesiones de estudiante |
| GET | `/api/estudiantes/{id}/estadisticas` | Estadísticas de estudiante |

### 📝 POST /api/sesiones/crear

**Descripción**: Crea una nueva sesión de ejercicios.

**Request**:
```json
{
  "estudiante_id": "EST001",
  "curso": "matematicas",
  "ejercicios_ids": ["MAT_INT_001", "MAT_INT_002", "MAT_INT_003"],
  "nivel_determinado": "intermedio",
  "perfil_usado": {
    "grado": "3-4",
    "nivel_matematicas": "intermedio"
  }
}
```

**Response 200**:
```json
{
  "success": true,
  "mensaje": "Sesión creada exitosamente",
  "sesion_id": "SES_20251117_EST001_001",
  "sesion": {
    "sesion_id": "SES_20251117_EST001_001",
    "estudiante_id": "EST001",
    "curso": "matematicas",
    "nivel_determinado": "intermedio",
    "cantidad_ejercicios": 3,
    "ejercicios_ids": ["MAT_INT_001", "MAT_INT_002", "MAT_INT_003"],
    "respuestas": [],
    "fecha_inicio": "2025-11-17T22:30:00.123456",
    "fecha_fin": null,
    "estado": "iniciada",
    "perfil_usado": {
      "grado": "3-4",
      "nivel_matematicas": "intermedio"
    }
  }
}
```

### 📝 POST /api/sesiones/{sesion_id}/responder

**Descripción**: Registra una respuesta de estudiante en una sesión.

**Request**:
```json
{
  "ejercicio_id": "MAT_INT_001",
  "opcion_seleccionada": "A",
  "es_correcta": true,
  "tiempo_respuesta_segundos": 45
}
```

**Response 200**:
```json
{
  "success": true,
  "mensaje": "Respuesta registrada exitosamente",
  "respuesta": {
    "ejercicio_id": "MAT_INT_001",
    "opcion_seleccionada": "A",
    "es_correcta": true,
    "tiempo_respuesta_segundos": 45,
    "timestamp": "2025-11-17T22:31:15.654321"
  },
  "progreso": {
    "completados": 1,
    "total": 3,
    "porcentaje": 33.33
  }
}
```

### 📝 POST /api/sesiones/{sesion_id}/completar

**Descripción**: Marca una sesión como completada y retorna estadísticas finales.

**Request**:
```json
{
  "fecha_fin": "2025-11-17T22:35:00"  // Opcional
}
```

**Response 200**:
```json
{
  "success": true,
  "mensaje": "Sesión completada exitosamente",
  "sesion_id": "SES_20251117_EST001_001",
  "estadisticas": {
    "sesion_id": "SES_20251117_EST001_001",
    "estudiante_id": "EST001",
    "curso": "matematicas",
    "total_ejercicios": 3,
    "ejercicios_completados": 3,
    "ejercicios_correctos": 2,
    "ejercicios_incorrectos": 1,
    "tasa_aciertos": 0.6667,
    "tasa_completacion": 1.0,
    "tiempo_total_segundos": 135,
    "tiempo_promedio_segundos": 45.0,
    "tiempo_min_segundos": 30,
    "tiempo_max_segundos": 60,
    "fecha_inicio": "2025-11-17T22:30:00",
    "fecha_fin": "2025-11-17T22:35:00"
  }
}
```

### 📝 GET /api/estudiantes/{estudiante_id}/estadisticas

**Descripción**: Obtiene estadísticas agregadas de todas las sesiones de un estudiante.

**Response 200**:
```json
{
  "success": true,
  "estudiante_id": "EST001",
  "estadisticas": {
    "estudiante_id": "EST001",
    "total_sesiones": 10,
    "total_ejercicios_completados": 50,
    "total_ejercicios_correctos": 42,
    "tasa_aciertos_promedio": 0.84,
    "tiempo_promedio_por_ejercicio": 48.5,
    "sesiones_matematicas": 6,
    "sesiones_verbal": 4,
    "tasa_aciertos_matematicas": 0.88,
    "tasa_aciertos_verbal": 0.78,
    "ultima_sesion_fecha": "2025-11-17T22:00:00",
    "ultima_sesion_id": "SES_20251117_EST001_001"
  },
  "sesiones_recientes": [
    {
      "sesion_id": "SES_20251117_EST001_001",
      "curso": "matematicas",
      "fecha_inicio": "2025-11-17T22:00:00",
      "estado": "completada"
    }
  ]
}
```

---

## 6. Integración Frontend

### 🔗 API Client (TypeScript)

**Ubicación**: `frontend/ejercicios-app/src/lib/api-client.ts`

```typescript
class EjerciciosAPIClient {
  // ...

  /**
   * Crear una nueva sesión de ejercicios
   */
  async crearSesion(request: CrearSesionRequest): Promise<CrearSesionResponse> {
    const response = await this.client.post<CrearSesionResponse>(
      "/api/sesiones/crear",
      request
    );
    return response.data;
  }

  /**
   * Registrar una respuesta en una sesión
   */
  async registrarRespuesta(
    sesionId: string,
    request: RegistrarRespuestaRequest
  ): Promise<RegistrarRespuestaResponse> {
    const response = await this.client.post<RegistrarRespuestaResponse>(
      `/api/sesiones/${sesionId}/responder`,
      request
    );
    return response.data;
  }

  /**
   * Completar una sesión
   */
  async completarSesion(sesionId: string): Promise<CompletarSesionResponse> {
    const response = await this.client.post<CompletarSesionResponse>(
      `/api/sesiones/${sesionId}/completar`,
      { fecha_fin: new Date().toISOString() }
    );
    return response.data;
  }
}
```

### ⚛️ Integración en Componente React

**Ubicación**: `frontend/ejercicios-app/src/app/page.tsx`

```typescript
export default function HomePage() {
  // Estado de tracking
  const [sesionId, setSesionId] = useState<string>("");
  const [nivelDeterminado, setNivelDeterminado] = useState<string>("");

  /**
   * 1️⃣ Al generar ejercicios: Crear sesión
   */
  const generarEjercicios = async () => {
    setEstado("cargando");

    try {
      // Generar ejercicios con Gemini
      const response = await apiClient.generarEjercicios({
        estudiante_id: estudianteId || "DEMO001",
        curso,
        cantidad,
      });

      const ejerciciosGenerados = /* ... */;

      // ✅ Crear sesión en backend para tracking
      try {
        const sesionResponse = await apiClient.crearSesion({
          estudiante_id: estudianteId || "DEMO001",
          curso,
          ejercicios_ids: ejerciciosGenerados.map((e) => e.id),
          nivel_determinado: response.nivel_determinado,
          perfil_usado: response.perfil_usado,
        });

        setSesionId(sesionResponse.sesion_id);
        setNivelDeterminado(response.nivel_determinado);
        console.log("✅ Sesión creada:", sesionResponse.sesion_id);
      } catch (trackingError) {
        console.warn("⚠️ Error creando sesión (continuando sin tracking):", trackingError);
        // Continuar sin tracking si falla
      }

      setEjercicios(ejerciciosGenerados);
      setEstado("ejercicios");
    } catch (error) {
      // ...
    }
  };

  /**
   * 2️⃣ Al responder ejercicio: Registrar respuesta
   */
  const manejarRespuesta = async (opcion: string) => {
    if (respuestaSeleccionada) return;

    setRespuestaSeleccionada(opcion);

    const tiempoFin = Date.now();
    const correcta = opcion === ejercicioActual.respuesta_correcta;
    const tiempoRespuestaSegundos = Math.round((tiempoFin - tiempoInicio) / 1000);

    // Guardar respuesta localmente
    const respuesta: RespuestaEstudiante = { /* ... */ };
    setRespuestas([...respuestas, respuesta]);

    // ✅ Registrar respuesta en backend (tracking)
    if (sesionId) {
      try {
        await apiClient.registrarRespuesta(sesionId, {
          ejercicio_id: ejercicioActual.id,
          opcion_seleccionada: opcion,
          es_correcta: correcta,
          tiempo_respuesta_segundos: tiempoRespuestaSegundos,
        });
        console.log("✅ Respuesta registrada en backend");
      } catch (trackingError) {
        console.warn("⚠️ Error registrando respuesta:", trackingError);
      }
    }

    // Mostrar feedback
    setTimeout(() => setMostrarFeedback(true), 500);
  };

  /**
   * 3️⃣ Al terminar todos los ejercicios: Completar sesión
   */
  const continuarSiguiente = async () => {
    setMostrarFeedback(false);
    setRespuestaSeleccionada("");

    if (esUltimoEjercicio) {
      // ✅ Completar sesión en backend
      if (sesionId) {
        try {
          const result = await apiClient.completarSesion(sesionId);
          console.log("✅ Sesión completada:", result.estadisticas);
        } catch (trackingError) {
          console.warn("⚠️ Error completando sesión:", trackingError);
        }
      }
      setEstado("completado");
    } else {
      setIndiceActual(indiceActual + 1);
      setTiempoInicio(Date.now());
    }
  };

  // ...
}
```

### 🛡️ Graceful Degradation

**Principio**: El sistema debe continuar funcionando incluso si el tracking falla.

**Implementación**:
```typescript
try {
  await apiClient.crearSesion(/* ... */);
  console.log("✅ Sesión creada");
} catch (trackingError) {
  console.warn("⚠️ Error creando sesión (continuando sin tracking):", trackingError);
  // ⚠️ No bloqueamos la ejecución
  // ✅ El usuario puede seguir usando la app
}
```

**Resultado**: Si el backend está caído, el usuario puede:
- ✅ Generar ejercicios
- ✅ Responder ejercicios
- ✅ Ver feedback
- ❌ Solo pierde el tracking persistente

---

## 7. Flujo de Datos

### 🔄 Flujo Completo de una Sesión

```
┌────────────────────────────────────────────────────────────────────┐
│ PASO 1: INICIO DE SESIÓN                                          │
└────────────────────────────────────────────────────────────────────┘

Frontend                         Backend                    Storage
   │                                │                          │
   │ generarEjercicios()            │                          │
   ├───────────────────────────────▶│                          │
   │ POST /api/generar-ejercicios   │                          │
   │                                │                          │
   │◀───────────────────────────────┤                          │
   │ { ejercicios, nivel, perfil }  │                          │
   │                                │                          │
   │ crearSesion()                  │                          │
   ├───────────────────────────────▶│                          │
   │ POST /api/sesiones/crear       │                          │
   │                                │                          │
   │                                │ crear_sesion()           │
   │                                ├─────────────────────────▶│
   │                                │                          │
   │                                │ JSON.write()             │
   │                                │                          │
   │                                │◀─────────────────────────┤
   │                                │ sesion                   │
   │                                │                          │
   │◀───────────────────────────────┤                          │
   │ { sesion_id, sesion }          │                          │
   │                                │                          │
   │ setSesionId(sesion_id)         │                          │
   │                                │                          │


┌────────────────────────────────────────────────────────────────────┐
│ PASO 2: RESPONDER EJERCICIOS (repetir N veces)                    │
└────────────────────────────────────────────────────────────────────┘

Frontend                         Backend                    Storage
   │                                │                          │
   │ manejarRespuesta("A")          │                          │
   │                                │                          │
   │ calcular tiempo                │                          │
   │ validar correcta               │                          │
   │                                │                          │
   │ registrarRespuesta()           │                          │
   ├───────────────────────────────▶│                          │
   │ POST /api/sesiones/{id}/resp   │                          │
   │                                │                          │
   │                                │ registrar_respuesta()    │
   │                                ├─────────────────────────▶│
   │                                │                          │
   │                                │ JSON.read()              │
   │                                │ append(respuesta)        │
   │                                │ JSON.write()             │
   │                                │                          │
   │                                │◀─────────────────────────┤
   │                                │ sesion actualizada       │
   │                                │                          │
   │◀───────────────────────────────┤                          │
   │ { success, respuesta, progreso}│                          │
   │                                │                          │
   │ mostrar feedback               │                          │
   │                                │                          │


┌────────────────────────────────────────────────────────────────────┐
│ PASO 3: COMPLETAR SESIÓN                                          │
└────────────────────────────────────────────────────────────────────┘

Frontend                         Backend                    Storage
   │                                │                          │
   │ continuarSiguiente()           │                          │
   │ (último ejercicio)             │                          │
   │                                │                          │
   │ completarSesion()              │                          │
   ├───────────────────────────────▶│                          │
   │ POST /api/sesiones/{id}/comp   │                          │
   │                                │                          │
   │                                │ completar_sesion()       │
   │                                ├─────────────────────────▶│
   │                                │                          │
   │                                │ JSON.read()              │
   │                                │ sesion.estado = COMPLETADA│
   │                                │ sesion.fecha_fin = now() │
   │                                │ JSON.write()             │
   │                                │                          │
   │                                │ calcular_estadisticas()  │
   │                                │                          │
   │                                │◀─────────────────────────┤
   │                                │ sesion, estadisticas     │
   │                                │                          │
   │◀───────────────────────────────┤                          │
   │ { estadisticas }               │                          │
   │                                │                          │
   │ mostrar pantalla de resultados │                          │
   │                                │                          │
```

---

## 8. Migración a Base de Datos

### 🗄️ Preparación para PostgreSQL

**Ventaja del Service Layer**: Solo necesitamos cambiar los métodos privados.

#### ANTES (JSON):

```python
class RespuestasStorage:
    def _read_json(self, file_path: Path) -> Dict:
        with open(file_path, 'r') as f:
            return json.load(f)

    def _write_json(self, file_path: Path, data: Dict):
        with open(file_path, 'w') as f:
            json.dump(data, f)

    def crear_sesion(self, sesion: SesionEjercicios) -> SesionEjercicios:
        data = self._read_json(self.sesiones_file)
        data["sesiones"].append(sesion.model_dump())
        self._write_json(self.sesiones_file, data)
        return sesion
```

#### DESPUÉS (PostgreSQL):

```python
class RespuestasStorage:
    def __init__(self, db_url: str):
        self.engine = create_engine(db_url)
        self.SessionLocal = sessionmaker(bind=self.engine)

    # ✅ Métodos privados cambian
    def _get_session(self):
        return self.SessionLocal()

    # ✅ API pública NO cambia
    def crear_sesion(self, sesion: SesionEjercicios) -> SesionEjercicios:
        db = self._get_session()
        try:
            db_sesion = SesionDB(**sesion.model_dump())
            db.add(db_sesion)
            db.commit()
            db.refresh(db_sesion)
            return sesion
        finally:
            db.close()
```

**Resultado**:
- ❌ Controllers: NO cambian
- ❌ Endpoints REST: NO cambian
- ❌ Frontend: NO cambia
- ✅ Solo RespuestasStorage cambia internamente

### 📊 Schema SQL Propuesto

```sql
-- Tabla de sesiones
CREATE TABLE sesiones (
    sesion_id VARCHAR(50) PRIMARY KEY,
    estudiante_id VARCHAR(50) NOT NULL,
    curso VARCHAR(20) NOT NULL,
    nivel_determinado VARCHAR(20) NOT NULL,
    cantidad_ejercicios INTEGER NOT NULL,
    ejercicios_ids TEXT NOT NULL,  -- JSON array
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP,
    estado VARCHAR(20) NOT NULL,
    perfil_usado JSONB,

    INDEX idx_estudiante (estudiante_id),
    INDEX idx_fecha (fecha_inicio),
    INDEX idx_estado (estado)
);

-- Tabla de respuestas
CREATE TABLE respuestas (
    id SERIAL PRIMARY KEY,
    sesion_id VARCHAR(50) NOT NULL,
    ejercicio_id VARCHAR(50) NOT NULL,
    opcion_seleccionada CHAR(1) NOT NULL,
    es_correcta BOOLEAN NOT NULL,
    tiempo_respuesta_segundos INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL,

    FOREIGN KEY (sesion_id) REFERENCES sesiones(sesion_id) ON DELETE CASCADE,
    INDEX idx_sesion (sesion_id),
    INDEX idx_ejercicio (ejercicio_id)
);

-- Vista de estadísticas por sesión
CREATE VIEW v_estadisticas_sesion AS
SELECT
    s.sesion_id,
    s.estudiante_id,
    s.curso,
    s.cantidad_ejercicios AS total_ejercicios,
    COUNT(r.id) AS ejercicios_completados,
    SUM(CASE WHEN r.es_correcta THEN 1 ELSE 0 END) AS ejercicios_correctos,
    AVG(r.tiempo_respuesta_segundos) AS tiempo_promedio,
    MIN(r.tiempo_respuesta_segundos) AS tiempo_min,
    MAX(r.tiempo_respuesta_segundos) AS tiempo_max,
    SUM(r.tiempo_respuesta_segundos) AS tiempo_total
FROM sesiones s
LEFT JOIN respuestas r ON s.sesion_id = r.sesion_id
GROUP BY s.sesion_id;
```

---

## 9. Ejemplos de Uso

### 🧪 Test Manual del Sistema

#### Prerequisito: Iniciar Backend

```bash
cd generador-ejercicios
cp .env.example .env
# Editar .env y agregar tu GEMINI_API_KEY
python -m uvicorn main:app --reload --port 8001
```

#### 1. Crear Sesión

```bash
curl -X POST http://localhost:8001/api/sesiones/crear \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "TEST001",
    "curso": "matematicas",
    "ejercicios_ids": ["MAT_INT_001", "MAT_INT_002", "MAT_INT_003"],
    "nivel_determinado": "intermedio",
    "perfil_usado": {}
  }'
```

**Respuesta**:
```json
{
  "success": true,
  "mensaje": "Sesión creada exitosamente",
  "sesion_id": "SES_20251117_TEST001_001",
  "sesion": { /* ... */ }
}
```

#### 2. Registrar Respuestas

```bash
# Respuesta 1 (correcta)
curl -X POST http://localhost:8001/api/sesiones/SES_20251117_TEST001_001/responder \
  -H "Content-Type: application/json" \
  -d '{
    "ejercicio_id": "MAT_INT_001",
    "opcion_seleccionada": "A",
    "es_correcta": true,
    "tiempo_respuesta_segundos": 30
  }'

# Respuesta 2 (incorrecta)
curl -X POST http://localhost:8001/api/sesiones/SES_20251117_TEST001_001/responder \
  -H "Content-Type: application/json" \
  -d '{
    "ejercicio_id": "MAT_INT_002",
    "opcion_seleccionada": "C",
    "es_correcta": false,
    "tiempo_respuesta_segundos": 45
  }'

# Respuesta 3 (correcta)
curl -X POST http://localhost:8001/api/sesiones/SES_20251117_TEST001_001/responder \
  -H "Content-Type: application/json" \
  -d '{
    "ejercicio_id": "MAT_INT_003",
    "opcion_seleccionada": "B",
    "es_correcta": true,
    "tiempo_respuesta_segundos": 25
  }'
```

#### 3. Completar Sesión

```bash
curl -X POST http://localhost:8001/api/sesiones/SES_20251117_TEST001_001/completar \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Respuesta**:
```json
{
  "success": true,
  "mensaje": "Sesión completada exitosamente",
  "sesion_id": "SES_20251117_TEST001_001",
  "estadisticas": {
    "total_ejercicios": 3,
    "ejercicios_completados": 3,
    "ejercicios_correctos": 2,
    "ejercicios_incorrectos": 1,
    "tasa_aciertos": 0.6667,
    "tasa_completacion": 1.0,
    "tiempo_total_segundos": 100,
    "tiempo_promedio_segundos": 33.33,
    "tiempo_min_segundos": 25,
    "tiempo_max_segundos": 45
  }
}
```

#### 4. Consultar Estadísticas

```bash
curl http://localhost:8001/api/estudiantes/TEST001/estadisticas
```

---

## 10. Testing

### ✅ Testing del Backend

**Ubicación**: `generador-ejercicios/services/respuestas_storage.py`

```bash
cd generador-ejercicios
python -m services.respuestas_storage
```

**Output Esperado**:
```
======================================================================
TEST: RespuestasStorage
======================================================================

✓ ID generado: SES_20251117_TEST001_001
✓ Sesión creada
✓ Respuesta 1 registrada

✓ Estadísticas:
  - Completados: 1/3
  - Correctos: 1
  - Tasa aciertos: 100.0%

======================================================================
✅ RespuestasStorage funcionando correctamente
======================================================================
```

### ✅ Testing del Frontend

**Prerequisito**: Backend corriendo

```bash
# Terminal 1: Backend
cd generador-ejercicios
python -m uvicorn main:app --reload --port 8001

# Terminal 2: Frontend
cd frontend/ejercicios-app
npm run dev
```

**Test Manual**:
1. Abrir `http://localhost:3001`
2. Configurar sesión (estudiante_id, curso, cantidad)
3. Click "Comenzar Ejercicios"
4. Responder todos los ejercicios
5. Ver estadísticas finales

**Verificación**:
- ✅ Consola del navegador: logs de sesión creada
- ✅ Consola del backend: logs de respuestas registradas
- ✅ Archivo `generador-ejercicios/data/sesiones.json`: sesión guardada
- ✅ Pantalla final: estadísticas correctas

### 🔍 Inspección del Storage

```bash
# Ver todas las sesiones almacenadas
cat generador-ejercicios/data/sesiones.json | jq .

# Contar sesiones totales
cat generador-ejercicios/data/sesiones.json | jq '.sesiones | length'

# Ver última sesión
cat generador-ejercicios/data/sesiones.json | jq '.sesiones[-1]'

# Ver estadísticas de todas las sesiones
cat generador-ejercicios/data/sesiones.json | jq '.sesiones[] | {
  id: .sesion_id,
  correctos: ([.respuestas[] | select(.es_correcta == true)] | length),
  total: (.respuestas | length)
}'
```

---

## 📌 Conclusión

### ✅ Logros

1. ✅ **Sistema de tracking completo** con sesiones y respuestas
2. ✅ **Service Layer Pattern** para fácil migración a BD
3. ✅ **6 endpoints REST** documentados y funcionales
4. ✅ **Integración frontend** con graceful degradation
5. ✅ **Estadísticas en tiempo real** (tasas, tiempos, progreso)
6. ✅ **Storage JSON temporal** fácil de inspeccionar
7. ✅ **Type-safe** con Pydantic + TypeScript

### 🚀 Próximos Pasos

1. **Testing con estudiantes reales** (ver `TODO-testing-estudiantes.md`)
2. **Migración a PostgreSQL** cuando tengamos tráfico real
3. **Dashboard de estadísticas** para profesores
4. **Análisis de patrones** de errores comunes
5. **Recomendaciones adaptativas** basadas en historial

### 📚 Referencias

- **Código Backend**: `generador-ejercicios/`
  - Models: `models/respuesta.py`
  - Service: `services/respuestas_storage.py`
  - Endpoints: `main.py`

- **Código Frontend**: `frontend/ejercicios-app/src/`
  - Types: `types/ejercicios.ts`
  - API Client: `lib/api-client.ts`
  - UI: `app/page.tsx`

---

**Documento creado por**: Claude AI
**Fecha**: 17 de Noviembre, 2025
**Última actualización**: 17 de Noviembre, 2025
