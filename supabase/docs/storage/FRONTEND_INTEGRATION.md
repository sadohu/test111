# 📘 Guía de Integración Frontend → Supabase

Esta guía muestra cómo integrar los frontends Next.js existentes con el nuevo backend de Supabase.

## 📋 Resumen de Cambios

### Antes (Python/FastAPI)
```typescript
// API directa con fetch
const response = await fetch('http://localhost:8000/api/clasificar-perfil', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### Después (Supabase)
```typescript
// Cliente de Supabase + Edge Functions
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { data, error } = await supabase.functions.invoke('clasificar-perfil', {
  body: data
});
```

---

## 🔧 Paso 1: Instalar Dependencias

### Frontend de Categorización

```bash
cd categorizacion/frontend

# Instalar cliente de Supabase
npm install @supabase/supabase-js

# Verificar package.json
npm list @supabase/supabase-js
```

### Frontend de Sistema de Ejercicios

```bash
cd sistema-ejercicio/frontend

# Instalar cliente de Supabase
npm install @supabase/supabase-js

# Verificar package.json
npm list @supabase/supabase-js
```

---

## ⚙️ Paso 2: Configurar Variables de Entorno

### Categorización Frontend

```bash
cd categorizacion/frontend

# Editar .env.local
nano .env.local
```

**Contenido:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Old Backend (deprecado - mantener por compatibilidad temporal)
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Sistema de Ejercicios Frontend

```bash
cd sistema-ejercicio/frontend

# Editar .env.local
nano .env.local
```

**Contenido:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Gemini API Key (si se usa desde frontend - NO RECOMENDADO)
# NEXT_PUBLIC_GEMINI_API_KEY=  # Mejor usar solo backend

# Old Backend (deprecado)
# NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

## 🔌 Paso 3: Crear Cliente de Supabase

### Crear archivo de configuración

**Archivo:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

// Validar que las variables estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Crear cliente singleton
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Cambiar a true si usas autenticación
  },
});

// Tipos para TypeScript
export interface Perfil {
  estudiante_id: string;
  grado: string;
  estilo_aprendizaje: string;
  velocidad: string;
  atencion: string;
  interes: string;
  nivel_matematicas: string;
  nivel_lectura: string;
  motivacion: string;
  frustracion: string;
  trabajo: string;
  energia: string;
  categoria_principal: string;
  nivel_riesgo: string;
  recomendaciones: string[];
  confianza_perfil: number;
  respuestas_originales: Record<string, string>;
}

export interface Ejercicio {
  ejercicio_id: string;
  titulo: string;
  enunciado: string;
  opciones: string[];
  respuesta_correcta: string;
  explicacion: string;
  nivel: string;
  tipo: string;
  curso: string;
  operacion_principal?: string;
  contexto?: string;
  incluye_visual?: boolean;
}

export interface Respuesta {
  respuesta_id: string;
  estudiante_id: string;
  ejercicio_id: string;
  sesion_id?: string;
  curso: string;
  respuesta_seleccionada: string;
  es_correcta: boolean;
  tiempo_respuesta_ms?: number;
}
```

---

## 🎯 Paso 4: Migrar Servicios

### A. Servicio de Perfiles

**Antes (`src/services/perfil.service.ts`):**

```typescript
export async function clasificarPerfil(data: any) {
  const response = await fetch('http://localhost:8000/api/clasificar-perfil', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

**Después:**

```typescript
import { supabase, type Perfil } from '@/lib/supabase';

export async function clasificarPerfil(data: {
  estudiante_id: string;
  grado: string;
  nombre?: string;
  apellido?: string;
  edad?: number;
  respuestas: Record<string, string>;
}): Promise<{ success: boolean; perfil?: Perfil; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke(
      'clasificar-perfil',
      {
        body: data,
      }
    );

    if (error) {
      console.error('Error clasificando perfil:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      perfil: result.perfil,
    };
  } catch (error) {
    console.error('Error inesperado:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function obtenerPerfil(
  estudianteId: string
): Promise<{ success: boolean; perfil?: Perfil; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke(
      'obtener-perfil',
      {
        body: { estudiante_id: estudianteId },
      }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, perfil: result.perfil };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
```

### B. Servicio de Ejercicios

**Archivo:** `src/services/ejercicios.service.ts`

```typescript
import { supabase, type Ejercicio } from '@/lib/supabase';

export async function generarEjercicios(data: {
  estudiante_id: string;
  curso: 'matematicas' | 'verbal';
  cantidad?: number;
  tipo_especifico?: string;
  forzar_nivel?: string;
}): Promise<{
  success: boolean;
  ejercicios?: Ejercicio[];
  error?: string;
}> {
  try {
    const { data: result, error } = await supabase.functions.invoke(
      'generar-ejercicios',
      {
        body: data,
      }
    );

    if (error) {
      console.error('Error generando ejercicios:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      ejercicios: result.ejercicios,
    };
  } catch (error) {
    console.error('Error inesperado:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function guardarRespuesta(data: {
  estudiante_id: string;
  ejercicio_id: string;
  sesion_id?: string;
  curso: 'matematicas' | 'verbal';
  respuesta_seleccionada: string;
  tiempo_respuesta_ms?: number;
  dispositivo?: string;
}): Promise<{
  success: boolean;
  es_correcta?: boolean;
  respuesta_correcta?: string;
  explicacion?: string;
  error?: string;
}> {
  try {
    const { data: result, error } = await supabase.functions.invoke(
      'guardar-respuesta',
      {
        body: data,
      }
    );

    if (error) {
      console.error('Error guardando respuesta:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      es_correcta: result.es_correcta,
      respuesta_correcta: result.respuesta_correcta,
      explicacion: result.explicacion,
    };
  } catch (error) {
    console.error('Error inesperado:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export async function validarRespuesta(
  ejercicioId: string,
  respuesta: string
): Promise<{
  success: boolean;
  es_correcta?: boolean;
  respuesta_correcta?: string;
  explicacion?: string;
  error?: string;
}> {
  try {
    const { data: result, error } = await supabase.functions.invoke(
      'validar-respuesta',
      {
        body: {
          ejercicio_id: ejercicioId,
          respuesta: respuesta,
        },
      }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      es_correcta: result.es_correcta,
      respuesta_correcta: result.respuesta_correcta,
      explicacion: result.explicacion,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
```

### C. Servicio de Estadísticas

**Archivo:** `src/services/estadisticas.service.ts`

```typescript
import { supabase } from '@/lib/supabase';

export async function obtenerEstadisticas(estudianteId?: string): Promise<{
  success: boolean;
  estadisticas?: any;
  error?: string;
}> {
  try {
    const body = estudianteId ? { estudiante_id: estudianteId } : {};

    const { data: result, error } = await supabase.functions.invoke(
      'obtener-estadisticas',
      {
        body,
      }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      estadisticas: result.estadisticas,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
```

---

## 🔄 Paso 5: Actualizar Componentes

### Ejemplo: Componente de Formulario

**Antes:**

```typescript
const handleSubmit = async (respuestas: Record<string, string>) => {
  const response = await fetch('http://localhost:8000/api/clasificar-perfil', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      estudiante_id: 'EST001',
      grado: '3-4',
      respuestas,
    }),
  });

  const data = await response.json();
  setPerfil(data);
};
```

**Después:**

```typescript
import { clasificarPerfil } from '@/services/perfil.service';

const handleSubmit = async (respuestas: Record<string, string>) => {
  setLoading(true);
  setError(null);

  const result = await clasificarPerfil({
    estudiante_id: 'EST001',
    grado: '3-4',
    nombre: 'Juan',
    apellido: 'Pérez',
    respuestas,
  });

  if (result.success && result.perfil) {
    setPerfil(result.perfil);
  } else {
    setError(result.error || 'Error al clasificar perfil');
  }

  setLoading(false);
};
```

---

## 🧪 Paso 6: Testing

### Test en Desarrollo Local

```bash
# Terminal 1: Iniciar Supabase
cd supabase
supabase start

# Terminal 2: Iniciar frontend
cd categorizacion/frontend
npm run dev
```

### Test de Integración

1. Abrir http://localhost:3000
2. Completar formulario
3. Verificar en DevTools:
   - Network tab → Ver llamadas a Supabase
   - Console → Ver logs
4. Verificar en Supabase Dashboard:
   - Table Editor → Ver datos guardados

---

## 📊 Paso 7: Acceso Directo a Base de Datos (Opcional)

Además de Edge Functions, puedes acceder directamente a las tablas:

```typescript
// Leer perfiles directamente
const { data: perfiles, error } = await supabase
  .from('perfiles')
  .select('*')
  .eq('estudiante_id', 'EST001')
  .eq('activo', true)
  .single();

// Leer ejercicios
const { data: ejercicios, error } = await supabase
  .from('ejercicios_generados')
  .select('*')
  .eq('estudiante_id', 'EST001')
  .eq('curso', 'matematicas')
  .limit(10);

// Insertar respuesta directamente (alternativa a Edge Function)
const { data, error } = await supabase
  .from('respuestas')
  .insert({
    respuesta_id: `RESP_${Date.now()}`,
    estudiante_id: 'EST001',
    ejercicio_id: 'MAT_001',
    curso: 'matematicas',
    respuesta_seleccionada: 'A',
    es_correcta: true,
  });
```

**Ventajas:**
- Más rápido (sin Edge Function)
- Menos latencia

**Desventajas:**
- No hay validación de negocio
- No se calculan cosas automáticamente (ej: es_correcta)

**Recomendación:** Usar Edge Functions para escritura, acceso directo para lectura.

---

## 🔒 Paso 8: Seguridad

### Variables de Entorno

```env
# ✅ CORRECTO - Prefijo NEXT_PUBLIC_ para variables públicas
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# ❌ INCORRECTO - Service role key NUNCA en frontend
# SUPABASE_SERVICE_KEY=eyJ...
```

### Row Level Security (RLS)

Las políticas RLS ya están configuradas en las migraciones. Para personalizarlas:

```sql
-- Ver políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'perfiles';

-- Crear política más restrictiva
CREATE POLICY "Users can only see their own profile"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);  -- Requiere auth de Supabase
```

---

## ✅ Checklist de Migración

### Frontend de Categorización

- [ ] `@supabase/supabase-js` instalado
- [ ] Variables de entorno configuradas
- [ ] Cliente de Supabase creado (`lib/supabase.ts`)
- [ ] Servicio de perfiles migrado
- [ ] Componente de formulario actualizado
- [ ] Tests manuales exitosos
- [ ] Verificación en Supabase Dashboard

### Frontend de Ejercicios

- [ ] `@supabase/supabase-js` instalado
- [ ] Variables de entorno configuradas
- [ ] Cliente de Supabase creado
- [ ] Servicio de ejercicios migrado
- [ ] Servicio de respuestas migrado
- [ ] Componentes actualizados
- [ ] Tests manuales exitosos
- [ ] Flujo completo probado (generar → responder → ver resultados)

---

## 📚 Recursos

- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Edge Functions from Client](https://supabase.com/docs/guides/functions/invoke)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**Migración completada:** _______________

**Notas:** _______________
