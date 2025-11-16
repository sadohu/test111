# Arquitectura del Sistema de Categorización de Perfiles

## 📋 Índice

1. [Visión General](#visión-general)
2. [Estructura de Capas](#estructura-de-capas)
3. [Flujo de Datos](#flujo-de-datos)
4. [Componentes Principales](#componentes-principales)
5. [Servicios de API](#servicios-de-api)
6. [Modelos y Tipos](#modelos-y-tipos)
7. [Diagrama de Arquitectura](#diagrama-de-arquitectura)
8. [Integración con Backend](#integración-con-backend)

---

## 🎯 Visión General

El sistema está diseñado con una **arquitectura en capas** siguiendo el patrón de separación de responsabilidades. Cada capa tiene un propósito específico y se comunica con las demás de forma controlada.

### Principios de Diseño

- **Separación de Responsabilidades**: Cada capa maneja una preocupación específica
- **Reutilización**: Componentes y servicios reutilizables
- **Testabilidad**: Lógica desacoplada fácil de probar
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Mantenibilidad**: Código organizado y documentado

---

## 📁 Estructura de Capas

```
src/
├── models/              # 📊 Capa de Modelos (Tipos y Definiciones)
│   ├── perfil.types.ts
│   └── index.ts
│
├── services/            # 🔌 Capa de Servicios (Lógica de Negocio y API)
│   ├── api.config.ts
│   ├── api.client.ts
│   ├── perfil.service.ts
│   ├── formulario.service.ts
│   └── index.ts
│
├── components/          # 🎨 Capa de Presentación (UI Components)
│   ├── BarraProgreso.tsx
│   ├── TarjetaOpcion.tsx
│   ├── Pregunta.tsx
│   ├── TarjetaPerfil.tsx
│   ├── FormularioCategorizacion.tsx
│   └── index.ts
│
├── hooks/              # 🪝 Custom Hooks (Lógica Reutilizable)
│   └── (vacío - para futuras implementaciones)
│
├── utils/              # 🛠️ Utilidades (Funciones Helper)
│   └── (vacío - para futuras implementaciones)
│
└── app/                # 📄 Páginas Next.js (Routing)
    ├── page.tsx
    ├── formulario/
    │   └── page.tsx
    └── layout.tsx
```

---

## 🔄 Flujo de Datos

### Flujo Completo de Clasificación de Perfil

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
│            Interactúa con la interfaz                            │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CAPA DE PRESENTACIÓN                           │
│  Components: FormularioCategorizacion, Pregunta, TarjetaOpcion  │
│                                                                  │
│  - Captura respuestas del usuario                               │
│  - Maneja estado local (useState, useEffect)                    │
│  - Valida formulario completo                                   │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS                             │
│  Services: perfilService, formularioService                     │
│                                                                  │
│  - perfilService.clasificarPerfil(request)                      │
│  - formularioService.obtenerFormularioPorGrado(grado)           │
│  - Maneja lógica de negocio                                     │
│  - Transforma datos para API                                    │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENTE HTTP (apiClient)                      │
│                                                                  │
│  - Configura headers y timeout                                  │
│  - Maneja errores HTTP                                          │
│  - Implementa retry logic                                       │
│  - Procesa respuestas                                           │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API BACKEND                                │
│              (Python FastAPI / Node.js)                          │
│                                                                  │
│  Endpoint: POST /api/clasificar-perfil                          │
│  Body: { respuestas, grado, estudiante_id }                     │
│                                                                  │
│  - Ejecuta algoritmo de clasificación                           │
│  - Calcula nivel de riesgo                                      │
│  - Genera recomendaciones                                       │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RESPUESTA (Perfil)                          │
│  Response: { success, data: PerfilEstudiante }                  │
│                                                                  │
│  - Perfil clasificado completo                                  │
│  - Nivel de riesgo                                              │
│  - Recomendaciones pedagógicas                                  │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CAPA DE PRESENTACIÓN                           │
│  Component: TarjetaPerfil                                       │
│                                                                  │
│  - Muestra perfil al usuario                                    │
│  - Renderiza recomendaciones                                    │
│  - Permite acciones (imprimir, guardar)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Componentes Principales

### 1. FormularioCategorizacion

**Responsabilidad**: Componente contenedor principal que orquesta todo el flujo del formulario.

**Props**:
```typescript
interface FormularioCategorizacionProps {
  grado: Grado;                                  // Grado del estudiante
  estudianteId: string;                          // ID único
  onComplete?: (perfil: PerfilEstudiante) => void; // Callback al completar
}
```

**Estado Manejado**:
- `preguntas`: Array de preguntas del formulario
- `preguntaActual`: Índice de la pregunta actual
- `respuestas`: Objeto con todas las respuestas
- `perfil`: Perfil clasificado (cuando está listo)
- `cargando`, `clasificando`, `error`: Estados de UI

**Flujo**:
1. Carga preguntas del servicio al montar
2. Navega entre preguntas
3. Valida formulario completo
4. Envía a clasificación
5. Muestra resultado

### 2. Pregunta

**Responsabilidad**: Renderiza una pregunta individual con sus opciones.

**Props**:
```typescript
interface PreguntaProps {
  pregunta: PreguntaFormulario;    // Datos de la pregunta
  respuestaSeleccionada?: string;  // Respuesta actual (si existe)
  onRespuesta: (preguntaId: string, respuestaId: string) => void;
  deshabilitada?: boolean;
}
```

### 3. TarjetaOpcion

**Responsabilidad**: Renderiza una opción de respuesta individual.

**Características**:
- Muestra emoji, texto y descripción
- Resalta visualmente cuando está seleccionada
- Animaciones de hover y selección
- Accesible (keyboard navigation)

### 4. TarjetaPerfil

**Responsabilidad**: Muestra el perfil clasificado con recomendaciones.

**Características**:
- Badge de nivel de riesgo con colores
- Grid de características del perfil
- Lista de recomendaciones pedagógicas
- Metadatos (fecha, confianza)

### 5. BarraProgreso

**Responsabilidad**: Muestra el progreso del formulario.

**Características**:
- Porcentaje visual
- Indicadores de paso (dots)
- Animaciones suaves

---

## 🔌 Servicios de API

### Arquitectura de Servicios

```
┌─────────────────────────────────────────────┐
│          api.config.ts                      │
│  - Configuración base (URL, timeout)        │
│  - Endpoints                                │
│  - Clase APIError                           │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│          api.client.ts                      │
│  - Cliente HTTP base                        │
│  - Métodos: GET, POST, PUT, DELETE          │
│  - Manejo de errores                        │
│  - Timeouts y aborts                        │
└────────────────┬────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────────┐  ┌──────────────────────┐
│ perfil.service.ts│  │formulario.service.ts │
│                  │  │                      │
│ - clasificar     │  │ - cargarFormularios  │
│ - validar        │  │ - obtenerPorGrado    │
│ - guardar        │  │ - validarCompleto    │
│ - obtener        │  │                      │
└──────────────────┘  └──────────────────────┘
```

### perfil.service.ts

**Métodos Principales**:

```typescript
class PerfilService {
  // Clasifica un perfil completo
  async clasificarPerfil(request: ClasificarPerfilRequest): Promise<APIResponse<PerfilEstudiante>>

  // Método de conveniencia
  async clasificarPerfilSimple(respuestas, grado, estudianteId): Promise<APIResponse<PerfilEstudiante>>

  // Valida una respuesta individual
  async validarRespuesta(request: ValidarRespuestaRequest): Promise<APIResponse<{valida: boolean}>>

  // Obtiene un perfil guardado
  async obtenerPerfil(estudianteId: string): Promise<APIResponse<PerfilEstudiante>>

  // Guarda un perfil
  async guardarPerfil(perfil: PerfilEstudiante): Promise<APIResponse<{id: string}>>

  // Actualiza un perfil
  async actualizarPerfil(estudianteId, perfilParcial): Promise<APIResponse<PerfilEstudiante>>
}
```

### formulario.service.ts

**Métodos Principales**:

```typescript
class FormularioService {
  // Carga todos los formularios desde JSON
  async cargarFormularios(): Promise<FormulariosData>

  // Obtiene formulario específico por grado
  async obtenerFormularioPorGrado(grado: Grado): Promise<Formulario>

  // Obtiene una pregunta específica
  async obtenerPregunta(grado: Grado, preguntaId: string): Promise<PreguntaFormulario>

  // Valida formulario completo
  async validarFormularioCompleto(grado, respuestas): Promise<{completo: boolean, preguntasFaltantes: string[]}>

  // Obtiene opciones válidas para una pregunta
  async obtenerOpcionesValidas(grado, preguntaId): Promise<string[]>
}
```

---

## 📊 Modelos y Tipos

### Jerarquía de Tipos

```
perfil.types.ts
│
├── Tipos Básicos (Enums)
│   ├── Grado
│   ├── EstiloAprendizaje
│   ├── Velocidad
│   ├── Atencion
│   ├── AreaInteres
│   ├── NivelMatematicas
│   ├── NivelLectura
│   ├── Motivacion
│   ├── ManejoFrustracion
│   ├── PreferenciaTrabajo
│   ├── HorarioEnergia
│   └── NivelRiesgo
│
├── Interfaces de Formulario
│   ├── OpcionFormulario
│   ├── PreguntaFormulario
│   ├── Formulario
│   ├── FormulariosData
│   └── RespuestasFormulario
│
├── Interface Principal
│   └── PerfilEstudiante
│
├── API Request/Response
│   ├── ClasificarPerfilRequest
│   ├── ClasificarPerfilResponse
│   ├── ValidarRespuestaRequest
│   └── ValidarRespuestaResponse
│
└── UI/Estado
    ├── EstadoFormulario
    ├── EstadoAPI
    └── DatosEstudiante
```

### Tipo Principal: PerfilEstudiante

```typescript
interface PerfilEstudiante {
  // Identificación
  estudiante_id: string;
  grado: Grado;
  fecha_creacion: string;
  ultima_actualizacion: string;

  // Características (10 categorías)
  estilo_aprendizaje: EstiloAprendizaje;
  velocidad: Velocidad;
  atencion: Atencion;
  interes: AreaInteres;
  nivel_matematicas: NivelMatematicas;
  nivel_lectura: NivelLectura;
  motivacion: Motivacion;
  frustracion: ManejoFrustracion;
  trabajo: PreferenciaTrabajo;
  energia: HorarioEnergia;

  // Resultados
  nivel_riesgo: NivelRiesgo;
  recomendaciones: string[];
  categoria_principal: string;
  confianza_perfil: number;
}
```

---

## 🗺️ Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    CAPA DE PRESENTACIÓN                     │ │
│  │  app/formulario/page.tsx                                    │ │
│  │         │                                                    │ │
│  │         ▼                                                    │ │
│  │  components/FormularioCategorizacion.tsx                    │ │
│  │         │                                                    │ │
│  │         ├── BarraProgreso.tsx                               │ │
│  │         ├── Pregunta.tsx                                    │ │
│  │         │   └── TarjetaOpcion.tsx                           │ │
│  │         └── TarjetaPerfil.tsx                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                         │                                        │
│                         ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   CAPA DE SERVICIOS                         │ │
│  │  services/                                                  │ │
│  │         │                                                    │ │
│  │         ├── perfil.service.ts ─┐                            │ │
│  │         ├── formulario.service.ts                           │ │
│  │         │                       │                            │ │
│  │         └── api.client.ts ◄────┘                            │ │
│  │                  │                                           │ │
│  │                  └── api.config.ts                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                         │                                        │
│                         ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    CAPA DE MODELOS                          │ │
│  │  models/perfil.types.ts                                     │ │
│  │         │                                                    │ │
│  │         ├── Tipos Base (Grado, EstiloAprendizaje, etc.)    │ │
│  │         ├── Interfaces (PerfilEstudiante, Formulario)      │ │
│  │         └── Request/Response Types                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTP/REST
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                 │
│                   (Python FastAPI)                               │
│                                                                  │
│  POST /api/clasificar-perfil                                    │
│  GET  /api/formulario/:grado                                    │
│  GET  /api/perfil/:id                                           │
│  POST /api/perfil                                               │
│                                                                  │
│  lib/clasificador_perfiles.py                                  │
│    └── SistemaClasificacionPerfiles                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Integración con Backend

### Endpoint Principal: Clasificar Perfil

**Request**:
```http
POST /api/clasificar-perfil
Content-Type: application/json

{
  "respuestas": {
    "P1": "A",
    "P2": "C",
    ...
    "P10": "B"
  },
  "grado": "3-4",
  "estudiante_id": "EST001"
}
```

**Response Success**:
```json
{
  "success": true,
  "data": {
    "estudiante_id": "EST001",
    "grado": "3-4",
    "estilo_aprendizaje": "visual",
    "velocidad": "moderado",
    "nivel_riesgo": "bajo",
    "categoria_principal": "El Científico Colaborativo",
    "recomendaciones": [
      "📊 Usar organizadores visuales...",
      "⏰ Organizar bloques de 20-25 minutos...",
      ...
    ],
    "confianza_perfil": 60,
    ...
  }
}
```

**Response Error**:
```json
{
  "success": false,
  "error": "Mensaje de error",
  "statusCode": 400
}
```

### Ejemplo de Integración en FastAPI

```python
# backend/api/routes.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from lib.clasificador_perfiles import SistemaClasificacionPerfiles

app = FastAPI()
sistema = SistemaClasificacionPerfiles()

class ClasificarRequest(BaseModel):
    respuestas: dict
    grado: str
    estudiante_id: str

@app.post("/api/clasificar-perfil")
async def clasificar_perfil(request: ClasificarRequest):
    try:
        perfil = sistema.clasificar_respuestas(
            respuestas=request.respuestas,
            grado=request.grado,
            estudiante_id=request.estudiante_id
        )
        return {"success": True, "data": perfil.to_dict()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

---

## 🚀 Flujo de Desarrollo

### 1. Agregar Nueva Funcionalidad

**Ejemplo: Agregar guardado de perfiles**

1. **Modelo** (`src/models/perfil.types.ts`):
   ```typescript
   export interface GuardarPerfilRequest {
     perfil: PerfilEstudiante;
     notas?: string;
   }
   ```

2. **Servicio** (`src/services/perfil.service.ts`):
   ```typescript
   async guardarPerfil(request: GuardarPerfilRequest) {
     return await apiClient.post('/api/perfil', request);
   }
   ```

3. **Componente** (`src/components/TarjetaPerfil.tsx`):
   ```typescript
   const handleGuardar = async () => {
     const response = await perfilService.guardarPerfil({ perfil });
     if (response.success) {
       alert('Perfil guardado');
     }
   };
   ```

### 2. Testing

```typescript
// tests/services/perfil.service.test.ts
import { perfilService } from '@/services';

describe('PerfilService', () => {
  it('should classify profile successfully', async () => {
    const response = await perfilService.clasificarPerfilSimple(
      respuestas,
      '3-4',
      'TEST001'
    );
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
  });
});
```

---

## 📝 Convenciones de Código

### Nombrado

- **Componentes**: PascalCase (`FormularioCategorizacion`)
- **Servicios**: camelCase con sufijo `.service` (`perfil.service.ts`)
- **Tipos**: PascalCase (`PerfilEstudiante`)
- **Constantes**: UPPER_SNAKE_CASE (`API_CONFIG`)

### Estructura de Archivos

- Cada archivo exporta una cosa principal
- Archivo `index.ts` en cada directorio para re-exportar
- Importaciones relativas usando alias `@/`

### Documentación

- JSDoc en funciones públicas
- Comentarios explicativos en lógica compleja
- README.md en cada capa si es necesario

---

## 🔮 Próximos Pasos

1. **Custom Hooks**:
   - `useFormulario()`: Manejo de estado del formulario
   - `usePerfil()`: CRUD de perfiles
   - `useAPI()`: Estado de loading/error genérico

2. **Utilidades**:
   - `storage.ts`: LocalStorage helper
   - `validation.ts`: Validadores de formulario
   - `format.ts`: Formateo de datos

3. **Testing**:
   - Unit tests para servicios
   - Integration tests para componentes
   - E2E tests para flujos completos

4. **Optimizaciones**:
   - React Query para caché de API
   - Suspense para loading states
   - Code splitting por ruta

---

**Creado**: 2025-11-16
**Versión**: 1.0.0
**Autor**: Sistema de IA Educativa
