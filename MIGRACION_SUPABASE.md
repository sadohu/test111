# 🚀 Migración a Supabase - Sistema Educativo Adaptativo

## 📝 Resumen de Cambios

Este documento describe la migración de los backends Python/FastAPI a Supabase con Edge Functions.

## 🗂 Nueva Estructura del Proyecto

```
test111/
│
├── categorizacion/
│   ├── backend-base-python/      # ⚠️ DEPRECADO - Backend Python original
│   └── frontend/                  # Frontend Next.js (sin cambios)
│
├── sistema-ejercicio/
│   ├── backend-base-python/      # ⚠️ DEPRECADO - Backend Python original
│   └── frontend/                  # Frontend Next.js (sin cambios)
│
├── supabase/                      # ✨ NUEVO - Backend Supabase
│   ├── config.toml               # Configuración de Supabase
│   ├── .env.example              # Variables de entorno
│   ├── README.md                 # Documentación completa
│   │
│   ├── functions/                # Edge Functions (TypeScript/Deno)
│   │   ├── clasificar-perfil/    # Clasificación de perfiles
│   │   ├── generar-ejercicios/   # Generación con Gemini AI
│   │   ├── guardar-respuesta/    # Guardar respuestas
│   │   ├── validar-respuesta/    # Validar respuestas
│   │   ├── obtener-perfil/       # Obtener perfil
│   │   └── obtener-estadisticas/ # Estadísticas
│   │
│   ├── migrations/               # Migraciones de base de datos
│   │   └── 20250101000000_initial_schema.sql
│   │
│   └── seed/                     # Datos de ejemplo
│       └── seed.sql
│
└── docs/                         # Documentación del proyecto
```

## 🔄 Mapping Backend Python → Supabase

### Categorización de Perfiles

| Python (FastAPI) | Supabase (Edge Function) |
|------------------|--------------------------|
| `POST /api/clasificar-perfil` | `POST /functions/v1/clasificar-perfil` |
| `GET /api/perfil/{id}` | `GET /functions/v1/obtener-perfil` |
| `GET /api/perfiles` | Tabla `perfiles` (acceso directo) |
| `GET /api/estadisticas` | `GET /functions/v1/obtener-estadisticas` |

### Sistema de Ejercicios

| Python (FastAPI) | Supabase (Edge Function) |
|------------------|--------------------------|
| `POST /api/generar-ejercicios` | `POST /functions/v1/generar-ejercicios` |
| `POST /api/generar-ejercicios/matematicas` | Mismo endpoint con parámetro `curso` |
| `POST /api/generar-ejercicios/verbal` | Mismo endpoint con parámetro `curso` |
| `POST /api/guardar-respuesta` | `POST /functions/v1/guardar-respuesta` |
| `POST /api/validar-respuesta` | `POST /functions/v1/validar-respuesta` |

## 📊 Cambios en la Base de Datos

### De JSON a PostgreSQL

**Antes (Python):**
- Almacenamiento en `backend/data/perfiles.json`
- Sin relaciones
- Sin validación de esquema
- Sin queries complejas

**Ahora (Supabase):**
- PostgreSQL nativo
- Relaciones entre tablas (Foreign Keys)
- Validación automática (constraints)
- Queries SQL potentes
- Row Level Security (RLS)
- Vistas y funciones SQL

### Nuevas Tablas

1. **estudiantes** - Información de estudiantes
2. **perfiles** - Perfiles clasificados
3. **ejercicios_generados** - Ejercicios generados por IA
4. **respuestas** - Respuestas de estudiantes
5. **sesiones** - Sesiones de práctica

## 🎯 Ventajas de la Migración

### 1. Serverless y Escalable

- ❌ Python: Necesitas servidor, Uvicorn, gestión de procesos
- ✅ Supabase: Serverless, escala automáticamente

### 2. Base de Datos Integrada

- ❌ Python: JSON local, necesitas configurar Supabase por separado
- ✅ Supabase: PostgreSQL incluido, listo para usar

### 3. Type Safety

- ❌ Python: Pydantic para validación
- ✅ Supabase: TypeScript end-to-end + validación SQL

### 4. Edge Computing

- ❌ Python: Un solo servidor, latencia variable
- ✅ Supabase: Edge Functions global, latencia ultra-baja

### 5. Costos

- ❌ Python: Servidor 24/7, CPU, RAM
- ✅ Supabase: Pay-as-you-go, tier gratuito generoso

### 6. Autenticación

- ❌ Python: Implementar desde cero
- ✅ Supabase: Auth built-in (JWT, OAuth, etc.)

### 7. Real-time

- ❌ Python: Necesitas WebSockets, configuración compleja
- ✅ Supabase: Real-time subscriptions incluidas

## 🚀 Cómo Empezar

### 1. Setup Inicial

```bash
# Navegar al directorio de Supabase
cd supabase

# Copiar configuración
cp .env.example .env

# Editar con tus credenciales
nano .env
```

### 2. Instalar Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# npm
npm install -g supabase
```

### 3. Link al Proyecto

```bash
# Login
supabase login

# Link (crea proyecto en supabase.com primero)
supabase link --project-ref your-project-ref
```

### 4. Desplegar

```bash
# Aplicar migraciones
supabase db push

# Desplegar funciones
supabase functions deploy clasificar-perfil
supabase functions deploy generar-ejercicios
supabase functions deploy guardar-respuesta
supabase functions deploy validar-respuesta
supabase functions deploy obtener-perfil
supabase functions deploy obtener-estadisticas

# Configurar secrets
supabase secrets set GEMINI_API_KEY=your-key-here
```

## 🔧 Actualizar Frontends

Los frontends de Next.js necesitarán actualizarse para apuntar a las nuevas URLs:

### Antes (Python Backend)
```typescript
const API_URL = "http://localhost:8000/api"
```

### Ahora (Supabase)
```typescript
const SUPABASE_URL = "https://your-project.supabase.co"
const SUPABASE_ANON_KEY = "your-anon-key"

// Usando el cliente de Supabase
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Para Edge Functions
const { data, error } = await supabase.functions.invoke('clasificar-perfil', {
  body: { estudiante_id: 'EST001', grado: '3-4', respuestas: {...} }
})

// Para acceso directo a tablas
const { data, error } = await supabase
  .from('perfiles')
  .select('*')
  .eq('estudiante_id', 'EST001')
```

## 📚 Documentación Completa

Para más detalles, consulta:
- **supabase/README.md** - Documentación completa del backend Supabase
- **Supabase Docs** - https://supabase.com/docs
- **Edge Functions Guide** - https://supabase.com/docs/guides/functions

## ⚠️ Backends Python Deprecados

Los directorios `backend-base-python` están mantenidos como referencia pero **NO DEBEN USARSE** en producción.

**Razones:**
- Arquitectura legacy
- No escala
- Requiere mantenimiento manual
- Costos más altos

**Recomendación:** Migrar frontends a Supabase lo antes posible y deprecar completamente los backends Python.

## 🎉 Próximos Pasos

1. ✅ Migración de backend completada
2. ⏳ Actualizar frontends para usar Supabase
3. ⏳ Testing end-to-end
4. ⏳ Deploy a producción
5. ⏳ Deprecar backends Python

## 📧 Soporte

Para preguntas sobre la migración, consulta:
- README en `supabase/README.md`
- Documentación oficial de Supabase
- Issues del repositorio

---

**Migración completada el: 18 de Noviembre, 2025**
