# 🎓 Sistema Educativo Adaptativo - Frontend Unificado

Frontend unificado del Sistema Educativo Adaptativo con IA. Combina el sistema de categorización de perfiles y ejercicios personalizados en una sola aplicación.

## 📋 Descripción

Aplicación web Next.js que integra:

- **Onboarding:** Categorización de perfil estudiantil (uso único)
- **Sistema Principal:** Ejercicios personalizados con IA (uso recurrente)
- **Dashboard:** Progreso, estadísticas y configuración

## 🏗️ Arquitectura

### Stack Tecnológico

```
Frontend (Este proyecto):
├── Next.js 14+ (App Router)
├── React 18+
├── TypeScript
├── Tailwind CSS
└── Fetch API (HTTP Client)

Backend (Separado - Supabase):
├── Supabase Edge Functions (Deno + TypeScript)
├── PostgreSQL Database
└── Gemini AI (Generación de ejercicios)
```

### Separación de Responsabilidades

```
┌─────────────────────────────────────────┐
│  FRONTEND (Este proyecto)               │
│  ├─ UI/UX y componentes React           │
│  ├─ Routing y navegación                │
│  ├─ Estado de la aplicación             │
│  └─ Llamadas HTTP a la API              │
└────────────┬────────────────────────────┘
             │ HTTP/REST
             ▼
┌─────────────────────────────────────────┐
│  BACKEND (supabase/)                    │
│  ├─ Edge Functions (API REST)           │
│  ├─ Base de datos PostgreSQL            │
│  ├─ Lógica de negocio                   │
│  └─ Integración con Gemini AI           │
└─────────────────────────────────────────┘
```

**IMPORTANTE:** Este frontend NO tiene dependencia directa de Supabase. Solo hace llamadas HTTP a la API REST (Edge Functions).

## 📁 Estructura del Proyecto

```
frontend-unificado/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                    # Rutas de autenticación
│   │   ├── (onboarding)/              # Onboarding (categorización)
│   │   ├── (estudiante)/              # App principal (ejercicios)
│   │   └── layout.tsx
│   │
│   ├── components/                    # Componentes React
│   │   ├── onboarding/                # Componentes de categorización
│   │   ├── ejercicios/                # Componentes de ejercicios
│   │   ├── layout/                    # Layouts (Header, Sidebar, etc)
│   │   └── ui/                        # Componentes UI reutilizables
│   │
│   ├── services/                      # 🔥 Servicios de API (HTTP)
│   │   ├── perfil.service.ts          # API de perfiles
│   │   ├── ejercicios.service.ts      # API de ejercicios
│   │   └── estadisticas.service.ts    # API de estadísticas
│   │
│   ├── lib/                           # Utilidades y configuración
│   │   ├── api-config.ts              # Configuración de API
│   │   └── http-client.ts             # Cliente HTTP centralizado
│   │
│   ├── types/                         # Definiciones TypeScript
│   │   ├── perfil.types.ts
│   │   └── ejercicios.types.ts
│   │
│   ├── hooks/                         # React Hooks personalizados
│   │   ├── usePerfil.ts
│   │   └── useEjercicios.ts
│   │
│   └── utils/                         # Funciones utilitarias
│
├── public/                            # Assets estáticos
├── .env.example                       # Variables de entorno ejemplo
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🔌 Servicios de API

### Arquitectura de Servicios

Los servicios **solo hacen llamadas HTTP** a las Edge Functions de Supabase:

```typescript
// ❌ NO SE USA (no hay dependencia de Supabase en frontend)
import { createClient } from '@supabase/supabase-js';

// ✅ SE USA (llamadas HTTP puras)
import { httpClient } from '@/lib/http-client';
import { API_ENDPOINTS } from '@/lib/api-config';
```

### Ejemplo de Uso

```typescript
import { PerfilService } from '@/services/perfil.service';

// Clasificar perfil (POST a Edge Function)
const result = await PerfilService.clasificarPerfil({
  estudiante_id: 'EST001',
  grado: '3-4',
  respuestas: { P1: 'A', P2: 'B', ... }
});

if (result.success && result.perfil) {
  console.log('Categoría:', result.perfil.categoria_principal);
}
```

### Servicios Disponibles

| Servicio | Archivo | Métodos |
|----------|---------|---------|
| **Perfiles** | `perfil.service.ts` | `clasificarPerfil()`, `obtenerPerfil()`, `tienePerfil()` |
| **Ejercicios** | `ejercicios.service.ts` | `generarEjercicios()`, `guardarRespuesta()`, `validarRespuesta()` |
| **Estadísticas** | `estadisticas.service.ts` | `obtenerEstadisticasEstudiante()`, `obtenerEstadisticasGenerales()` |

## ⚙️ Configuración

### 1. Instalar Dependencias

```bash
cd frontend-unificado
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.example .env.local
nano .env.local
```

**Contenido de .env.local:**

```env
# URL de la API (Supabase Edge Functions)
# Desarrollo local:
NEXT_PUBLIC_API_BASE_URL=http://localhost:54321/functions/v1

# Producción:
# NEXT_PUBLIC_API_BASE_URL=https://your-project-ref.supabase.co/functions/v1
```

**NOTA:** Solo necesitas la URL base. No necesitas API keys de Supabase ni ninguna otra configuración de Supabase.

### 3. Iniciar Desarrollo

```bash
# Terminal 1: Iniciar Supabase (backend)
cd ../supabase
supabase start

# Terminal 2: Iniciar Next.js (frontend)
cd ../frontend-unificado
npm run dev
```

Aplicación disponible en: http://localhost:3000

## 🛣️ Rutas de la Aplicación

### Flujo de Usuario

```
1. Primera Visita
   / → /onboarding/bienvenida → /onboarding/formulario → /onboarding/resultado

2. Uso Normal (con perfil)
   / → /dashboard → /ejercicios/matematicas | /ejercicios/verbal

3. Otras Rutas
   /perfil → Ver/editar perfil
   /progreso → Estadísticas y evolución
```

### Grupos de Rutas (App Router)

```typescript
app/
├── (auth)/              // Rutas públicas
│   ├── login/
│   └── register/
│
├── (onboarding)/        // Onboarding (una vez)
│   ├── bienvenida/
│   ├── formulario/
│   └── resultado/
│
└── (estudiante)/        // App principal (protegido)
    ├── dashboard/
    ├── ejercicios/
    │   ├── matematicas/
    │   └── verbal/
    ├── perfil/
    └── progreso/
```

## 🔒 Seguridad

### Variables de Entorno

```env
# ✅ CORRECTO - Variables públicas (NEXT_PUBLIC_)
NEXT_PUBLIC_API_BASE_URL=https://...

# ❌ INCORRECTO - Nunca expongas keys privadas
# SUPABASE_SERVICE_KEY=xxx  # ¡ESTO VA EN EL BACKEND!
```

### Protección de Rutas

El middleware protege automáticamente las rutas:

- Sin perfil → Redirect a `/onboarding`
- Con perfil → Acceso a `/dashboard` y `/ejercicios`

## 🧪 Testing

### Desarrollo Local

```bash
# 1. Asegurarse que el backend está corriendo
cd ../supabase
supabase status

# 2. Iniciar frontend
npm run dev

# 3. Navegar a http://localhost:3000
```

### Test de Servicios

```typescript
// En DevTools Console o en un componente de test
import { PerfilService } from '@/services/perfil.service';

// Test de clasificar perfil
const result = await PerfilService.clasificarPerfil({
  estudiante_id: 'TEST001',
  grado: '3-4',
  respuestas: {
    P1: 'A', P2: 'B', P3: 'B', P4: 'A', P5: 'B',
    P6: 'B', P7: 'A', P8: 'A', P9: 'B', P10: 'A'
  }
});

console.log(result);
```

## 📚 Documentación Adicional

- **Backend (Supabase):** Ver `../supabase/README.md`
- **API Documentation:** Ver `../supabase/docs/`
- **Tests HTTP:** Ver `../supabase/test/`

## 🚀 Deployment

### Build de Producción

```bash
npm run build
npm start
```

### Variables de Entorno en Producción

```env
NEXT_PUBLIC_API_BASE_URL=https://your-project-ref.supabase.co/functions/v1
```

### Plataformas Recomendadas

- **Vercel** (recomendado para Next.js)
- **Netlify**
- **Railway**
- **Render**

## 🎯 Próximos Pasos

1. ✅ Estructura base creada
2. ✅ Servicios de API implementados
3. ⏳ Configurar App Router con grupos
4. ⏳ Migrar componentes de categorización
5. ⏳ Migrar componentes de ejercicios
6. ⏳ Implementar middleware de protección
7. ⏳ Agregar Tailwind y estilos

## 📧 Soporte

Para problemas con:
- **Frontend:** Este repositorio
- **Backend/API:** Ver `../supabase/docs/TROUBLESHOOTING.md`

---

**Arquitectura:** Frontend separado → Backend Supabase (API REST)

**Sin dependencia de Supabase en frontend**
