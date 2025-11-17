# 📱 Frontend - Sistema de Categorización de Perfiles

**Fecha:** 17 de Noviembre 2025
**Tecnología:** Next.js 14 + TypeScript
**Estado:** ✅ Completado

---

## 🎯 Objetivo

Crear un frontend robusto con arquitectura en capas para el sistema de categorización de perfiles estudiantiles, siguiendo las mejores prácticas de desarrollo con TypeScript y React.

---

## 📐 Arquitectura Implementada

### Capas del Sistema

```
src/
├── models/              # Tipos e interfaces TypeScript
├── services/            # Lógica de negocio y comunicación con API
└── components/          # Componentes React UI
```

### Patrón de Diseño

**Layered Architecture (Arquitectura en Capas)**

```
┌─────────────────────────────────┐
│     Components (UI Layer)       │  ← React Components
│  FormularioCategorizacion.tsx   │
│  TarjetaPerfil.tsx              │
└────────────┬────────────────────┘
             │ usa
             ▼
┌─────────────────────────────────┐
│    Services (Business Logic)    │  ← API calls, data processing
│  perfil.service.ts              │
│  formulario.service.ts          │
│  api.client.ts                  │
└────────────┬────────────────────┘
             │ usa
             ▼
┌─────────────────────────────────┐
│     Models (Type Definitions)   │  ← TypeScript types
│  perfil.types.ts                │
└─────────────────────────────────┘
```

**Beneficios:**
- ✅ Separación de responsabilidades
- ✅ Reutilización de código
- ✅ Testing más fácil
- ✅ Mantenibilidad a largo plazo

---

## 📁 Estructura de Archivos

```typescript
frontend/sistema-categorizacion/
├── src/
│   ├── models/
│   │   ├── perfil.types.ts          // ~380 líneas
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── api.config.ts            // ~53 líneas
│   │   ├── api.client.ts            // ~240 líneas
│   │   ├── perfil.service.ts        // ~179 líneas
│   │   ├── formulario.service.ts    // ~120 líneas (estimado)
│   │   └── index.ts
│   │
│   ├── components/
│   │   ├── FormularioCategorizacion.tsx  // ~220 líneas
│   │   ├── TarjetaPerfil.tsx             // Componente de UI
│   │   └── index.ts
│   │
│   └── app/
│       └── (páginas Next.js)
│
├── .env.local                       // Variables de entorno
├── .env.example                     // Template de configuración
├── package.json
├── tsconfig.json
├── next.config.js
└── ARQUITECTURA.md                  // Documentación técnica
```

---

## 🧩 Componentes Principales

### 1. Models Layer (`src/models/perfil.types.ts`)

**Propósito:** Definir todos los tipos TypeScript del dominio.

**Contenido:**

```typescript
// Tipos base
export type Grado = '1-2' | '3-4' | '5-6';
export type EstiloAprendizaje = 'visual' | 'auditivo' | 'kinestesico' | 'multimodal';
export type NivelRiesgo = 'bajo' | 'medio' | 'alto';
export type Velocidad = 'rapido' | 'moderado' | 'pausado';
// ... 10+ tipos más

// Interface principal
export interface PerfilEstudiante {
  estudiante_id: string;
  grado: Grado;
  fecha_creacion: string;
  ultima_actualizacion: string;

  // 10 características del perfil
  estilo_aprendizaje: EstiloAprendizaje;
  velocidad: Velocidad;
  atencion: NivelAtencion;
  interes: AreaInteres;
  nivel_matematicas: NivelAcademico;
  nivel_lectura: NivelLectura;
  motivacion: NivelMotivacion;
  frustracion: ManejoFrustracion;
  trabajo: PreferenciaTrabajo;
  energia: HorarioEnergia;

  // Resultados
  nivel_riesgo: NivelRiesgo;
  recomendaciones: string[];
  categoria_principal: string;
  confianza_perfil: number;
}

// Request/Response types
export interface ClasificarPerfilRequest {
  estudiante_id: string;
  grado: Grado;
  respuestas: RespuestasFormulario;
}

export interface RespuestasFormulario {
  P1: string;
  P2: string;
  // ... P3 a P10
}
```

**Características:**
- ✅ Type-safe en todo el frontend
- ✅ Autocompletado en IDE
- ✅ Validación en tiempo de compilación
- ✅ Documentación vía JSDoc

---

### 2. Services Layer

#### 2.1 API Configuration (`api.config.ts`)

```typescript
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  endpoints: {
    clasificarPerfil: '/api/clasificar-perfil',
    validarRespuesta: '/api/validar-respuesta',
    obtenerFormulario: '/api/formulario',
    guardarPerfil: '/api/perfil',
    obtenerPerfil: '/api/perfil/:id',
  },
};

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}
```

#### 2.2 API Client (`api.client.ts`)

**Propósito:** Cliente HTTP centralizado con manejo de errores.

```typescript
class APIClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private defaultTimeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.defaultHeaders = API_CONFIG.headers;
    this.defaultTimeout = API_CONFIG.timeout;
  }

  async post<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<APIResponse<T>> {
    try {
      const { timeout = this.defaultTimeout, ...fetchOptions } = options;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const url = this.buildURL(endpoint);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          ...fetchOptions.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...fetchOptions,
      });

      clearTimeout(timeoutId);

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // GET, PUT, DELETE methods...
}

export const apiClient = new APIClient(); // Singleton
```

**Características:**
- ✅ Timeout configurable
- ✅ Manejo centralizado de errores
- ✅ Abort controller para cancelación
- ✅ Singleton pattern
- ✅ Type-safe responses

#### 2.3 Perfil Service (`perfil.service.ts`)

**Propósito:** Encapsular toda la lógica de perfiles.

```typescript
class PerfilService {
  /**
   * Clasifica un perfil usando los parámetros directamente
   */
  async clasificarPerfilSimple(
    respuestas: RespuestasFormulario,
    grado: Grado,
    estudianteId: string
  ): Promise<APIResponse<PerfilEstudiante>> {
    return this.clasificarPerfil({
      respuestas,
      grado,
      estudiante_id: estudianteId,
    });
  }

  /**
   * Clasifica las respuestas del formulario y genera un perfil completo
   */
  async clasificarPerfil(
    request: ClasificarPerfilRequest
  ): Promise<APIResponse<PerfilEstudiante>> {
    try {
      console.log('📤 Enviando request para clasificar perfil:', request);

      const response = await apiClient.post<PerfilEstudiante>(
        API_CONFIG.endpoints.clasificarPerfil,
        request
      );

      if (response.success && response.data) {
        console.log('✅ Perfil clasificado:', response.data.categoria_principal);
      }

      return response;
    } catch (error) {
      console.error('❌ Error al clasificar perfil:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Otros métodos: validarRespuesta, obtenerPerfil, guardarPerfil...
}

export const perfilService = new PerfilService(); // Singleton
```

---

### 3. Components Layer

#### FormularioCategorizacion.tsx

**Propósito:** Componente orquestador del flujo completo.

```typescript
interface FormularioCategorizacionProps {
  grado: Grado;
  estudianteId: string;
  onComplete?: (perfil: PerfilEstudiante) => void;
}

export const FormularioCategorizacion: React.FC<FormularioCategorizacionProps> = ({
  grado,
  estudianteId,
  onComplete,
}) => {
  // Estado
  const [preguntas, setPreguntas] = useState<PreguntaFormulario[]>([]);
  const [respuestas, setRespuestas] = useState<RespuestasFormulario>({});
  const [perfil, setPerfil] = useState<PerfilEstudiante | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar preguntas al montar
  useEffect(() => {
    cargarPreguntas();
  }, [grado]);

  // Cargar preguntas desde el servicio
  const cargarPreguntas = async () => {
    try {
      const response = await formularioService.obtenerFormulario(grado);
      if (response.success && response.data) {
        setPreguntas(response.data.preguntas);
      }
    } catch (err) {
      setError('Error al cargar el formulario');
    }
  };

  // Manejar cambio de respuesta
  const handleRespuestaChange = (preguntaId: string, respuesta: string) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: respuesta,
    }));
  };

  // Enviar formulario completo al backend
  const clasificarPerfil = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await perfilService.clasificarPerfilSimple(
        respuestas,
        grado,
        estudianteId
      );

      if (response.success && response.data) {
        setPerfil(response.data);
        onComplete?.(response.data);
      } else {
        setError(response.error || 'Error al clasificar perfil');
      }
    } catch (err) {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  // Render...
  return (
    <div className="formulario-categorizacion">
      {/* Render de preguntas */}
      {/* Botón de envío */}
      {/* Mostrar perfil si existe */}
    </div>
  );
};
```

**Flujo del componente:**

```
1. Mount → useEffect → cargarPreguntas()
2. Usuario responde → handleRespuestaChange()
3. Enviar → clasificarPerfil()
4. Backend procesa → setPerfil()
5. Mostrar resultados / onComplete callback
```

---

## 🔧 Configuración

### Variables de Entorno

**`.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**`.env.example`:**
```env
# URL de la API (backend)
# Desarrollo: http://localhost:8000
# Producción: https://api.tu-dominio.com
NEXT_PUBLIC_API_URL=http://localhost:8000

# Timeout de las peticiones HTTP (en milisegundos)
NEXT_PUBLIC_API_TIMEOUT=30000

# Modo de desarrollo
NODE_ENV=development
```

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Producción
npm start

# Linting
npm run lint
```

---

## 📊 Ventajas de la Arquitectura

### Type Safety Completo

```typescript
// ✅ Correcto - TypeScript valida
const perfil: PerfilEstudiante = await perfilService.clasificarPerfilSimple(
  respuestas,
  "3-4",  // ✅ Tipo válido: Grado
  "EST001"
);

// ❌ Error en tiempo de compilación
const perfil = await perfilService.clasificarPerfilSimple(
  respuestas,
  "7-8",  // ❌ Error: Type '"7-8"' is not assignable to type 'Grado'
  "EST001"
);
```

### Reutilización de Servicios

```typescript
// En cualquier componente o página:
import { perfilService } from '@/services';

const MiComponente = () => {
  const clasificar = async () => {
    const response = await perfilService.clasificarPerfilSimple(
      respuestas,
      grado,
      id
    );
    // ...
  };
};
```

### Testing Facilitado

```typescript
// Mock del servicio para testing
jest.mock('@/services/perfil.service');

test('debe clasificar perfil correctamente', async () => {
  const mockPerfil = { /* ... */ };
  perfilService.clasificarPerfilSimple.mockResolvedValue({
    success: true,
    data: mockPerfil
  });

  // Test...
});
```

---

## 📝 Próximos Pasos

### Mejoras Planificadas

1. **Validación de Formularios**
   - Usar React Hook Form
   - Validación en tiempo real
   - Mensajes de error personalizados

2. **Estado Global**
   - Context API o Zustand
   - Persistencia en localStorage
   - Sincronización entre tabs

3. **UI/UX Mejorado**
   - Loading skeletons
   - Animaciones de transición
   - Modo oscuro

4. **Testing**
   - Jest + React Testing Library
   - Tests unitarios de servicios
   - Tests de integración de componentes

---

## 🔗 Enlaces Relacionados

- **Documentación completa:** `frontend/sistema-categorizacion/ARQUITECTURA.md`
- **Backend API:** `backend/README.md`
- **Integración:** `INTEGRACION_FRONTEND_BACKEND.md`

---

**Archivo:** `docs/20251117/01-frontend-sistema-categorizacion.md`
**Última actualización:** 2025-11-17
