# 🐛 Errores Comunes y Soluciones

## 📋 Índice

- [Errores de Setup](#errores-de-setup)
- [Errores de Edge Functions](#errores-de-edge-functions)
- [Errores de Base de Datos](#errores-de-base-de-datos)
- [Errores en Tests](#errores-en-tests)
- [Errores de Gemini AI](#errores-de-gemini-ai)

---

## 🔧 Errores de Setup

### Error: "supabase: command not found"

**Problema:** Supabase CLI no está instalado.

**Solución:**
```bash
# macOS/Linux
brew install supabase/tap/supabase

# npm (todas las plataformas)
npm install -g supabase

# Verificar instalación
supabase --version
```

### Error: "Project ref is required"

**Problema:** No has linkado tu proyecto local con Supabase.

**Solución:**
```bash
# Login primero
supabase login

# Crear proyecto en https://supabase.com primero, luego:
supabase link --project-ref your-project-ref

# Verificar
supabase status
```

### Error: "Docker daemon not running"

**Problema:** Supabase local requiere Docker.

**Solución:**
```bash
# Iniciar Docker Desktop

# Verificar que Docker está corriendo
docker ps

# Luego iniciar Supabase
supabase start
```

---

## 🔥 Errores de Edge Functions

### Error: "Function not found"

**Problema:** La Edge Function no está desplegada.

**Solución:**
```bash
# Desplegar función específica
supabase functions deploy clasificar-perfil

# Desplegar todas las funciones
cd supabase/functions
for func in */; do
  supabase functions deploy $(basename "$func")
done

# Verificar
supabase functions list
```

### Error: "GEMINI_API_KEY not configured"

**Problema:** El secret de Gemini AI no está configurado.

**Solución:**
```bash
# Configurar el secret
supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here

# Verificar secrets
supabase secrets list

# IMPORTANTE: Después de configurar secrets, redesplegar las funciones
supabase functions deploy generar-ejercicios
```

**Obtener API Key de Gemini:**
1. Ir a https://makersuite.google.com/app/apikey
2. Crear nuevo proyecto o usar existente
3. Generar API key
4. Copiar y usar en el comando anterior

### Error: "Invalid API key" en generar-ejercicios

**Problema:** La API key de Gemini es inválida o expiró.

**Solución:**
```bash
# Verificar que la key es válida probando directamente
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'

# Si falla, generar nueva key y actualizar
supabase secrets set GEMINI_API_KEY=new-key-here

# Redesplegar
supabase functions deploy generar-ejercicios
```

### Error: "Authorization header required"

**Problema:** No se está enviando el header de autorización.

**Solución:**
```bash
# Para tests con cURL, siempre incluir:
curl -X POST 'http://localhost:54321/functions/v1/clasificar-perfil' \
  -H 'Authorization: Bearer ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{...}'

# Obtener ANON_KEY local:
supabase status | grep anon_key

# Para producción, obtener de:
# https://app.supabase.com/project/_/settings/api
```

### Error: "CORS policy blocked"

**Problema:** Frontend no puede acceder a las Edge Functions.

**Solución:**

Las Edge Functions ya tienen CORS habilitado por defecto, pero verifica:

```typescript
// En cada index.ts, asegurarte que existe:
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Y el handler OPTIONS:
if (req.method === "OPTIONS") {
  return new Response("ok", { headers: corsHeaders });
}
```

Si necesitas restringir orígenes:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://tu-dominio.com",
  // ...
};
```

---

## 💾 Errores de Base de Datos

### Error: "relation 'estudiantes' does not exist"

**Problema:** Las migraciones no se han aplicado.

**Solución:**
```bash
# Aplicar migraciones
supabase db push

# Verificar que las tablas existen
supabase db remote list

# Si necesitas resetear (CUIDADO: borra todos los datos)
supabase db reset
```

### Error: "duplicate key value violates unique constraint"

**Problema:** Intentando insertar un `estudiante_id` que ya existe.

**Solución:**
```bash
# Verificar estudiantes existentes
supabase db remote connect

# En psql:
SELECT estudiante_id FROM estudiantes;

# Usar un ID diferente en tus tests
# O eliminar el existente:
DELETE FROM estudiantes WHERE estudiante_id = 'EST001';
```

### Error: "insert or update violates foreign key constraint"

**Problema:** Intentando guardar una respuesta para un ejercicio que no existe.

**Solución:**
```sql
-- Verificar que el ejercicio existe
SELECT ejercicio_id FROM ejercicios_generados
WHERE ejercicio_id = 'MAT_INT_001';

-- Si no existe, generarlo primero con la función
-- POST /functions/v1/generar-ejercicios
```

### Error: "new row violates row-level security policy"

**Problema:** Las políticas RLS están bloqueando la inserción.

**Solución:**
```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'estudiantes';

-- Temporalmente deshabilitar RLS para testing (NO EN PRODUCCIÓN)
ALTER TABLE estudiantes DISABLE ROW LEVEL SECURITY;

-- Mejor: usar el service_role key para bypass RLS
-- En tu request:
Authorization: Bearer SERVICE_ROLE_KEY
```

---

## 🧪 Errores en Tests

### Error: "ejercicio_id 'MAT_INT_001' not found"

**Problema:** Los tests HTTP usan IDs de ejercicios que no existen.

**Solución:**

**Opción 1: Setup de datos inicial**
```bash
# Ejecutar seed data
cd supabase
supabase db seed
```

**Opción 2: Generar ejercicios primero**
```http
### Ejecutar ANTES de guardar-respuesta.http
POST {{baseUrl}}/generar-ejercicios
Authorization: Bearer {{anonKey}}
Content-Type: application/json

{
  "estudiante_id": "EST001",
  "curso": "matematicas",
  "cantidad": 5
}

### Copiar los ejercicio_id generados y usarlos en tests
```

**Opción 3: Usar variables en REST Client**
```http
### Generar y guardar en variable
# @name generarEjercicio
POST {{baseUrl}}/generar-ejercicios
{...}

### Usar el ID generado
@ejercicioId = {{generarEjercicio.response.body.ejercicios[0].ejercicio_id}}

POST {{baseUrl}}/guardar-respuesta
{
  "ejercicio_id": "{{ejercicioId}}",
  ...
}
```

### Error: "estudiante_id 'EST001' has no active profile"

**Problema:** No se ejecutaron los tests de clasificar-perfil primero.

**Solución:**

**ORDEN CORRECTO de tests:**
```
1. clasificar-perfil.http (TEST 1, 2, 3)
   → Crear perfiles de EST001, EST002, EST003

2. obtener-perfil.http (TEST 1, 2, 3)
   → Verificar que se crearon

3. generar-ejercicios.http
   → Ya pueden generarse ejercicios

4. guardar-respuesta.http
   → Ya pueden guardarse respuestas
```

### Error: "Request timeout" en generar-ejercicios

**Problema:** Gemini AI está tardando mucho o la API está caída.

**Solución:**
```bash
# Verificar estado de Gemini AI
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY"

# Reducir cantidad de ejercicios en el test
{
  "cantidad": 1  // En lugar de 10
}

# Aumentar timeout en REST Client (VS Code)
# Agregar a settings.json:
{
  "rest-client.timeoutinmilliseconds": 60000
}
```

### Error: "Cannot read property 'ejercicios' of undefined"

**Problema:** La respuesta de Gemini no tiene el formato esperado.

**Solución:**

Revisar logs de la función:
```bash
# Ver logs en tiempo real
supabase functions logs generar-ejercicios --tail

# Ver últimos errores
supabase functions logs generar-ejercicios --limit 50
```

Posibles causas:
1. Gemini AI retornó error
2. El prompt está mal formateado
3. La respuesta no es JSON válido

---

## 🤖 Errores de Gemini AI

### Error: "Gemini API quota exceeded"

**Problema:** Excediste el límite gratuito de Gemini API.

**Solución:**
```bash
# Verificar tu cuota en:
# https://makersuite.google.com/app/apikey

# Opciones:
# 1. Esperar al reset mensual
# 2. Actualizar a plan de pago
# 3. Usar otra API key con cuota disponible

# Mientras tanto, reducir cantidad de ejercicios generados
```

### Error: "Safety settings blocked response"

**Problema:** Gemini bloqueó la respuesta por seguridad.

**Solución:**

Ajustar el prompt para evitar contenido sensible:
```typescript
// En generar-ejercicios/index.ts
const requestBody = {
  contents: [...],
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    // Agregar más categorías si es necesario
  ]
};
```

### Error: "Invalid JSON response from Gemini"

**Problema:** Gemini no retornó JSON válido.

**Solución:**

Esto está implementado en el código, pero si falla:
```typescript
// Agregar limpieza más agresiva
let textoLimpio = textoRespuesta.trim();

// Eliminar markdown
textoLimpio = textoLimpio.replace(/^```json\s*/gm, "");
textoLimpio = textoLimpio.replace(/^```\s*/gm, "");
textoLimpio = textoLimpio.replace(/```$/gm, "");

// Eliminar texto antes y después del JSON
const jsonMatch = textoLimpio.match(/\{[\s\S]*\}/);
if (jsonMatch) {
  textoLimpio = jsonMatch[0];
}

const resultado = JSON.parse(textoLimpio);
```

---

## 🔄 Flujo de Troubleshooting

```
┌─────────────────────────────────────┐
│  1. Verificar Supabase está corriendo │
│     supabase status                  │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  2. Verificar funciones desplegadas  │
│     supabase functions list          │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  3. Verificar secrets configurados   │
│     supabase secrets list            │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  4. Verificar migraciones aplicadas  │
│     supabase db remote list          │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  5. Ver logs de errores              │
│     supabase functions logs <nombre> │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  6. Ejecutar tests en orden          │
│     clasificar-perfil → generar →    │
│     guardar → estadísticas           │
└─────────────────────────────────────┘
```

---

## 📞 Soporte Adicional

### Logs Detallados

```bash
# Ver logs de función específica
supabase functions logs clasificar-perfil --tail

# Ver logs de todas las funciones
supabase functions logs --tail

# Ver logs de base de datos
supabase db logs
```

### Resetear Ambiente Local

```bash
# CUIDADO: Esto borra todos los datos locales
supabase stop
supabase db reset
supabase start

# Volver a aplicar migraciones
supabase db push

# Volver a desplegar funciones
for func in supabase/functions/*/; do
  supabase functions deploy $(basename "$func")
done

# Volver a configurar secrets
supabase secrets set GEMINI_API_KEY=your-key
```

### Verificar Conectividad

```bash
# Test de conectividad local
curl http://localhost:54321/health

# Test de Edge Function
curl -i http://localhost:54321/functions/v1/clasificar-perfil \
  -H 'Authorization: Bearer ANON_KEY'

# Si retorna 404, la función no está desplegada
# Si retorna 401, el anon key es incorrecto
# Si retorna 400, falta el body
```

---

## 📚 Referencias

- [Supabase Troubleshooting](https://supabase.com/docs/guides/getting-started/troubleshooting)
- [Edge Functions Debugging](https://supabase.com/docs/guides/functions/debugging)
- [Gemini API Documentation](https://ai.google.dev/docs)

---

**Última actualización:** 18 de Noviembre, 2025
