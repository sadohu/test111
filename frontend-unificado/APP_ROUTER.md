# App Router - Estructura y Navegación

Este documento explica la estructura del App Router de Next.js 14 implementada en el frontend unificado.

## Tabla de Contenidos

- [Estructura de Rutas](#estructura-de-rutas)
- [Route Groups](#route-groups)
- [Middleware](#middleware)
- [Navegación](#navegación)
- [Estados Especiales](#estados-especiales)
- [Próximos Pasos](#próximos-pasos)

## Estructura de Rutas

```
src/app/
├── layout.tsx              # Layout raíz (Inter font, metadata)
├── page.tsx                # Página raíz (redirige a /login)
├── loading.tsx             # Estado de carga global
├── error.tsx               # Error boundary global
├── not-found.tsx           # Página 404
│
├── (auth)/                 # Route group: Autenticación
│   ├── layout.tsx          # Layout centrado con fondo degradado
│   ├── login/
│   │   └── page.tsx        # Página de login
│   └── registro/
│       └── page.tsx        # Página de registro
│
├── (onboarding)/           # Route group: Onboarding
│   ├── layout.tsx          # Layout con header y progreso
│   └── categorizar/
│       └── page.tsx        # Cuestionario de categorización
│
└── (estudiante)/           # Route group: Área de estudiantes
    ├── layout.tsx          # Layout con navbar y sidebar
    ├── ejercicios/
    │   └── page.tsx        # Dashboard de ejercicios
    ├── reportes/
    │   └── page.tsx        # Reportes y estadísticas
    └── perfil/
        └── page.tsx        # Perfil del estudiante
```

## Route Groups

Los **route groups** se indican con paréntesis `(nombre)` y permiten organizar rutas sin afectar la URL.

### 1. Route Group: `(auth)`

**Propósito**: Páginas de autenticación y registro

**Layout**: `src/app/(auth)/layout.tsx`
- Fondo degradado educativo
- Logo y título centrados
- Sin navegación (páginas standalone)

**Rutas**:
- `/login` - Inicio de sesión
- `/registro` - Crear cuenta nueva
- `/recuperar-password` - Recuperación de contraseña (TODO)

**Comportamiento**:
- Si el usuario YA está autenticado → redirige a `/ejercicios`
- Si el usuario NO está autenticado → permite el acceso

### 2. Route Group: `(onboarding)`

**Propósito**: Proceso de configuración inicial del perfil

**Layout**: `src/app/(onboarding)/layout.tsx`
- Header con logo
- Barra de progreso visible
- Footer informativo

**Rutas**:
- `/categorizar` - Cuestionario de 10 preguntas

**Comportamiento**:
- Requiere autenticación previa
- Solo se accede después del registro o si no se ha completado el perfil
- Al finalizar → redirige a `/ejercicios`

### 3. Route Group: `(estudiante)`

**Propósito**: Área principal de la aplicación para estudiantes

**Layout**: `src/app/(estudiante)/layout.tsx`
- Navbar superior con logo y navegación
- Sidebar móvil responsive
- Botón de logout
- Navegación entre secciones

**Rutas**:
- `/ejercicios` - Dashboard principal, generación de ejercicios
- `/reportes` - Estadísticas y progreso del estudiante
- `/perfil` - Información del perfil de aprendizaje

**Comportamiento**:
- Requiere autenticación
- TODO: Verificar que el usuario tenga perfil clasificado

## Middleware

**Archivo**: `middleware.ts` (raíz del proyecto)

### Funcionalidad

El middleware intercepta todas las peticiones y:

1. **Protege rutas privadas**: `/ejercicios`, `/reportes`, `/perfil`, `/categorizar`
   - Si NO hay token → redirige a `/login?redirect=<ruta-original>`

2. **Previene acceso a auth si ya está autenticado**
   - Si hay token y accede a `/login` o `/registro` → redirige a `/ejercicios`

3. **TODO: Verificar perfil clasificado**
   - Si hay token pero NO tiene perfil → redirige a `/categorizar`

### Configuración del Token

Actualmente el middleware busca el token en cookies:

```typescript
const authToken = request.cookies.get('auth_token')?.value;
```

Para establecer el token después del login:

```typescript
// En el componente de login
document.cookie = `auth_token=${token}; path=/; max-age=86400`; // 24 horas
```

O usando la API de Next.js:

```typescript
// En una Route Handler
import { cookies } from 'next/headers';

cookies().set('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 86400, // 24 horas
});
```

## Navegación

### Navegación programática

```typescript
import { useRouter } from 'next/navigation';

function MyComponent() {
  const router = useRouter();

  // Navegar a una ruta
  router.push('/ejercicios');

  // Navegar con reemplazo (no añade a historial)
  router.replace('/login');

  // Volver atrás
  router.back();

  // Refrescar página
  router.refresh();
}
```

### Links declarativos

```tsx
import Link from 'next/link';

<Link href="/ejercicios">
  Ir a ejercicios
</Link>

// Con clase activa
<Link
  href="/reportes"
  className={pathname === '/reportes' ? 'active' : ''}
>
  Reportes
</Link>
```

### Obtener ruta actual

```tsx
'use client';
import { usePathname } from 'next/navigation';

function NavBar() {
  const pathname = usePathname();

  return (
    <nav>
      <a className={pathname === '/ejercicios' ? 'active' : ''}>
        Ejercicios
      </a>
    </nav>
  );
}
```

## Estados Especiales

### Loading State

**Archivo**: `src/app/loading.tsx`

Se muestra automáticamente cuando Next.js está navegando entre páginas o cargando datos.

```tsx
// loading.tsx se activa automáticamente
export default function Loading() {
  return <Spinner />;
}
```

También puedes usar Suspense manualmente:

```tsx
import { Suspense } from 'react';

<Suspense fallback={<Loading />}>
  <ComponenteConDatos />
</Suspense>
```

### Error Boundary

**Archivo**: `src/app/error.tsx`

Captura errores no manejados en componentes cliente.

```tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h1>Error: {error.message}</h1>
      <button onClick={reset}>Intentar de nuevo</button>
    </div>
  );
}
```

### Not Found (404)

**Archivo**: `src/app/not-found.tsx`

Se muestra cuando se accede a una ruta inexistente.

También puedes invocarla manualmente:

```tsx
import { notFound } from 'next/navigation';

function UserProfile({ params }) {
  const user = await getUser(params.id);

  if (!user) {
    notFound(); // Muestra not-found.tsx
  }

  return <div>{user.name}</div>;
}
```

## Flujo de Usuario

### 1. Primera Visita

```
Usuario accede a "/"
  → page.tsx redirige a "/login"
  → (auth)/login/page.tsx
  → Usuario ingresa credenciales
  → Se guarda token en cookies
  → Middleware detecta token
  → Redirige a "/categorizar" (si no tiene perfil)
  → (onboarding)/categorizar/page.tsx
  → Usuario completa cuestionario
  → Redirige a "/ejercicios"
  → (estudiante)/ejercicios/page.tsx
```

### 2. Usuario Registrado con Perfil

```
Usuario accede a "/"
  → page.tsx redirige a "/login"
  → Middleware detecta token
  → Redirige a "/ejercicios"
  → (estudiante)/ejercicios/page.tsx
```

### 3. Usuario Accede a Ruta Protegida sin Auth

```
Usuario accede a "/reportes"
  → Middleware detecta falta de token
  → Redirige a "/login?redirect=/reportes"
  → Usuario hace login
  → Redirige a "/reportes"
```

## Layouts Anidados

Los layouts se heredan jerárquicamente:

```
app/layout.tsx (raíz)
  └── (estudiante)/layout.tsx
      └── ejercicios/page.tsx
```

Resultado final renderizado:

```tsx
<RootLayout>           {/* Inter font, metadata */}
  <EstudianteLayout>   {/* Navbar, sidebar */}
    <EjerciciosPage /> {/* Contenido de la página */}
  </EstudianteLayout>
</RootLayout>
```

## Metadata

Cada página puede definir su metadata:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ejercicios | Sistema Educativo',
  description: 'Genera y practica ejercicios personalizados',
};

export default function EjerciciosPage() {
  // ...
}
```

O dinámicamente:

```tsx
export async function generateMetadata({ params }) {
  const user = await getUser(params.id);

  return {
    title: `${user.name} | Sistema Educativo`,
  };
}
```

## Próximos Pasos

### 1. Integrar Servicios HTTP

Reemplazar los `TODO` en las páginas con llamadas reales a los servicios:

```tsx
// En login/page.tsx
import { AuthService } from '@/services/auth.service';

const response = await AuthService.login({
  email: formData.email,
  password: formData.password,
});

document.cookie = `auth_token=${response.token}; path=/`;
```

### 2. Implementar Context de Autenticación

Crear un contexto global para manejar el estado de autenticación:

```tsx
// src/contexts/AuthContext.tsx
'use client';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ...
};
```

### 3. Verificación de Perfil en Middleware

Agregar lógica para verificar si el usuario tiene perfil clasificado:

```typescript
// middleware.ts
const hasPerfil = request.cookies.get('has_perfil')?.value === 'true';

if (authToken && !hasPerfil && !pathname.startsWith('/categorizar')) {
  return NextResponse.redirect(new URL('/categorizar', request.url));
}
```

### 4. Server Components y Data Fetching

Aprovechar React Server Components para fetching de datos:

```tsx
// app/(estudiante)/reportes/page.tsx
async function ReportesPage() {
  const stats = await fetch('http://api/estadisticas/EST001');
  const data = await stats.json();

  return <ReporteDashboard data={data} />;
}
```

### 5. Route Handlers para API

Crear endpoints internos si necesitas proxy a Supabase:

```typescript
// app/api/ejercicios/route.ts
export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch('http://supabase/generar-ejercicios', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return Response.json(await response.json());
}
```

## Recursos

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

---

**Última actualización**: 2025-01-18
