# Guía de Testing - Sistema Completo de Ejercicios con IA

**Fecha**: 17 de Noviembre, 2025
**Objetivo**: Guía práctica para levantar y testear todos los componentes del sistema

**⚠️ IMPORTANTE**: Este sistema tiene **2 componentes principales** que trabajan juntos:

1. **Sistema de Clasificación de Perfiles** → Clasifica estudiantes mediante cuestionarios
2. **Sistema Generador de Ejercicios** → Genera ejercicios personalizados con Gemini AI

**Flujo completo**: Clasificación → Generación de Ejercicios → Tracking → Adaptación de Nivel

**Se requieren 4 servidores corriendo simultáneamente** para el flujo end-to-end completo.

---

## 📋 Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Setup Inicial](#setup-inicial)
3. [Testing Sistema de Clasificación de Perfiles](#testing-sistema-de-clasificación-de-perfiles)
4. [Testing Backend Generador de Ejercicios](#testing-backend-generador-de-ejercicios-fastapi)
5. [Testing Gemini AI](#testing-gemini-ai)
6. [Testing Frontend Ejercicios](#testing-frontend-nextjs)
7. [Testing End-to-End - Flujo Completo](#testing-end-to-end-flujo-completo-4-servidores)
8. [Troubleshooting](#troubleshooting)
9. [Checklist de Verificación](#checklist-de-verificación)
10. [Resumen Ejecutivo](#resumen-ejecutivo)
11. [Guía Rápida para Windows](#guía-rápida-para-windows) 🪟

---

## 1. Pre-requisitos

### Software Necesario

**En Linux/Mac/Git Bash**:
```bash
# Verificar versiones instaladas
python --version    # Debe ser >= 3.11
node --version      # Debe ser >= 18.x
npm --version       # Debe ser >= 9.x
```

**En Windows (PowerShell)**:
```powershell
# Verificar versiones instaladas
python --version    # Debe ser >= 3.11
node --version      # Debe ser >= 18.x
npm --version       # Debe ser >= 9.x

# Si python no funciona, prueba:
py --version
py -3.11 --version  # Si tienes Python 3.11 instalado
```

**Si no están instalados**:
- **Python 3.11+**:
  - Windows: Descargar desde https://www.python.org/downloads/ o usar Microsoft Store
  - Asegúrate de marcar "Add Python to PATH" durante la instalación
- **Node.js 18+**: https://nodejs.org/ (Descarga el instalador LTS para Windows)
- **Git para Windows** (opcional pero recomendado): https://git-scm.com/download/win

### API Key de Google Gemini

1. **Obtener API Key**:
   - Ir a: https://makersuite.google.com/app/apikey
   - Login con cuenta Google
   - Click "Create API Key"
   - Copiar la key (empieza con `AIza...`)

2. **Guardar la API Key** (la necesitarás pronto):
   ```
   AIzaSy...tu_api_key_aqui
   ```

---

## 2. Setup Inicial

### 2.1 Ubicación del Proyecto

**En Linux/Mac**:
```bash
cd /home/user/test111
```

**En Windows**:
```powershell
# Navegar a tu directorio de trabajo
cd "E:\Files\Cheems Heaven\innova-edu-ai_backend\test111"

# Verificar que estás en el directorio correcto
ls  # Deberías ver: categorizacion, sistema-ejercicio, docs
```

**⚠️ IMPORTANTE para Windows**:
- Si tu ruta tiene espacios, usa comillas: `cd "C:\Mi Carpeta\test111"`
- Usa `\` (backslash) en lugar de `/` (forward slash)
- PowerShell es más moderno que CMD, recomendado usar PowerShell

### 2.2 Estructura del Proyecto

```
test111/
├── categorizacion/                 # 🎯 Sistema de Clasificación de Perfiles
│   ├── backend/                   # Backend FastAPI (puerto 8000)
│   └── frontend/                  # Frontend Next.js (puerto 3000)
├── sistema-ejercicio/             # 🎯 Sistema Generador de Ejercicios
│   ├── backend/                   # Backend FastAPI + Gemini AI (puerto 8001)
│   └── frontend/                  # Frontend Next.js (puerto 3001)
└── docs/                          # Documentación
```

**⚠️ IMPORTANTE - Orden de Testing**:

El sistema tiene **2 componentes principales** que funcionan juntos:

1. **Sistema de Clasificación de Perfiles** (PRIMERO)
   - Backend: `categorizacion/backend/` (puerto 8000)
   - Frontend: `categorizacion/frontend/` (puerto 3000)
   - **Propósito**: Clasificar estudiantes según sus respuestas a un cuestionario
   - **Output**: Perfil del estudiante (nivel, estilo de aprendizaje, etc.)

2. **Sistema Generador de Ejercicios** (SEGUNDO)
   - Backend: `sistema-ejercicio/backend/` (puerto 8001)
   - Frontend: `sistema-ejercicio/frontend/` (puerto 3001)
   - **Propósito**: Generar ejercicios personalizados con Gemini AI
   - **Input**: Usa el perfil del estudiante para personalizar

**Flujo Completo**:
```
1. Clasificación → 2. Generación de Ejercicios → 3. Tracking
```

---

## 3. Testing Sistema de Clasificación de Perfiles

### 3.1 Levantar Backend de Clasificación

**Terminal 1**:

```bash
# En Linux/Mac/Git Bash
cd /home/user/test111/categorizacion/backend

# Activar venv
source venv/bin/activate

# Verificar .env existe (opcional, pero recomendado)
cat .env.local 2>/dev/null || echo ".env no encontrado (opcional)"

# OPCIÓN 1: Usar script run.py (recomendado, funciona en todos los sistemas)
python run.py

# OPCIÓN 2: Usar uvicorn directamente
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**En Windows (PowerShell)**:
```powershell
# Navegar al backend de clasificación
cd "E:\Files\Cheems Heaven\innova-edu-ai_backend\test111\categorizacion\backend"

# SI NO TIENES VENV CREADO (primera vez):
python -m venv venv
# o si python no funciona:
py -3.11 -m venv venv

# Activar entorno virtual
venv\Scripts\activate
# Deberías ver (venv) al inicio de la línea

# Crear archivo .env si no existe
if (!(Test-Path .env)) { Copy-Item .env.example .env }
# O manualmente:
# copy .env.example .env

# Editar .env (usa tu editor preferido):
# notepad .env
# O usa VSCode: code .env

# Instalar dependencias (si no están instaladas)
pip install -r requirements.txt

# OPCIÓN 1: Usar script run.py (recomendado)
python run.py

# OPCIÓN 2: Usar uvicorn directamente
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**⚠️ IMPORTANTE para Windows**:
- El comando es `app.main:app` (NO `main:app`)
- El script `run.py` configura todo automáticamente
- Si ves error de permisos al activar venv, ejecuta en PowerShell como Admin:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

**✅ Verificar**:
- Abrir: http://localhost:8000/docs
- Deberías ver Swagger UI con endpoints de clasificación

**🔴 Errores Comunes en Windows**:
1. **"python no se reconoce"**: Usa `py` en lugar de `python`
2. **Error de CORS_ORIGINS**: Ya está solucionado, solo crea el .env desde .env.example
3. **Firewall de Windows**: Permite acceso a Python cuando Windows pregunte

### 3.2 Levantar Frontend de Clasificación

**Terminal 2** (nueva terminal):

```bash
# En Linux/Mac/Git Bash
cd /home/user/test111/categorizacion/frontend

# Instalar dependencias (solo primera vez)
npm install

# Verificar configuración
cat .env.local
# Debe mostrar: NEXT_PUBLIC_API_URL=http://localhost:8000

# Levantar servidor
npm run dev
```

**En Windows (PowerShell)** - NUEVA TERMINAL (no cierres la del backend):
```powershell
# Abrir NUEVA ventana de PowerShell
# Navegar al frontend de clasificación
cd "E:\Files\Cheems Heaven\innova-edu-ai_backend\test111\categorizacion\frontend"

# Crear archivo .env.local si no existe
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
# O manualmente:
# copy .env.example .env.local

# Editar .env.local para verificar la URL del backend:
# notepad .env.local
# Debe contener: NEXT_PUBLIC_API_URL=http://localhost:8000

# Instalar dependencias Node.js (primera vez)
npm install

# Levantar servidor de desarrollo
npm run dev
```

**⚠️ IMPORTANTE para Windows**:
- Debes tener 2 ventanas de PowerShell abiertas simultáneamente:
  1. Backend (puerto 8000) - no cerrar
  2. Frontend (puerto 3000) - esta nueva
- Si npm es lento, es normal en la primera instalación

**✅ Verificar**:
- Abrir: http://localhost:3000
- Deberías ver formulario de clasificación
- Si no carga, verifica que el backend sigue corriendo en la otra terminal

**🔴 Errores Comunes en Windows**:
1. **Puerto 3000 ocupado**: Cierra otras apps que usen ese puerto o cambia en package.json
2. **Error de ENOENT**: Asegúrate de estar en el directorio correcto
3. **npm no se reconoce**: Reinstala Node.js y marca "Add to PATH"

### 3.3 Test: Clasificar un Estudiante

**Flujo de clasificación**:

1. **Abrir**: http://localhost:3000

2. **Rellenar formulario**:
   - Grado: `3-4 primaria`
   - Edad: `9 años`
   - Responder preguntas de matemáticas (4 preguntas)
   - Responder preguntas de razonamiento verbal (4 preguntas)

3. **Click**: "Ver Resultado"

4. **Verificar resultado**:
   ```json
   {
     "nivel_matematicas": "intermedio",
     "nivel_verbal": "basico",
     "estilo_aprendizaje": "visual",
     "velocidad_aprendizaje": "moderada"
   }
   ```

5. **IMPORTANTE**: Guardar este perfil (lo usaremos en el generador)

**Endpoint directo** (alternativa):
```bash
curl -X POST http://localhost:8000/api/clasificar \
  -H "Content-Type: application/json" \
  -d '{
    "grado": "3-4",
    "edad": 9,
    "respuestas_matematicas": [
      {"pregunta_id": 1, "respuesta": "A", "correcta": true, "tiempo_segundos": 30},
      {"pregunta_id": 2, "respuesta": "B", "correcta": true, "tiempo_segundos": 25},
      {"pregunta_id": 3, "respuesta": "C", "correcta": false, "tiempo_segundos": 40},
      {"pregunta_id": 4, "respuesta": "A", "correcta": true, "tiempo_segundos": 20}
    ],
    "respuestas_verbal": [
      {"pregunta_id": 1, "respuesta": "A", "correcta": true, "tiempo_segundos": 35},
      {"pregunta_id": 2, "respuesta": "B", "correcta": false, "tiempo_segundos": 45},
      {"pregunta_id": 3, "respuesta": "C", "correcta": true, "tiempo_segundos": 30},
      {"pregunta_id": 4, "respuesta": "D", "correcta": true, "tiempo_segundos": 25}
    ]
  }'
```

---

## 4. Testing Backend Generador de Ejercicios (FastAPI)

### 4.1 Navegar al Directorio

```bash
cd /home/user/test111/sistema-ejercicio/backend
```

### 4.2 Crear Entorno Virtual (Recomendado)

**En Linux/Mac**:
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
source venv/bin/activate

# Deberías ver (venv) al inicio de tu terminal
```

**En Windows (PowerShell)**:
```powershell
# SI NO TIENES VENV CREADO:
python -m venv venv
# O si python no funciona:
py -3.11 -m venv venv

# Activar entorno virtual
venv\Scripts\activate

# Deberías ver (venv) al inicio de la línea
# Si da error de permisos, ejecuta como Admin:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 4.3 Instalar Dependencias

```bash
pip install -r requirements.txt
```

**Output esperado**:
```
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 pydantic-2.5.0 ...
```

**⚠️ En Windows**: Si falla la instalación de algún paquete, asegúrate de tener Python 3.11 (NO 3.14) y Visual C++ Build Tools instalados.

### 4.4 Configurar Variables de Entorno

**En Linux/Mac**:
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar archivo .env
nano .env
# o con tu editor preferido:
# code .env
# vim .env
```

**En Windows (PowerShell)**:
```powershell
# Copiar archivo de ejemplo
copy .env.example .env

# Editar archivo .env con Notepad
notepad .env

# O con VSCode (si lo tienes instalado):
code .env

# O con cualquier editor de texto
```

**⚠️ IMPORTANTE - Agregar tu API Key de Gemini**:

1. **Obtener API Key** (si no la tienes):
   - Ve a: https://makersuite.google.com/app/apikey
   - Inicia sesión con tu cuenta Google
   - Click en "Create API Key"
   - Copia la key (empieza con `AIza...`)

2. **Editar el archivo .env**:
```env
# ============================================================================
# GENERADOR DE EJERCICIOS - VARIABLES DE ENTORNO
# ============================================================================

# Google Gemini AI API Key
# Obtén tu API key en: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  # ← PEGA TU KEY AQUÍ

# Configuración de la aplicación
APP_NAME="Generador de Ejercicios con Gemini"
APP_VERSION="1.0.0"
DEBUG=False
```

3. **Guardar el archivo**:
   - **Notepad**: Archivo → Guardar
   - **VSCode**: Ctrl + S
   - **Nano**: `Ctrl + O`, `Enter`, `Ctrl + X`

**🔴 ERROR SI NO CONFIGURAS LA API KEY**: El backend no iniciará y verás:
```
ValueError: ❌ GEMINI_API_KEY no encontrada en .env
```

### 4.5 Verificar Configuración

```bash
# Verificar que el archivo existe y tiene contenido
cat .env

# Deberías ver tu API key
```

### 4.6 Levantar el Servidor

```bash
# Iniciar servidor en modo desarrollo (con auto-reload)
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

**Output esperado**:
```
INFO:     Will watch for changes in these directories: ['/home/user/test111/generador-ejercicios']
INFO:     Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**🔴 Si ves error**: Ver sección [Troubleshooting](#troubleshooting)

### 4.7 Verificar que el Backend Está Corriendo

**Abrir en navegador**:
```
http://localhost:8001
```

**Deberías ver**:
```json
{
  "mensaje": "Generador de Ejercicios - API funcionando correctamente",
  "version": "1.0.0"
}
```

### 4.8 Acceder a la Documentación Interactiva

**Swagger UI**:
```
http://localhost:8001/docs
```

**Deberías ver**:
- Lista de todos los endpoints
- Interfaz interactiva para probar APIs
- 18 endpoints en total

**ReDoc** (alternativa):
```
http://localhost:8001/redoc
```

---

## 4. Testing Gemini AI

### 4.1 Test Manual desde Swagger

1. **Abrir Swagger UI**:
   ```
   http://localhost:8001/docs
   ```

2. **Expandir endpoint**: `POST /api/generar-ejercicios`

3. **Click en "Try it out"**

4. **Copiar este JSON en el body**:
   ```json
   {
     "estudiante_id": "TEST001",
     "curso": "matematicas",
     "cantidad": 3,
     "nivel": "basico",
     "grado": "3-4"
   }
   ```

5. **Click "Execute"**

6. **Verificar Response (200 OK)**:
   ```json
   {
     "success": true,
     "mensaje": "Ejercicios generados exitosamente",
     "ejercicios": [
       {
         "id": "MAT_BAS_001",
         "tipo": "matematicas",
         "enunciado": "María tiene 5 manzanas...",
         "opciones": ["A) 8", "B) 7", "C) 6", "D) 9"],
         "respuesta_correcta": "A",
         "explicacion": "5 + 3 = 8..."
       },
       // ... 2 ejercicios más
     ],
     "nivel_determinado": "basico",
     "perfil_usado": { ... }
   }
   ```

**✅ Si ves esto**: Gemini AI está funcionando correctamente

**❌ Si ves error 500**: Ver [Troubleshooting - Gemini API](#gemini-api-errors)

### 4.2 Test desde cURL (Alternativa)

```bash
curl -X POST "http://localhost:8001/api/generar-ejercicios" \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "TEST001",
    "curso": "matematicas",
    "cantidad": 3,
    "nivel": "basico",
    "grado": "3-4"
  }'
```

### 4.3 Casos de Prueba de Gemini

**Test 1: Matemáticas Básicas**
```json
{
  "curso": "matematicas",
  "cantidad": 5,
  "nivel": "basico"
}
```
**Verificar**: Ejercicios de suma/resta simples

**Test 2: Matemáticas Intermedias**
```json
{
  "curso": "matematicas",
  "cantidad": 5,
  "nivel": "intermedio"
}
```
**Verificar**: Multiplicación, división, fracciones

**Test 3: Razonamiento Verbal**
```json
{
  "curso": "verbal",
  "cantidad": 5,
  "nivel": "basico"
}
```
**Verificar**: Sinónimos, antónimos, comprensión

---

## 5. Testing Frontend de Ejercicios (Next.js)

### 5.1 Nueva Terminal

**⚠️ IMPORTANTE**: NO cerrar la terminal del backend. Abrir una nueva terminal.

```bash
# Nueva terminal
cd /home/user/test111/sistema-ejercicio/frontend
```

### 5.2 Instalar Dependencias

```bash
npm install
```

**Output esperado**:
```
added 167 packages, and audited 168 packages in 19s
```

### 5.3 Verificar Configuración del Backend

```bash
# Verificar que apunta al backend correcto
cat .env.local

# Debería mostrar:
# NEXT_PUBLIC_API_URL=http://localhost:8001
```

**Si el archivo no existe**:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local
```

### 5.4 Levantar el Servidor de Desarrollo

```bash
npm run dev
```

**Output esperado**:
```
> ejercicios-app@1.0.0 dev
> next dev -p 3001

  ▲ Next.js 14.2.33
  - Local:        http://localhost:3001

 ✓ Ready in 3.1s
```

### 5.5 Verificar Frontend en Navegador

**Abrir**:
```
http://localhost:3001
```

**Deberías ver**:
- Título: "Generador de Ejercicios con IA"
- Formulario con:
  - Campo "ID del Estudiante"
  - Selector "Curso" (Matemáticas/Verbal)
  - Selector "Cantidad de Ejercicios"
  - Botón "Comenzar Ejercicios"

---

## 6. Testing End-to-End - Flujo Completo (4 Servidores)

### 6.1 Verificar que TODOS los Servidores Están Corriendo

**⚠️ IMPORTANTE**: Para el flujo completo necesitas **4 terminales**:

**Terminal 1** - Backend Clasificación (puerto 8000):
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2** - Frontend Clasificación (puerto 3000):
```
- Local:        http://localhost:3000
✓ Ready in 2s
```

**Terminal 3** - Backend Generador (puerto 8001):
```
INFO:     Uvicorn running on http://0.0.0.0:8001
```

**Terminal 4** - Frontend Ejercicios (puerto 3001):
```
- Local:        http://localhost:3001
✓ Ready in 3s
```

### 6.2 Flujo Completo: De Clasificación a Ejercicios

---

#### 🎯 FASE 1: Clasificar Estudiante

**1. Abrir Sistema de Clasificación**:
```
http://localhost:3000
```

**2. Rellenar Datos Básicos**:
- Nombre: `Juan Pérez`
- Grado: `3-4 primaria`
- Edad: `9 años`

**3. Responder Cuestionario de Matemáticas** (4 preguntas):
- Pregunta 1: Responder opción correcta
- Pregunta 2: Responder opción correcta
- Pregunta 3: Responder opción (puede ser incorrecta)
- Pregunta 4: Responder opción correcta

**4. Responder Cuestionario Verbal** (4 preguntas):
- Pregunta 1: Responder opción correcta
- Pregunta 2: Responder opción (puede ser incorrecta)
- Pregunta 3: Responder opción correcta
- Pregunta 4: Responder opción correcta

**5. Ver Resultado de Clasificación**:
```
✅ Perfil del Estudiante:
   - Nivel Matemáticas: intermedio
   - Nivel Verbal: básico
   - Estilo de Aprendizaje: visual
   - Velocidad: moderada
   - ID Estudiante: EST001 (generado automáticamente)
```

**6. IMPORTANTE - Copiar ID del Estudiante**: `EST001`

---

#### 🎯 FASE 2: Generar Ejercicios Personalizados

**1. Abrir Generador de Ejercicios**:
```
http://localhost:3001
```

**2. Configurar Sesión**:
   - **ID Estudiante**: `EST001` (el que obtuviste en FASE 1)
   - **Curso**: `Matemáticas`
   - **Cantidad**: `5 ejercicios`

**3. Click**: "Comenzar Ejercicios"

**4. Verificar Generación**:
   - ⏳ Aparece "Generando ejercicios personalizados..."
   - 🎯 El sistema consulta el perfil de EST001 del backend de clasificación
   - 🤖 Gemini AI genera ejercicios adaptados al perfil del estudiante
   - ⏱️ Espera 5-10 segundos (Gemini AI procesando)

**5. Ver Ejercicios Generados**:

**Deberías ver**:
- ✅ Ejercicio 1 de 5 mostrado
- ✅ Enunciado del ejercicio personalizado según perfil de EST001
- ✅ 4 opciones (A, B, C, D)
- ✅ Barra de progreso (1/5)
- ✅ Tiempo transcurrido contando

**Abrir Consola del Navegador** (F12):
```javascript
// Deberías ver:
✅ Sesión creada: SES_20251117_EST001_001
```

**6. Responder Ejercicios**:

1. **Seleccionar una opción** (ej: A)

2. **Verificar feedback**:
   - ✅ Opción correcta: Fondo verde + "¡Correcto!"
   - ❌ Opción incorrecta: Fondo rojo + "Incorrecto"
   - ✅ Muestra explicación detallada

3. **Click "Siguiente"**

4. **Repetir** para los 5 ejercicios

**Verificar en consola**:
```javascript
✅ Respuesta registrada en backend
✅ POST /api/sesiones/SES_20251117_EST001_001/responder
```

**7. Ver Resultados Finales**:

**Después del ejercicio 5**:
- ✅ Pantalla de resultados
- ✅ Correctas: X de 5
- ✅ Tasa de aciertos: X%
- ✅ Tiempo total
- ✅ Botón "Comenzar Nueva Sesión"

**Verificar en consola**:
```javascript
✅ Sesión completada: {
  total_ejercicios: 5,
  ejercicios_correctos: X,
  tasa_aciertos: 0.X,
  recomendacion_nivel: { ... }  // Sistema adaptativo
}
```

**⚠️ NOTA**: La recomendación de nivel NO se muestra en UI (pendiente de implementar, pero está en el response)

---

#### 🎯 FASE 3: Verificar Sistema de Tracking y Adaptativo

**1. Ver Logs del Backend Generador**:

**Terminal 3** (donde corre el backend generador en puerto 8001), ver logs:
```
INFO:     127.0.0.1:XXXXX - "POST /api/sesiones/crear HTTP/1.1" 200 OK
INFO:     127.0.0.1:XXXXX - "POST /api/sesiones/SES_20251117_EST001_001/responder HTTP/1.1" 200 OK
INFO:     127.0.0.1:XXXXX - "POST /api/sesiones/SES_20251117_EST001_001/responder HTTP/1.1" 200 OK
... (5 veces, una por cada ejercicio)
INFO:     127.0.0.1:XXXXX - "POST /api/sesiones/SES_20251117_EST001_001/completar HTTP/1.1" 200 OK
```

**✅ Si ves estos logs**: El tracking está funcionando correctamente

**2. Ver Archivo JSON de Sesiones Guardadas**:

Abrir **Terminal 5** (nueva):
```bash
cd /home/user/test111/sistema-ejercicio/backend

# Ver sesiones guardadas (con formato bonito)
cat data/sesiones.json | jq .

# Si no tienes jq instalado:
cat data/sesiones.json
```

**Deberías ver**:
```json
{
  "sesiones": [
    {
      "sesion_id": "SES_20251117_EST001_001",
      "estudiante_id": "EST001",
      "curso": "matematicas",
      "nivel_determinado": "basico",
      "cantidad_ejercicios": 5,
      "respuestas": [
        {
          "ejercicio_id": "MAT_BAS_001",
          "opcion_seleccionada": "A",
          "es_correcta": true,
          "tiempo_respuesta_segundos": 15,
          "timestamp": "2025-11-17T..."
        },
        {
          "ejercicio_id": "MAT_BAS_002",
          "opcion_seleccionada": "B",
          "es_correcta": true,
          "tiempo_respuesta_segundos": 20,
          "timestamp": "2025-11-17T..."
        }
        // ... 3 respuestas más
      ],
      "estado": "completada",
      "fecha_inicio": "2025-11-17T10:30:00",
      "fecha_fin": "2025-11-17T10:32:30"
    }
  ]
}
```

**✅ Verificaciones**:
- ✅ `sesion_id` tiene formato correcto: `SES_YYYYMMDD_ESTXXX_###`
- ✅ `estudiante_id` es el mismo de FASE 1: `EST001`
- ✅ `respuestas` tiene 5 elementos (una por cada ejercicio)
- ✅ Cada respuesta tiene `tiempo_respuesta_segundos`
- ✅ `estado` es `completada`
- ✅ Tiene `fecha_inicio` y `fecha_fin`

**3. Verificar Sistema Adaptativo (Recomendación de Nivel)**:

El sistema adaptativo analiza automáticamente el rendimiento del estudiante y recomienda el nivel apropiado para la próxima sesión.

**Método 1: Ver en Consola del Navegador (F12)**

Al completar la sesión en http://localhost:3001, en la consola deberías ver:
```javascript
✅ Sesión completada: {
  estadisticas: {
    total_ejercicios: 5,
    ejercicios_correctos: 4,
    tasa_aciertos: 0.8
  },
  recomendacion_nivel: {
    nivel_actual: "basico",
    nivel_recomendado: "intermedio",  // Varía según rendimiento
    direccion: "subir",
    razon: "Excelente tasa de aciertos (80%). Nivel actual fácil.",
    confianza: "alta",
    cambio_aplicado: true
  }
}
```

**Interpretación**:
- `direccion: "subir"` → Rendimiento alto, nivel muy fácil
- `direccion: "mantener"` → Rendimiento adecuado, nivel apropiado
- `direccion: "bajar"` → Rendimiento bajo, nivel muy difícil

**Método 2: Llamar Endpoint Directamente**

En **Terminal 5**:
```bash
# Obtener recomendación de nivel para EST001
curl "http://localhost:8001/api/estudiantes/EST001/nivel-recomendado?curso=matematicas"
```

**Response esperado**:
```json
{
  "nivel_actual": "basico",
  "nivel_recomendado": "intermedio",
  "direccion": "subir",
  "razon": "Excelente tasa de aciertos (80%) en últimas sesiones. Tiempo promedio rápido.",
  "confianza": "alta",
  "cambio_aplicado": true,
  "metricas": {
    "tasa_aciertos_historica": 0.8,
    "total_ejercicios": 5,
    "tiempo_promedio_segundos": 20
  }
}
```

**✅ Verificaciones del Sistema Adaptativo**:
- ✅ La recomendación aparece en el response de completar sesión
- ✅ El endpoint `/nivel-recomendado` funciona
- ✅ La dirección (`subir`/`mantener`/`bajar`) es lógica según el rendimiento
- ✅ La `razon` explica claramente por qué se recomienda ese nivel
- ✅ La `confianza` es `alta` con 5+ ejercicios

**⚠️ NOTA IMPORTANTE**:
- El sistema adaptativo **FUNCIONA** correctamente en el backend
- La recomendación **ESTÁ** en el response JSON
- **PERO** la UI del frontend **NO MUESTRA** la recomendación al estudiante (pendiente de implementar)
- Ver issue #3 en `docs/TODO.md`

---

### 6.3 Resumen del Flujo Completo

**Flujo End-to-End Exitoso**:

1. ✅ **Clasificación**: Estudiante completa cuestionario → Obtiene perfil + ID (EST001)
2. ✅ **Generación**: Sistema consulta perfil → Gemini AI personaliza ejercicios
3. ✅ **Tracking**: Cada respuesta se guarda → Sesión completa en JSON
4. ✅ **Adaptativo**: Sistema analiza rendimiento → Recomienda nivel para próxima sesión

**4 Servidores Necesarios**:
- ✅ Backend Clasificación (puerto 8000)
- ✅ Frontend Clasificación (puerto 3000)
- ✅ Backend Generador (puerto 8001)
- ✅ Frontend Ejercicios (puerto 3001)

---

### 6.4 Testing del Sistema Adaptativo - Casos de Prueba

#### Test Case 1: Rendimiento Bajo → Bajar Nivel

1. **Generar sesión**: Nivel intermedio, 10 ejercicios
2. **Responder mal**: Solo 2-3 correctos (20-30%)
3. **Verificar recomendación**:
   ```json
   {
     "nivel_recomendado": "basico",
     "direccion": "bajar",
     "razon": "Tasa de aciertos baja ..."
   }
   ```

**Test Case 2: Rendimiento Alto → Subir Nivel**

1. **Generar sesión**: Nivel básico, 10 ejercicios
2. **Responder bien**: 9-10 correctos (90-100%)
3. **Responder rápido**: < 30 segundos por ejercicio
4. **Verificar recomendación**:
   ```json
   {
     "nivel_recomendado": "intermedio",
     "direccion": "subir",
     "razon": "Excelente tasa de aciertos ..."
   }
   ```

**Test Case 3: Rendimiento Medio → Mantener**

1. **Generar sesión**: Nivel intermedio, 10 ejercicios
2. **Responder**: 6-7 correctos (60-70%)
3. **Verificar recomendación**:
   ```json
   {
     "nivel_recomendado": "intermedio",
     "direccion": "mantener",
     "razon": "Tasa de aciertos adecuada ..."
   }
   ```

---

## 7. Troubleshooting

### Backend No Arranca

#### Error: `GEMINI_API_KEY no encontrada`

```bash
ValueError: ❌ GEMINI_API_KEY no encontrada en .env
```

**Solución**:
```bash
cd generador-ejercicios
ls -la .env  # Verificar que existe

# Si no existe:
cp .env.example .env
nano .env
# Agregar tu API key
```

#### Error: `ModuleNotFoundError`

```bash
ModuleNotFoundError: No module named 'fastapi'
```

**Solución**:
```bash
# Activar entorno virtual
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# Reinstalar dependencias
pip install -r requirements.txt
```

#### Error: `Address already in use`

```bash
ERROR:    [Errno 48] error while attempting to bind on address ('0.0.0.0', 8001): address already in use
```

**Solución**:
```bash
# Ver qué proceso usa el puerto 8001
lsof -i :8001

# Matar el proceso
kill -9 <PID>

# O usar otro puerto
python -m uvicorn main:app --reload --port 8002
```

### Gemini API Errors

#### Error: `API key not valid`

```json
{
  "detail": "Error al generar ejercicios: API key not valid..."
}
```

**Solución**:
1. Verificar API key en `.env`
2. Obtener nueva key en: https://makersuite.google.com/app/apikey
3. Reiniciar servidor backend

#### Error: `Resource exhausted`

```json
{
  "detail": "Error al generar ejercicios: Resource exhausted (quota)"
}
```

**Solución**:
- Has excedido la cuota gratuita de Gemini
- Esperar 1 minuto
- O actualizar a plan de pago

#### Error: `SAFETY` blocking

```json
{
  "detail": "Gemini bloqueó la respuesta por seguridad"
}
```

**Solución**:
- Gemini consideró el contenido inapropiado
- Regenerar ejercicios (debería funcionar)
- Es raro pero puede pasar

### Frontend No Arranca

#### Error: `next: not found`

```bash
sh: 1: next: not found
```

**Solución**:
```bash
cd frontend/ejercicios-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Error: `Cannot connect to backend`

**Consola del navegador**:
```
Network Error: Failed to fetch
```

**Solución**:
1. Verificar backend está corriendo: http://localhost:8001
2. Verificar `.env.local` tiene la URL correcta
3. Verificar CORS en backend (ya configurado)

### Ejercicios No Se Generan

#### Loading Infinito

**Síntomas**:
- Click "Comenzar Ejercicios"
- Loading infinito
- No aparecen ejercicios

**Solución**:
1. **Abrir consola del navegador** (F12)
2. **Ver errores en Network tab**
3. **Verificar**:
   ```bash
   # Backend está corriendo?
   curl http://localhost:8001

   # Gemini funciona?
   curl -X POST http://localhost:8001/api/generar-ejercicios \
     -H "Content-Type: application/json" \
     -d '{"curso":"matematicas","cantidad":3}'
   ```

#### JSON Inválido de Gemini

**Logs del backend**:
```
ERROR: JSON inválido recibido de Gemini
```

**Solución**:
- Es un error ocasional de Gemini
- Reintentar (hay retry automático)
- Si persiste, revisar prompts en `generador-ejercicios/prompts/`

### Tracking No Funciona

#### Respuestas No Se Guardan

**Síntomas**:
- Completar sesión
- No hay archivo `sesiones.json`
- O archivo vacío

**Solución**:
```bash
# Crear directorio data si no existe
mkdir -p generador-ejercicios/data

# Verificar permisos
chmod 755 generador-ejercicios/data

# Reiniciar backend
```

#### Sesión No Aparece en JSON

**Verificar**:
```bash
# Ver logs del backend
# Buscar líneas con "POST /api/sesiones"

# Verificar manualmente
curl http://localhost:8001/api/estudiantes/EST001/sesiones
```

---

## 8. Checklist de Verificación

### ✅ Backend Setup

- [ ] Python 3.11+ instalado
- [ ] Dependencias instaladas (`pip install -r requirements.txt`)
- [ ] Archivo `.env` creado con `GEMINI_API_KEY`
- [ ] Servidor corre en `http://localhost:8001`
- [ ] Swagger UI accesible en `/docs`
- [ ] Endpoint raíz retorna JSON con versión

### ✅ Gemini AI

- [ ] API key válida
- [ ] Endpoint `/api/generar-ejercicios` funciona
- [ ] Matemáticas básicas genera ejercicios
- [ ] Matemáticas intermedias genera ejercicios
- [ ] Razonamiento verbal genera ejercicios
- [ ] Ejercicios tienen formato correcto (id, enunciado, opciones, respuesta)

### ✅ Frontend Setup

- [ ] Node.js 18+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env.local` con `NEXT_PUBLIC_API_URL`
- [ ] Servidor corre en `http://localhost:3001`
- [ ] UI se ve correctamente

### ✅ Tracking System

- [ ] Sesión se crea al generar ejercicios
- [ ] Respuestas se registran en backend
- [ ] Archivo `sesiones.json` se crea
- [ ] Sesión se completa al terminar
- [ ] Estadísticas se calculan correctamente
- [ ] JSON tiene estructura correcta

### ✅ Adaptive System

- [ ] Endpoint `/nivel-recomendado` funciona
- [ ] Recomendación aparece en response de completar
- [ ] Reglas de decisión funcionan:
  - [ ] Rendimiento bajo → bajar
  - [ ] Rendimiento alto → subir
  - [ ] Rendimiento medio → mantener
- [ ] Confianza se calcula correctamente
- [ ] Límites de nivel respetados (no bajar de básico, no subir de avanzado)

### ✅ End-to-End Flow

- [ ] Generar ejercicios funciona
- [ ] Ejercicios se muestran en UI
- [ ] Seleccionar respuesta funciona
- [ ] Feedback correcto/incorrecto funciona
- [ ] Progreso se actualiza
- [ ] Pantalla de resultados funciona
- [ ] Reiniciar sesión funciona

---

## 9. Scripts de Testing Rápido

### Script: Test Backend Completo

```bash
#!/bin/bash
# test-backend.sh

echo "🔍 Testing Backend..."

# 1. Health check
echo "\n1. Health check..."
curl http://localhost:8001

# 2. Generar ejercicios matemáticas
echo "\n\n2. Generar ejercicios matemáticas..."
curl -X POST http://localhost:8001/api/generar-ejercicios \
  -H "Content-Type: application/json" \
  -d '{"curso":"matematicas","cantidad":3,"nivel":"basico"}' \
  | jq '.ejercicios | length'

# 3. Generar ejercicios verbal
echo "\n3. Generar ejercicios verbal..."
curl -X POST http://localhost:8001/api/generar-ejercicios \
  -H "Content-Type: application/json" \
  -d '{"curso":"verbal","cantidad":3,"nivel":"basico"}' \
  | jq '.ejercicios | length'

# 4. Crear sesión
echo "\n4. Crear sesión..."
curl -X POST http://localhost:8001/api/sesiones/crear \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "TEST001",
    "curso": "matematicas",
    "ejercicios_ids": ["MAT_BAS_001", "MAT_BAS_002"],
    "nivel_determinado": "basico",
    "perfil_usado": {}
  }' | jq '.sesion_id'

echo "\n✅ Backend tests completados"
```

**Ejecutar**:
```bash
chmod +x test-backend.sh
./test-backend.sh
```

### Script: Test E2E Automatizado (Python)

```python
# test_e2e.py
import requests
import time

BASE_URL = "http://localhost:8001"

def test_flujo_completo():
    print("🧪 Testing Flujo Completo E2E\n")

    # 1. Generar ejercicios
    print("1️⃣ Generando ejercicios...")
    response = requests.post(f"{BASE_URL}/api/generar-ejercicios", json={
        "estudiante_id": "TEST001",
        "curso": "matematicas",
        "cantidad": 5,
        "nivel": "basico"
    })
    assert response.status_code == 200
    ejercicios = response.json()["ejercicios"]
    print(f"   ✅ {len(ejercicios)} ejercicios generados")

    # 2. Crear sesión
    print("\n2️⃣ Creando sesión de tracking...")
    ejercicios_ids = [e["id"] for e in ejercicios]
    response = requests.post(f"{BASE_URL}/api/sesiones/crear", json={
        "estudiante_id": "TEST001",
        "curso": "matematicas",
        "ejercicios_ids": ejercicios_ids,
        "nivel_determinado": "basico",
        "perfil_usado": {}
    })
    assert response.status_code == 200
    sesion_id = response.json()["sesion_id"]
    print(f"   ✅ Sesión creada: {sesion_id}")

    # 3. Responder ejercicios
    print("\n3️⃣ Respondiendo ejercicios...")
    for i, ejercicio in enumerate(ejercicios):
        response = requests.post(
            f"{BASE_URL}/api/sesiones/{sesion_id}/responder",
            json={
                "ejercicio_id": ejercicio["id"],
                "opcion_seleccionada": ejercicio["respuesta_correcta"],
                "es_correcta": True,
                "tiempo_respuesta_segundos": 30
            }
        )
        assert response.status_code == 200
        print(f"   ✅ Ejercicio {i+1}/5 respondido")

    # 4. Completar sesión
    print("\n4️⃣ Completando sesión...")
    response = requests.post(
        f"{BASE_URL}/api/sesiones/{sesion_id}/completar",
        json={}
    )
    assert response.status_code == 200
    result = response.json()
    print(f"   ✅ Sesión completada")
    print(f"   📊 Estadísticas:")
    print(f"      - Correctos: {result['estadisticas']['ejercicios_correctos']}")
    print(f"      - Tasa: {result['estadisticas']['tasa_aciertos']*100}%")

    if "recomendacion_nivel" in result:
        rec = result["recomendacion_nivel"]
        print(f"   🎯 Recomendación:")
        print(f"      - Nivel recomendado: {rec['nivel_recomendado']}")
        print(f"      - Dirección: {rec['direccion']}")
        print(f"      - Razón: {rec['razon']}")

    print("\n🎉 Flujo completo exitoso!")

if __name__ == "__main__":
    test_flujo_completo()
```

**Ejecutar**:
```bash
python test_e2e.py
```

---

## 10. Resumen Ejecutivo

### Comandos Rápidos - Levantar Todos los Servicios

**⚠️ IMPORTANTE**: Para el flujo completo necesitas **4 terminales** corriendo simultáneamente:

**Terminal 1 - Backend Clasificación**:
```bash
cd /home/user/test111/categorizacion/backend
source venv/bin/activate
# Opción 1 (recomendada):
python run.py
# Opción 2:
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend Clasificación** (nueva terminal):
```bash
cd /home/user/test111/categorizacion/frontend
npm run dev
```

**Terminal 3 - Backend Generador** (nueva terminal):
```bash
cd /home/user/test111/sistema-ejercicio/backend
source venv/bin/activate
python -m uvicorn main:app --reload --port 8001
```

**Terminal 4 - Frontend Ejercicios** (nueva terminal):
```bash
cd /home/user/test111/sistema-ejercicio/frontend
npm run dev
```

### URLs Importantes

| Servicio | URL | Propósito |
|----------|-----|-----------|
| Backend Clasificación | http://localhost:8000 | API de clasificación de perfiles |
| Swagger Clasificación | http://localhost:8000/docs | Documentación interactiva |
| Frontend Clasificación | http://localhost:3000 | Cuestionarios de clasificación |
| Backend Generador | http://localhost:8001 | API de generación de ejercicios |
| Swagger Generador | http://localhost:8001/docs | Testing interactivo Gemini AI |
| Frontend Ejercicios | http://localhost:3001 | Aplicación de ejercicios |

### Flujo de Testing Completo

1. ✅ **Clasificación**: Levantar backend (8000) + frontend (3000) → Clasificar estudiante → Obtener EST001
2. ✅ **Generador**: Levantar backend (8001) + frontend (3001) → Verificar Gemini en /docs
3. ✅ **Flujo E2E**: Usar EST001 → Generar ejercicios → Responder → Completar
4. ✅ **Tracking**: Verificar JSON → Ver sesiones guardadas en data/sesiones.json
5. ✅ **Adaptativo**: Ver recomendación en consola → Testear endpoint /nivel-recomendado

---

---

## 11. Guía Rápida para Windows

### 📋 Checklist Setup Completo en Windows

**Pre-requisitos**:
- [ ] Python 3.11 instalado (verificar: `python --version` o `py --version`)
- [ ] Node.js 18+ instalado (verificar: `node --version`)
- [ ] Git para Windows instalado (opcional)
- [ ] API Key de Gemini obtenida

**Sistema de Clasificación**:
- [ ] Navegado a: `E:\Files\...\test111\categorizacion\backend`
- [ ] Creado venv: `python -m venv venv`
- [ ] Activado venv: `venv\Scripts\activate`
- [ ] Creado .env: `copy .env.example .env`
- [ ] Instalado deps: `pip install -r requirements.txt`
- [ ] Backend corriendo en puerto 8000
- [ ] Frontend corriendo en puerto 3000

**Sistema de Ejercicios**:
- [ ] Navegado a: `E:\Files\...\test111\sistema-ejercicio\backend`
- [ ] Creado venv: `python -m venv venv`
- [ ] Activado venv: `venv\Scripts\activate`
- [ ] Creado .env: `copy .env.example .env`
- [ ] Agregado GEMINI_API_KEY en .env
- [ ] Instalado deps: `pip install -r requirements.txt`
- [ ] Backend corriendo en puerto 8001
- [ ] Frontend corriendo en puerto 3001

### 🚀 Script de Inicio Rápido (PowerShell)

Crea un archivo `start-all.ps1` en la raíz del proyecto:

```powershell
# start-all.ps1 - Inicia todos los servidores

$base = "E:\Files\Cheems Heaven\innova-edu-ai_backend\test111"

# Función para abrir nueva ventana de PowerShell
function Start-Service {
    param($Path, $Command)
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; $Command"
}

Write-Host "🚀 Iniciando todos los servicios..." -ForegroundColor Green

# Backend Clasificación
Start-Service "$base\categorizacion\backend" "venv\Scripts\activate; python run.py"
Start-Sleep 3

# Frontend Clasificación
Start-Service "$base\categorizacion\frontend" "npm run dev"
Start-Sleep 3

# Backend Ejercicios
Start-Service "$base\sistema-ejercicio\backend" "venv\Scripts\activate; python run.py"
Start-Sleep 3

# Frontend Ejercicios
Start-Service "$base\sistema-ejercicio\frontend" "npm run dev"

Write-Host "✅ Todos los servicios iniciados!" -ForegroundColor Green
Write-Host "📚 URLs:" -ForegroundColor Cyan
Write-Host "  - Clasificación: http://localhost:3000" -ForegroundColor White
Write-Host "  - Ejercicios: http://localhost:3001" -ForegroundColor White
Write-Host "  - API Clasificación: http://localhost:8000/docs" -ForegroundColor White
Write-Host "  - API Ejercicios: http://localhost:8001/docs" -ForegroundColor White
```

**Ejecutar**:
```powershell
.\start-all.ps1
```

### 🔧 Troubleshooting Específico Windows

#### Error: "Execution Policy"
```powershell
# Solución (ejecutar PowerShell como Administrador):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Error: "python no se reconoce"
```powershell
# Opción 1: Usa py en lugar de python
py -3.11 -m venv venv

# Opción 2: Agrega Python al PATH
# 1. Busca "Variables de entorno" en Windows
# 2. Edita "Path" en Variables del sistema
# 3. Agrega: C:\Users\TuUsuario\AppData\Local\Programs\Python\Python311
```

#### Error: "ModuleNotFoundError"
```powershell
# Verifica que estés en el venv activado
# Deberías ver (venv) al inicio de la línea
venv\Scripts\activate

# Reinstala dependencias
pip install -r requirements.txt
```

#### Error: Puerto ocupado
```powershell
# Ver qué proceso usa el puerto 8000
netstat -ano | findstr :8000

# Matar el proceso (reemplaza PID con el número que viste)
taskkill /PID XXXX /F
```

#### Error: Firewall de Windows
- Windows preguntará si permites Python/Node acceder a la red
- **Selecciona "Permitir acceso"** para ambos (público y privado)

### 📝 Comandos Útiles Windows

```powershell
# Ver archivos en directorio actual
ls

# Cambiar de directorio
cd ruta\al\directorio

# Volver al directorio anterior
cd ..

# Ver contenido de archivo
type archivo.txt

# Buscar texto en archivo
Select-String -Path archivo.txt -Pattern "texto"

# Limpiar consola
cls

# Ver procesos corriendo
Get-Process python
Get-Process node

# Ver puertos en uso
netstat -ano | findstr :8000
```

---

**Creado**: 17 de Noviembre, 2025
**Última actualización**: 18 de Noviembre, 2025
**Versión**: 2.0.0 (Actualizado con guía Windows completa)
