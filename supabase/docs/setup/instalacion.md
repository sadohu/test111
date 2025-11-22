# 🚀 Guía de Setup Completo - Supabase Backend

Esta guía te llevará paso a paso desde cero hasta tener el backend completamente funcional.

## 📋 Requisitos Previos

- [ ] Node.js 18+ instalado
- [ ] Docker Desktop instalado y corriendo
- [ ] Git instalado
- [ ] Editor de código (VS Code recomendado)
- [ ] Cuenta de Google (para Gemini AI)
- [ ] Cuenta de Supabase (gratis en supabase.com)

---

## 📦 Paso 1: Instalar Supabase CLI

### macOS / Linux

```bash
# Usando Homebrew
brew install supabase/tap/supabase

# Verificar instalación
supabase --version
```

### Windows

```bash
# Usando Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Verificar instalación
supabase --version
```

### Alternativa: npm (todas las plataformas)

```bash
npm install -g supabase

# Verificar instalación
supabase --version
```

**Versión esperada:** v1.123.0 o superior

---

## 🔑 Paso 2: Obtener Credenciales

### 2.1. Crear Proyecto en Supabase

1. Ir a https://supabase.com
2. Crear cuenta / Login
3. Click en "New Project"
4. Configurar:
   - **Name:** sistema-educativo-dev (o el nombre que prefieras)
   - **Database Password:** (guardar en lugar seguro)
   - **Region:** South America (más cercano a Perú)
5. Click "Create new project"
6. Esperar 2-3 minutos mientras se crea

### 2.2. Obtener API Keys

En tu proyecto de Supabase:

1. Ir a **Settings** → **API**
2. Copiar:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (para frontend)
   - **service_role key:** `eyJhbGc...` (para backend, ¡mantener secreto!)

### 2.3. Obtener Gemini AI API Key

1. Ir a https://makersuite.google.com/app/apikey
2. Login con cuenta de Google
3. Click "Create API Key"
4. Seleccionar proyecto de Google Cloud (o crear uno nuevo)
5. Copiar la API key generada

**Importante:** La API key se muestra solo UNA VEZ. Guárdala de inmediato.

---

## 🔧 Paso 3: Configurar Proyecto Local

### 3.1. Clonar repositorio

```bash
git clone https://github.com/sadohu/test111.git
cd test111

# Cambiar a la rama de Supabase
git checkout claude/supabase-migration-backend-01K9Jo9RwQQDGU6JwcFCXDfJ
```

### 3.2. Configurar Supabase CLI

```bash
# Login a Supabase
supabase login

# Link al proyecto creado
supabase link --project-ref xxxxx  # Usar el ref de tu proyecto

# Verificar link
supabase status
```

**Nota:** El project ref está en la URL de tu proyecto: `https://xxxxx.supabase.co`

### 3.3. Configurar Variables de Entorno

```bash
cd supabase

# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus valores reales
nano .env  # o usar tu editor preferido
```

**Contenido de .env:**

```env
# URL de tu proyecto Supabase
SUPABASE_URL=https://xxxxx.supabase.co

# Anon key (pública, para frontend)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key (PRIVADA, solo backend)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Key de Google Gemini
GEMINI_API_KEY=AIzaSyC...

# Modelo de Gemini (dejar como está)
GEMINI_MODEL=gemini-pro
```

**⚠️ IMPORTANTE:** NUNCA commitear el archivo `.env` con valores reales.

---

## 🗄️ Paso 4: Configurar Base de Datos

### 4.1. Aplicar Migraciones

```bash
# Desde el directorio supabase/
supabase db push

# Deberías ver:
# ✓ Applying migration 20250101000000_initial_schema.sql...
# ✓ Database migrations complete!
```

### 4.2. Verificar Tablas Creadas

```bash
# Conectar a la base de datos
supabase db remote connect

# En el prompt de psql:
\dt

# Deberías ver 5 tablas:
# - estudiantes
# - perfiles
# - ejercicios_generados
# - respuestas
# - sesiones

# Salir de psql
\q
```

### 4.3. (Opcional) Cargar Datos de Ejemplo

```bash
# Ejecutar seed data
supabase db seed

# Esto crea 3 estudiantes y 3 perfiles de ejemplo
```

**Estudiantes creados:**
- EST001 - Juan Pérez (3-4 grado)
- EST002 - María García (1-2 grado)
- EST003 - Carlos López (5-6 grado)

---

## 🔥 Paso 5: Desplegar Edge Functions

### 5.1. Configurar Secrets

```bash
# Configurar API key de Gemini
supabase secrets set GEMINI_API_KEY=AIzaSyC...

# Verificar que se guardó
supabase secrets list

# Deberías ver:
# GEMINI_API_KEY (created)
```

### 5.2. Desplegar Funciones

```bash
# Desplegar todas las funciones una por una
cd functions

supabase functions deploy clasificar-perfil
supabase functions deploy generar-ejercicios
supabase functions deploy guardar-respuesta
supabase functions deploy validar-respuesta
supabase functions deploy obtener-perfil
supabase functions deploy obtener-estadisticas

# Verificar despliegue
supabase functions list
```

**Output esperado:**
```
┌────────────────────────┬────────┬─────────┐
│ NAME                   │ STATUS │ VERSION │
├────────────────────────┼────────┼─────────┤
│ clasificar-perfil      │ ACTIVE │ 1       │
│ generar-ejercicios     │ ACTIVE │ 1       │
│ guardar-respuesta      │ ACTIVE │ 1       │
│ validar-respuesta      │ ACTIVE │ 1       │
│ obtener-perfil         │ ACTIVE │ 1       │
│ obtener-estadisticas   │ ACTIVE │ 1       │
└────────────────────────┴────────┴─────────┘
```

### 5.3. Automatizar Despliegue (Opcional)

```bash
# Crear script de despliegue
cat > deploy-all.sh << 'EOF'
#!/bin/bash
cd supabase/functions
for func in */; do
  echo "Desplegando $(basename "$func")..."
  supabase functions deploy $(basename "$func")
done
echo "✅ Todas las funciones desplegadas"
EOF

chmod +x deploy-all.sh

# Ejecutar
./deploy-all.sh
```

---

## ✅ Paso 6: Verificar Instalación

### 6.1. Test de Conectividad

```bash
# Obtener la URL base
SUPABASE_URL=$(supabase status | grep "API URL" | awk '{print $3}')
ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')

# Test básico
curl -i "${SUPABASE_URL}/functions/v1/clasificar-perfil" \
  -H "Authorization: Bearer ${ANON_KEY}"

# Respuesta esperada: 400 (falta body, pero la función está activa)
```

### 6.2. Test de Clasificación de Perfil

```bash
curl -X POST "${SUPABASE_URL}/functions/v1/clasificar-perfil" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "TEST001",
    "grado": "3-4",
    "respuestas": {
      "P1": "A", "P2": "B", "P3": "B", "P4": "A", "P5": "B",
      "P6": "B", "P7": "A", "P8": "A", "P9": "B", "P10": "A"
    }
  }'
```

**Respuesta esperada (200 OK):**
```json
{
  "success": true,
  "mensaje": "Perfil clasificado y guardado exitosamente",
  "perfil": {
    "estudiante_id": "TEST001",
    "categoria_principal": "El Científico Resiliente",
    "nivel_riesgo": "bajo",
    ...
  }
}
```

### 6.3. Test de Generación de Ejercicios

```bash
curl -X POST "${SUPABASE_URL}/functions/v1/generar-ejercicios" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "TEST001",
    "curso": "matematicas",
    "cantidad": 2
  }'
```

**Respuesta esperada (200 OK):**
```json
{
  "success": true,
  "mensaje": "2 ejercicio(s) generado(s) exitosamente",
  "ejercicios": [...]
}
```

---

## 🧪 Paso 7: Configurar Tests HTTP

### 7.1. Instalar REST Client (VS Code)

1. Abrir VS Code
2. Ir a Extensions (Ctrl+Shift+X)
3. Buscar "REST Client"
4. Instalar extensión de Huachao Huang

### 7.2. Configurar Variables

```bash
cd supabase/test

# Copiar ejemplo
cp http-client.env.example http-client.env.json

# Editar con tus valores
nano http-client.env.json
```

**Contenido:**
```json
{
  "production": {
    "baseUrl": "https://xxxxx.supabase.co/functions/v1",
    "anonKey": "eyJhbGc..."
  }
}
```

### 7.3. Ejecutar Tests

1. Abrir `clasificar-perfil.http`
2. Click en "Send Request" sobre TEST 1
3. Ver respuesta en panel lateral
4. Continuar con otros tests

---

## 📊 Verificación Final - Checklist

- [ ] Supabase CLI instalado y funcional
- [ ] Proyecto de Supabase creado y linkeado
- [ ] API Keys de Supabase obtenidas
- [ ] Gemini API Key obtenida
- [ ] Variables de entorno configuradas
- [ ] Migraciones aplicadas (5 tablas creadas)
- [ ] Datos seed cargados (opcional)
- [ ] Secrets configurados (GEMINI_API_KEY)
- [ ] 6 Edge Functions desplegadas y ACTIVE
- [ ] Test de clasificar-perfil exitoso
- [ ] Test de generar-ejercicios exitoso
- [ ] REST Client instalado y configurado
- [ ] Tests HTTP funcionando

---

## 🎯 Próximos Pasos

1. **Ejecutar suite completa de tests:**
   - Abrir archivos en `supabase/test/`
   - Ejecutar en orden recomendado

2. **Integrar con frontend:**
   - Actualizar URLs en frontends Next.js
   - Instalar `@supabase/supabase-js`
   - Configurar cliente de Supabase

3. **Monitorear:**
   ```bash
   # Ver logs en tiempo real
   supabase functions logs --tail

   # Ver estadísticas
   # Ir a dashboard: https://app.supabase.com
   ```

---

## 🆘 Ayuda

Si encuentras problemas:

1. **Revisar logs:**
   ```bash
   supabase functions logs <nombre-funcion> --tail
   ```

2. **Consultar troubleshooting:**
   - Ver `supabase/docs/TROUBLESHOOTING.md`

3. **Verificar status:**
   ```bash
   supabase status
   ```

4. **Resetear (último recurso):**
   ```bash
   supabase db reset
   supabase db push
   # Volver a desplegar funciones
   ```

---

## 📚 Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Gemini AI Docs](https://ai.google.dev/docs)
- [REST Client Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

---

**¡Felicidades! Tu backend Supabase está listo para usar. 🎉**

**Setup completado el:** _______________

**Proyecto ID:** _______________

**Notas adicionales:**
_________________________________
_________________________________
_________________________________
