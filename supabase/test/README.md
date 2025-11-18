# 🧪 Tests de Edge Functions - Supabase

Colección de tests HTTP para todas las Edge Functions del proyecto.

## 📋 Requisitos

### Opción 1: VS Code REST Client (Recomendado)

1. Instalar la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
2. Abrir cualquier archivo `.http`
3. Click en "Send Request" sobre cada test

### Opción 2: IntelliJ IDEA HTTP Client

Los archivos `.http` son compatibles con el HTTP Client integrado de IntelliJ IDEA.

### Opción 3: cURL

Copiar y adaptar las peticiones a comandos cURL.

## 🔧 Configuración

### 1. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp http-client.env.example http-client.env.json

# Editar con tus valores
nano http-client.env.json
```

**Formato de http-client.env.json:**

```json
{
  "local": {
    "baseUrl": "http://localhost:54321/functions/v1",
    "anonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "production": {
    "baseUrl": "https://your-project-ref.supabase.co/functions/v1",
    "anonKey": "your-real-anon-key"
  }
}
```

### 2. Iniciar Supabase local (para tests locales)

```bash
# En el directorio raíz del proyecto
supabase start

# Las funciones estarán en: http://localhost:54321/functions/v1
```

## 📁 Archivos de Test

| Archivo | Descripción | Tests |
|---------|-------------|-------|
| `clasificar-perfil.http` | Clasificación de perfiles estudiantiles | 7 |
| `generar-ejercicios.http` | Generación de ejercicios con Gemini AI | 12 |
| `guardar-respuesta.http` | Guardar respuestas de estudiantes | 11 |
| `validar-respuesta.http` | Validar respuestas sin guardar | 10 |
| `obtener-perfil.http` | Obtener perfil de estudiante | 11 |
| `obtener-estadisticas.http` | Estadísticas del sistema | 12 |

**Total: 63 tests**

## 🚀 Cómo Usar

### Con REST Client (VS Code)

1. Abrir archivo `.http` (ejemplo: `clasificar-perfil.http`)
2. Verás enlaces "Send Request" sobre cada petición
3. Click en "Send Request"
4. Ver respuesta en panel lateral

**Atajos de teclado:**
- `Ctrl+Alt+R` (Windows/Linux) o `Cmd+Alt+R` (Mac) - Enviar request actual
- `Ctrl+Alt+L` (Windows/Linux) o `Cmd+Alt+L` (Mac) - Cancelar request

### Cambiar entre ambientes

En cada archivo `.http`, las variables `@baseUrl` y `@anonKey` determinan el ambiente:

```http
### Para local
@baseUrl = http://localhost:54321/functions/v1
@anonKey = eyJhbGciOiJI...

### Para producción (comentar/descomentar)
# @baseUrl = https://your-project-ref.supabase.co/functions/v1
# @anonKey = your-real-anon-key
```

## 📝 Orden Recomendado de Tests

### 1. Setup inicial

```
1. clasificar-perfil.http (TEST 1, 2, 3)
   → Crear 3 estudiantes con perfiles

2. obtener-perfil.http (TEST 1, 2, 3)
   → Verificar que los perfiles se crearon
```

### 2. Generación de ejercicios

```
3. generar-ejercicios.http (TEST 1, 4)
   → Generar ejercicios de matemáticas y verbal

4. generar-ejercicios.http (TEST 2, 5)
   → Generar ejercicios de tipos específicos
```

### 3. Sistema de respuestas

```
5. guardar-respuesta.http (TEST 1-6)
   → Guardar diferentes tipos de respuestas

6. validar-respuesta.http (TEST 1-4)
   → Validar respuestas sin guardarlas
```

### 4. Estadísticas

```
7. obtener-estadisticas.http (TEST 1, 2, 3)
   → Ver estadísticas generales y por estudiante
```

## 🧪 Casos de Test por Función

### clasificar-perfil.http

- ✅ Clasificación básica (3 grados diferentes)
- ✅ Perfil de alto riesgo
- ❌ Datos incompletos
- ❌ Grado inválido
- ✅ Sin datos opcionales

### generar-ejercicios.http

- ✅ Generación básica (matemáticas y verbal)
- ✅ Tipo específico de ejercicio
- ✅ Nivel forzado
- ✅ Cantidad máxima (10 ejercicios)
- ❌ Estudiante sin perfil
- ❌ Curso inválido
- ❌ Datos incompletos

### guardar-respuesta.http

- ✅ Respuesta correcta/incorrecta
- ✅ Con sesión
- ✅ Con metadata (dispositivo)
- ✅ Diferentes tiempos de respuesta
- ✅ Serie de respuestas
- ❌ Ejercicio no existe
- ❌ Datos incompletos

### validar-respuesta.http

- ✅ Validar todas las opciones (A, B, C, D)
- ✅ Respuesta correcta/incorrecta
- ❌ Ejercicio no existe
- ❌ Datos incompletos

### obtener-perfil.http

- ✅ Perfiles existentes
- ✅ Perfil recién creado
- ❌ Estudiante sin perfil
- ❌ Sin parámetro estudiante_id

### obtener-estadisticas.http

- ✅ Estadísticas generales
- ✅ Estadísticas por estudiante
- ✅ Estudiante sin actividad
- ✅ Evolución de estadísticas
- ✅ Distribución por categorías
- ✅ Distribución por nivel de riesgo

## 📊 Interpretación de Resultados

### Códigos de Estado

- `200` - Éxito
- `400` - Error de validación (datos incorrectos)
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

### Respuesta Exitosa Típica

```json
{
  "success": true,
  "mensaje": "Operación exitosa",
  "data": { ... }
}
```

### Respuesta de Error Típica

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## 🐛 Troubleshooting

### Error: "Connection refused"

```bash
# Verificar que Supabase local está corriendo
supabase status

# Si no está corriendo, iniciar
supabase start
```

### Error: "Function not found"

```bash
# Desplegar las funciones
supabase functions deploy clasificar-perfil
supabase functions deploy generar-ejercicios
# ... etc
```

### Error: "Invalid API key"

1. Verificar que `@anonKey` esté correctamente configurada
2. Para local, usar la key de `supabase status`
3. Para producción, usar la key del dashboard de Supabase

### Error: "GEMINI_API_KEY not configured"

```bash
# Configurar el secret
supabase secrets set GEMINI_API_KEY=your-key-here

# Verificar
supabase secrets list
```

## 📈 Métricas de Tests

Para ejecutar todos los tests y generar métricas:

```bash
# Crear script de automatización
./run-all-tests.sh

# Ver resultados
cat test-results.json
```

## 🔒 Seguridad

**IMPORTANTE:**

1. **NUNCA** commitear `http-client.env.json` con keys reales
2. El archivo está en `.gitignore` por defecto
3. Usar keys de desarrollo/local para tests
4. En producción, usar keys con permisos mínimos necesarios

## 📚 Recursos Adicionales

- [REST Client Docs](https://github.com/Huachao/vscode-restclient)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [HTTP Client IntelliJ](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)

## 🤝 Contribuir

Para agregar nuevos tests:

1. Crear archivo `nueva-funcion.http`
2. Seguir el formato de los existentes
3. Incluir casos de éxito y error
4. Documentar en este README

---

**Happy Testing! 🚀**
