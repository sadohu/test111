# 🚀 Backend Supabase - Sistema Educativo Adaptativo

Backend completo desarrollado con Supabase y Edge Functions para el sistema educativo adaptativo con IA.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Edge Functions](#edge-functions)
- [Base de Datos](#base-de-datos)
- [Deployment](#deployment)
- [Migración desde Python](#migración-desde-python)

## 🎯 Descripción

Este proyecto es una migración completa de los backends Python/FastAPI a Supabase con Edge Functions (TypeScript/Deno). Proporciona:

- **Clasificación de perfiles estudiantiles** basada en formularios psicopedagógicos
- **Generación de ejercicios personalizados** usando Google Gemini AI
- **Sistema de tracking de respuestas** y progreso
- **Estadísticas y analytics** en tiempo real
- **Almacenamiento persistente** en PostgreSQL (Supabase)

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Categorización  │         │ Sistema Ejercicios│          │
│  │    Frontend      │         │     Frontend      │          │
│  └────────┬─────────┘         └────────┬─────────┘          │
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            │ HTTPS                        │ HTTPS
            ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTIONS (Deno)                  │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ clasificar-perfil│  │generar-ejercicios│                 │
│  └──────────────────┘  └──────────────────┘                 │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │guardar-respuesta │  │ obtener-perfil   │                 │
│  └──────────────────┘  └──────────────────┘                 │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │validar-respuesta │  │obtener-estadísticas│               │
│  └──────────────────┘  └──────────────────┘                 │
└───────────┬─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│            SUPABASE PostgreSQL Database                      │
│                                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐            │
│  │estudiantes│ │ perfiles │ │ejercicios_generados│          │
│  └──────────┘ └──────────┘ └──────────────────┘            │
│  ┌──────────┐ ┌──────────┐                                  │
│  │respuestas│ │ sesiones │                                  │
│  └──────────┘ └──────────┘                                  │
└─────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│               SERVICIOS EXTERNOS                             │
│                                                               │
│            ┌──────────────────────┐                          │
│            │  Google Gemini AI    │                          │
│            │  (Generación IA)     │                          │
│            └──────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## 🛠 Tecnologías

- **Supabase** - Backend-as-a-Service
- **Deno** - Runtime para Edge Functions
- **TypeScript** - Lenguaje de programación
- **PostgreSQL** - Base de datos relacional
- **Google Gemini AI** - Generación de ejercicios
- **Supabase Auth** - Autenticación (opcional)
- **Row Level Security (RLS)** - Seguridad a nivel de fila

## 📁 Estructura del Proyecto

```
supabase/
├── config.toml                 # Configuración de Supabase
├── .env.example               # Variables de entorno de ejemplo
├── README.md                  # Esta documentación
│
├── functions/                 # Edge Functions (TypeScript/Deno)
│   ├── clasificar-perfil/
│   │   └── index.ts          # Clasificación de perfiles
│   ├── generar-ejercicios/
│   │   └── index.ts          # Generación con Gemini AI
│   ├── guardar-respuesta/
│   │   └── index.ts          # Guardar respuestas
│   ├── validar-respuesta/
│   │   └── index.ts          # Validar respuestas
│   ├── obtener-perfil/
│   │   └── index.ts          # Obtener perfil de estudiante
│   └── obtener-estadisticas/
│       └── index.ts          # Estadísticas del sistema
│
├── migrations/               # Migraciones de base de datos
│   └── 20250101000000_initial_schema.sql
│
└── seed/                    # Datos de ejemplo
    └── seed.sql
```

## 📦 Instalación

### 1. Prerrequisitos

- Node.js 18+
- Cuenta de Supabase (https://supabase.com)
- Supabase CLI instalado
- Google Gemini API Key

### 2. Instalar Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# npm (todas las plataformas)
npm install -g supabase
```

### 3. Inicializar proyecto

```bash
# Login a Supabase
supabase login

# Link al proyecto (crear uno nuevo en supabase.com primero)
supabase link --project-ref your-project-ref
```

### 4. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

Variables requeridas:
```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
GEMINI_API_KEY=your-gemini-api-key
```

### 5. Ejecutar migraciones

```bash
# Aplicar migraciones a la base de datos
supabase db push

# Opcional: cargar datos de ejemplo
supabase db seed
```

### 6. Desplegar Edge Functions

```bash
# Desplegar todas las funciones
supabase functions deploy clasificar-perfil
supabase functions deploy generar-ejercicios
supabase functions deploy guardar-respuesta
supabase functions deploy validar-respuesta
supabase functions deploy obtener-perfil
supabase functions deploy obtener-estadisticas

# O desplegar todas a la vez
for func in functions/*; do
  supabase functions deploy $(basename $func)
done
```

### 7. Configurar secrets

```bash
# Configurar API key de Gemini
supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```

## 🔧 Edge Functions

### 1. clasificar-perfil

Clasifica el perfil de un estudiante basado en respuestas del formulario.

**Endpoint:** `POST /functions/v1/clasificar-perfil`

**Request:**
```json
{
  "estudiante_id": "EST001",
  "grado": "3-4",
  "nombre": "Juan",
  "apellido": "Pérez",
  "edad": 9,
  "respuestas": {
    "P1": "A",
    "P2": "B",
    "P3": "B",
    ...
  }
}
```

**Response:**
```json
{
  "success": true,
  "mensaje": "Perfil clasificado y guardado exitosamente",
  "perfil": {
    "estudiante_id": "EST001",
    "categoria_principal": "El Científico Resiliente",
    "nivel_riesgo": "bajo",
    "recomendaciones": [...],
    ...
  }
}
```

### 2. generar-ejercicios

Genera ejercicios personalizados usando Gemini AI.

**Endpoint:** `POST /functions/v1/generar-ejercicios`

**Request:**
```json
{
  "estudiante_id": "EST001",
  "curso": "matematicas",
  "cantidad": 5,
  "tipo_especifico": "suma",
  "forzar_nivel": null
}
```

**Response:**
```json
{
  "success": true,
  "mensaje": "5 ejercicio(s) generado(s) exitosamente",
  "nivel_determinado": "intermedio",
  "ejercicios": [
    {
      "id": "...",
      "titulo": "Suma en el mercado",
      "enunciado": "...",
      "opciones": ["A) 10", "B) 15", "C) 20", "D) 25"],
      "respuesta_correcta": "B",
      "explicacion": "...",
      ...
    }
  ],
  "tiempo_generacion_segundos": 3.45
}
```

### 3. guardar-respuesta

Guarda la respuesta de un estudiante y actualiza estadísticas.

**Endpoint:** `POST /functions/v1/guardar-respuesta`

**Request:**
```json
{
  "estudiante_id": "EST001",
  "ejercicio_id": "MAT_INT_001",
  "sesion_id": "SES001",
  "curso": "matematicas",
  "respuesta_seleccionada": "B",
  "tiempo_respuesta_ms": 15000
}
```

### 4. obtener-perfil

Obtiene el perfil activo de un estudiante.

**Endpoint:** `GET /functions/v1/obtener-perfil?estudiante_id=EST001`

### 5. obtener-estadisticas

Obtiene estadísticas generales o de un estudiante específico.

**Endpoint:** `GET /functions/v1/obtener-estadisticas?estudiante_id=EST001`

## 💾 Base de Datos

### Tablas Principales

1. **estudiantes** - Información básica de estudiantes
2. **perfiles** - Perfiles clasificados con características
3. **ejercicios_generados** - Ejercicios generados por Gemini
4. **respuestas** - Respuestas de estudiantes a ejercicios
5. **sesiones** - Sesiones de práctica

### Vistas

- **estadisticas_estudiante** - Estadísticas agregadas por estudiante
- **ejercicios_dificiles** - Ejercicios con menor porcentaje de acierto

### Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- Políticas de acceso configuradas
- Triggers para updated_at automático

## 🚀 Deployment

### Desarrollo Local

```bash
# Iniciar Supabase local
supabase start

# Las funciones estarán disponibles en:
# http://localhost:54321/functions/v1/{function-name}
```

### Producción

```bash
# Desplegar funciones
supabase functions deploy

# Aplicar migraciones
supabase db push
```

## 🔄 Migración desde Python

Este proyecto reemplaza los backends Python anteriores:

### Backend Python → Supabase Edge Functions

| Python Backend | Edge Function | Estado |
|---------------|---------------|---------|
| categorizacion/backend-base-python | clasificar-perfil | ✅ Migrado |
| sistema-ejercicio/backend-base-python | generar-ejercicios | ✅ Migrado |
| - | guardar-respuesta | ✅ Nuevo |
| - | validar-respuesta | ✅ Nuevo |
| - | obtener-perfil | ✅ Nuevo |
| - | obtener-estadisticas | ✅ Nuevo |

### Ventajas de la migración

- ✅ **Serverless** - No necesitas gestionar servidores
- ✅ **Escalabilidad automática** - Supabase escala automáticamente
- ✅ **Edge Computing** - Latencia ultra-baja global
- ✅ **TypeScript** - Type-safety end-to-end
- ✅ **PostgreSQL nativo** - Base de datos integrada
- ✅ **Auth built-in** - Sistema de autenticación listo
- ✅ **Real-time** - Subscripciones en tiempo real
- ✅ **Costos reducidos** - Pay-as-you-go

## 🧪 Testing

### Testing Local

```bash
# Probar una función localmente
supabase functions serve clasificar-perfil

# En otra terminal, hacer request
curl -i --location --request POST 'http://localhost:54321/functions/v1/clasificar-perfil' \
  --header 'Authorization: Bearer ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"estudiante_id":"EST001","grado":"3-4","respuestas":{...}}'
```

### Testing en Producción

```bash
curl -i --location --request POST 'https://your-project-ref.supabase.co/functions/v1/clasificar-perfil' \
  --header 'Authorization: Bearer ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"estudiante_id":"EST001","grado":"3-4","respuestas":{...}}'
```

## 📝 Notas Importantes

1. **Secrets Management**: Nunca commitees archivos con secrets reales. Usa `supabase secrets set`.

2. **CORS**: Las funciones tienen CORS habilitado para todos los orígenes por defecto. Ajusta según necesites.

3. **Rate Limiting**: Considera implementar rate limiting en producción.

4. **Monitoring**: Usa el dashboard de Supabase para monitorear logs y métricas.

5. **Costos**: Las Edge Functions tienen un tier gratuito generoso. Revisa los límites en supabase.com/pricing.

## 🔐 Seguridad

- ✅ Variables de entorno para secrets
- ✅ Row Level Security (RLS) habilitado
- ✅ API Keys rotables
- ✅ HTTPS obligatorio
- ✅ Validación de entrada en todas las funciones
- ✅ Sanitización de respuestas

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Edge Functions](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [Google Gemini API](https://ai.google.dev/docs)

## 🤝 Contribución

Para contribuir al proyecto:

1. Crea un feature branch
2. Desarrolla tus cambios
3. Prueba localmente con `supabase functions serve`
4. Crea un Pull Request

## 📧 Soporte

Para preguntas o problemas:

1. Revisa la documentación de Supabase
2. Consulta los logs: `supabase functions logs {function-name}`
3. Abre un issue en el repositorio

---

**Desarrollado con ❤️ usando Supabase + Deno + TypeScript**
