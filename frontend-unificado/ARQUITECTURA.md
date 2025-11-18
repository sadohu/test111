# 🏗️ Arquitectura del Sistema Educativo Adaptativo

## 📊 Visión General

```
┌────────────────────────────────────────────────────────────────┐
│                    USUARIO (Estudiante)                         │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│              FRONTEND (frontend-unificado/)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js 14 + React 18 + TypeScript                      │  │
│  │  ├─ App Router (grupos de rutas)                         │  │
│  │  ├─ Componentes React (onboarding + ejercicios)          │  │
│  │  ├─ Servicios HTTP (sin Supabase cliente)                │  │
│  │  └─ Estado local + Hooks                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            │ HTTP/REST (fetch API)
                            │
┌───────────────────────────▼────────────────────────────────────┐
│              BACKEND (supabase/)                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Edge Functions (Deno + TypeScript)                      │  │
│  │  ├─ clasificar-perfil                                    │  │
│  │  ├─ generar-ejercicios                                   │  │
│  │  ├─ guardar-respuesta                                    │  │
│  │  ├─ validar-respuesta                                    │  │
│  │  ├─ obtener-perfil                                       │  │
│  │  └─ obtener-estadisticas                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│  ┌─────────────────────────▼──────────────────────────────┐    │
│  │  PostgreSQL Database                                   │    │
│  │  ├─ estudiantes                                        │    │
│  │  ├─ perfiles                                           │    │
│  │  ├─ ejercicios_generados                               │    │
│  │  ├─ respuestas                                         │    │
│  │  └─ sesiones                                           │    │
│  └────────────────────────────────────────────────────────┘    │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            │ API HTTP
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                   SERVICIOS EXTERNOS                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Google Gemini AI                                        │  │
│  │  └─ Generación de ejercicios personalizados             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## 🔑 Principios de Diseño

### 1. Separación de Responsabilidades

```
FRONTEND:
✅ Presentación y UI/UX
✅ Routing y navegación
✅ Estado de la aplicación
✅ Validación de formularios
✅ Interacción del usuario

BACKEND:
✅ Lógica de negocio
✅ Validación de datos
✅ Persistencia en BD
✅ Integración con IA
✅ Seguridad y autenticación
```

### 2. Sin Acoplamiento entre Frontend y Backend

**Frontend NO depende de Supabase:**
- ❌ No usa `@supabase/supabase-js`
- ❌ No conoce la estructura de la BD
- ✅ Solo hace llamadas HTTP a una API REST
- ✅ Puede cambiar el backend sin afectar el frontend

**Backend es completamente independiente:**
- ✅ Edge Functions expuestas como API REST
- ✅ Puede ser consumido por cualquier cliente
- ✅ Puede evolucionar independientemente

### 3. Type Safety End-to-End

```typescript
// Frontend define sus tipos
interface Perfil {
  estudiante_id: string;
  categoria_principal: string;
  // ...
}

// Backend responde con el mismo contrato
{
  "success": true,
  "perfil": {
    "estudiante_id": "EST001",
    "categoria_principal": "El Científico Resiliente"
  }
}
```

## 📁 Estructura de Directorios

```
test111/
│
├── frontend-unificado/          # 🎨 FRONTEND (Este proyecto)
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   ├── components/          # Componentes React
│   │   ├── services/            # Servicios HTTP (API calls)
│   │   ├── lib/                 # HTTP client + config
│   │   ├── types/               # TypeScript types
│   │   ├── hooks/               # React hooks
│   │   └── utils/               # Utilidades
│   ├── public/                  # Assets estáticos
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/                    # 🔥 BACKEND (Separado)
│   ├── functions/               # Edge Functions (API)
│   │   ├── clasificar-perfil/
│   │   ├── generar-ejercicios/
│   │   ├── guardar-respuesta/
│   │   ├── validar-respuesta/
│   │   ├── obtener-perfil/
│   │   └── obtener-estadisticas/
│   ├── migrations/              # Esquema de BD
│   ├── docs/                    # Documentación
│   └── test/                    # Tests HTTP
│
├── categorizacion/              # ⚠️ DEPRECADO (legacy)
│   ├── backend-base-python/     # Python FastAPI (no usar)
│   └── frontend/                # Next.js (migrar de aquí)
│
└── sistema-ejercicio/           # ⚠️ DEPRECADO (legacy)
    ├── backend-base-python/     # Python FastAPI (no usar)
    └── frontend/                # Next.js (migrar de aquí)
```

## 🔄 Flujo de Datos

### 1. Onboarding (Clasificación de Perfil)

```
┌─────────────┐
│  Estudiante │
│  completa   │
│  formulario │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  FRONTEND: FormularioCategorizacion     │
│  - Renderiza 10 preguntas               │
│  - Valida respuestas                    │
│  - onClick submit                       │
└──────┬───────────────────────────────────┘
       │
       │ POST /clasificar-perfil
       │ { estudiante_id, grado, respuestas }
       ▼
┌──────────────────────────────────────────┐
│  BACKEND: Edge Function                 │
│  1. Recibe respuestas                   │
│  2. Ejecuta algoritmo de clasificación  │
│  3. Determina categoría y riesgo        │
│  4. Genera recomendaciones              │
│  5. Guarda en BD (tabla: perfiles)      │
└──────┬───────────────────────────────────┘
       │
       │ Response: { success, perfil }
       ▼
┌──────────────────────────────────────────┐
│  FRONTEND: ResultadoPerfil              │
│  - Muestra categoría                    │
│  - Muestra recomendaciones              │
│  - Redirect a /dashboard                │
└──────────────────────────────────────────┘
```

### 2. Generación de Ejercicios

```
┌─────────────┐
│  Estudiante │
│  elige      │
│  curso      │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────┐
│  FRONTEND: /ejercicios/matematicas      │
│  - onClick "Generar ejercicios"         │
└──────┬───────────────────────────────────┘
       │
       │ POST /generar-ejercicios
       │ { estudiante_id, curso, cantidad }
       ▼
┌──────────────────────────────────────────┐
│  BACKEND: Edge Function                 │
│  1. Obtiene perfil del estudiante       │
│  2. Determina nivel (básico/int/avz)    │
│  3. Construye prompt personalizado      │
│  4. Llama a Gemini AI                   │
│  5. Parsea respuesta JSON               │
│  6. Guarda en BD (tabla: ejercicios)    │
└──────┬───────────────────────────────────┘
       │
       │ Response: { success, ejercicios[] }
       ▼
┌──────────────────────────────────────────┐
│  FRONTEND: EjercicioCard                │
│  - Renderiza ejercicio                  │
│  - Usuario selecciona respuesta         │
│  - onClick "Responder"                  │
└──────┬───────────────────────────────────┘
       │
       │ POST /guardar-respuesta
       │ { ejercicio_id, respuesta }
       ▼
┌──────────────────────────────────────────┐
│  BACKEND: Edge Function                 │
│  1. Verifica respuesta correcta         │
│  2. Guarda en BD (tabla: respuestas)    │
│  3. Actualiza sesión                    │
└──────┬───────────────────────────────────┘
       │
       │ Response: { es_correcta, explicacion }
       ▼
┌──────────────────────────────────────────┐
│  FRONTEND: FeedbackPanel                │
│  - Muestra si es correcta               │
│  - Muestra explicación                  │
│  - Permite continuar                    │
└──────────────────────────────────────────┘
```

## 🌐 API REST (Contratos)

### Endpoints Disponibles

**Base URL:**
- **Local:** `http://localhost:54321/functions/v1`
- **Producción:** `https://your-project.supabase.co/functions/v1`

| Endpoint | Método | Request | Response |
|----------|--------|---------|----------|
| `/clasificar-perfil` | POST | `ClasificarPerfilRequest` | `ClasificarPerfilResponse` |
| `/obtener-perfil` | GET | `?estudiante_id=xxx` | `ObtenerPerfilResponse` |
| `/generar-ejercicios` | POST | `GenerarEjerciciosRequest` | `GenerarEjerciciosResponse` |
| `/guardar-respuesta` | POST | `GuardarRespuestaRequest` | `GuardarRespuestaResponse` |
| `/validar-respuesta` | POST | `ValidarRespuestaRequest` | `ValidarRespuestaResponse` |
| `/obtener-estadisticas` | GET | `?estudiante_id=xxx` (opcional) | `EstadisticasResponse` |

### Ejemplo de Contrato

```typescript
// REQUEST
interface GenerarEjerciciosRequest {
  estudiante_id: string;
  curso: 'matematicas' | 'verbal';
  cantidad?: number;
  tipo_especifico?: string;
}

// RESPONSE
interface GenerarEjerciciosResponse {
  success: boolean;
  mensaje?: string;
  ejercicios?: Ejercicio[];
  error?: string;
}
```

## 🔐 Seguridad

### Frontend

```typescript
// ✅ Solo variables públicas
NEXT_PUBLIC_API_BASE_URL=https://...

// ❌ Nunca en frontend
SUPABASE_SERVICE_KEY  // ¡NO!
GEMINI_API_KEY        // ¡NO!
```

### Backend

```typescript
// ✅ Secrets en Supabase
supabase secrets set GEMINI_API_KEY=xxx

// ✅ Row Level Security en BD
CREATE POLICY "users_read_own_data"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);
```

## 📱 Responsive Design

```
Mobile First:
├─ 320px+  : Mobile
├─ 768px+  : Tablet
└─ 1024px+ : Desktop

Tailwind Breakpoints:
├─ sm:  640px
├─ md:  768px
├─ lg:  1024px
├─ xl:  1280px
└─ 2xl: 1536px
```

## ⚡ Optimizaciones

### Frontend

```typescript
// Code splitting por ruta
app/(onboarding)/      // Solo carga en onboarding
app/(estudiante)/      // Solo carga en app principal

// Lazy loading de componentes
const EjercicioCard = lazy(() => import('@/components/ejercicios/EjercicioCard'));

// Memoización
const PerfilMemoizado = memo(PerfilCard);
```

### Backend

```typescript
// Cache en Edge Functions
const cachedPerfil = await cache.get(`perfil:${estudiante_id}`);

// Reintentos automáticos con backoff
for (let i = 0; i < 3; i++) {
  try {
    return await gemini.generate();
  } catch (error) {
    await sleep(1000 * i);
  }
}
```

## 🧪 Testing

### Frontend

```bash
# Unit tests (componentes)
npm run test

# E2E tests (Playwright/Cypress)
npm run test:e2e
```

### Backend

```bash
# Tests HTTP (REST Client)
cd ../supabase/test
# Abrir *.http en VS Code
```

## 📊 Monitoreo

```
Frontend:
├─ Vercel Analytics
├─ Sentry (errores)
└─ Google Analytics

Backend:
├─ Supabase Dashboard
├─ Edge Functions Logs
└─ Database Metrics
```

## 🚀 Deployment

### Frontend

```bash
# Vercel (recomendado)
vercel --prod

# Variables de entorno
NEXT_PUBLIC_API_BASE_URL=https://your-project.supabase.co/functions/v1
```

### Backend

```bash
# Supabase
supabase functions deploy
supabase db push
```

---

**Última actualización:** 18 de Noviembre, 2025

**Arquitectura:** Microservicios desacoplados con API REST
