# Guía de Testing - Generador de Ejercicios con Gemini AI

**Fecha**: 17 de Noviembre, 2025
**Objetivo**: Guía práctica para levantar y testear todos los componentes del sistema

---

## 📋 Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Setup Inicial](#setup-inicial)
3. [Testing Backend (FastAPI)](#testing-backend-fastapi)
4. [Testing Gemini AI](#testing-gemini-ai)
5. [Testing Frontend (Next.js)](#testing-frontend-nextjs)
6. [Testing End-to-End](#testing-end-to-end)
7. [Troubleshooting](#troubleshooting)
8. [Checklist de Verificación](#checklist-de-verificación)

---

## 1. Pre-requisitos

### Software Necesario

```bash
# Verificar versiones instaladas
python --version    # Debe ser >= 3.11
node --version      # Debe ser >= 18.x
npm --version       # Debe ser >= 9.x
```

**Si no están instalados**:
- Python 3.11+: https://www.python.org/downloads/
- Node.js 18+: https://nodejs.org/

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

### 2.1 Clonar el Repositorio (si no lo tienes)

```bash
# Ya deberías tener el código en:
cd /home/user/test111
```

### 2.2 Estructura del Proyecto

```
test111/
├── backend/                        # Backend de clasificación (no usar)
├── frontend/
│   ├── ejercicios-app/            # ✅ Frontend de ejercicios (USAR)
│   └── sistema-categorizacion/    # Frontend de clasificación (no usar)
├── generador-ejercicios/          # ✅ Backend de ejercicios (USAR)
└── docs/                          # Documentación
```

**Proyectos a testear**:
1. ✅ `generador-ejercicios/` - Backend FastAPI
2. ✅ `frontend/ejercicios-app/` - Frontend Next.js

---

## 3. Testing Backend (FastAPI)

### 3.1 Navegar al Directorio

```bash
cd /home/user/test111/generador-ejercicios
```

### 3.2 Crear Entorno Virtual (Recomendado)

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Linux/Mac:
source venv/bin/activate

# En Windows:
venv\Scripts\activate

# Deberías ver (venv) al inicio de tu terminal
```

### 3.3 Instalar Dependencias

```bash
pip install -r requirements.txt
```

**Output esperado**:
```
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 pydantic-2.5.0 ...
```

### 3.4 Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar archivo .env
nano .env
# o con tu editor preferido:
# code .env
# vim .env
```

**Agregar tu API Key**:
```env
# ============================================================================
# GENERADOR DE EJERCICIOS - VARIABLES DE ENTORNO
# ============================================================================

# Google Gemini AI API Key
# Obtén tu API key en: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=AIzaSy...tu_api_key_aqui_completa

# Configuración de la aplicación
APP_NAME="Generador de Ejercicios con Gemini"
APP_VERSION="1.0.0"
DEBUG=False
```

**Guardar**: `Ctrl + O`, `Enter`, `Ctrl + X` (en nano)

### 3.5 Verificar Configuración

```bash
# Verificar que el archivo existe y tiene contenido
cat .env

# Deberías ver tu API key
```

### 3.6 Levantar el Servidor

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

### 3.7 Verificar que el Backend Está Corriendo

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

### 3.8 Acceder a la Documentación Interactiva

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

## 5. Testing Frontend (Next.js)

### 5.1 Nueva Terminal

**⚠️ IMPORTANTE**: NO cerrar la terminal del backend. Abrir una nueva terminal.

```bash
# Nueva terminal
cd /home/user/test111/frontend/ejercicios-app
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

## 6. Testing End-to-End

### 6.1 Verificar que Ambos Servidores Están Corriendo

**Terminal 1** (Backend):
```
INFO:     Uvicorn running on http://0.0.0.0:8001
```

**Terminal 2** (Frontend):
```
- Local:        http://localhost:3001
✓ Ready in 3.1s
```

### 6.2 Flujo Completo: Generar Ejercicios

#### Paso 1: Configurar Sesión

1. **Abrir**: http://localhost:3001

2. **Rellenar formulario**:
   - ID Estudiante: `EST001`
   - Curso: `Matemáticas`
   - Cantidad: `5 ejercicios`

3. **Click**: "Comenzar Ejercicios"

4. **Verificar**:
   - ⏳ Aparece mensaje "Generando ejercicios personalizados..."
   - ⏱️ Espera 5-10 segundos

#### Paso 2: Ver Ejercicios Generados

**Deberías ver**:
- ✅ Ejercicio 1 de 5 mostrado
- ✅ Enunciado del ejercicio
- ✅ 4 opciones (A, B, C, D)
- ✅ Barra de progreso (1/5)
- ✅ Tiempo transcurrido contando

**Abrir Consola del Navegador** (F12):
```javascript
// Deberías ver:
✅ Sesión creada: SES_20251117_EST001_001
```

#### Paso 3: Responder Ejercicios

1. **Seleccionar una opción** (ej: A)

2. **Verificar feedback**:
   - ✅ Opción correcta: Fondo verde + "¡Correcto!"
   - ❌ Opción incorrecta: Fondo rojo + "Incorrecto"
   - ✅ Muestra explicación

3. **Click "Siguiente"**

4. **Repetir** para los 5 ejercicios

**Verificar en consola**:
```javascript
✅ Respuesta registrada en backend
```

#### Paso 4: Ver Resultados Finales

**Después del ejercicio 5**:
- ✅ Pantalla de resultados
- ✅ Correctas: X de 5
- ✅ Tasa de aciertos: X%
- ✅ Tiempo total
- ✅ Botón "Comenzar Nueva Sesión"

**Verificar en consola**:
```javascript
✅ Sesión completada: { total_ejercicios: 5, ... }
```

**⚠️ NOTA**: La recomendación de nivel NO se muestra en UI (pendiente de implementar)

### 6.3 Verificar Tracking en el Backend

#### Ver Sesión Guardada

**Terminal del backend** (donde corre uvicorn), ver logs:
```
INFO:     127.0.0.1:XXXXX - "POST /api/sesiones/crear HTTP/1.1" 200 OK
INFO:     127.0.0.1:XXXXX - "POST /api/sesiones/SES_20251117_EST001_001/responder HTTP/1.1" 200 OK
...
INFO:     127.0.0.1:XXXXX - "POST /api/sesiones/SES_20251117_EST001_001/completar HTTP/1.1" 200 OK
```

#### Ver Archivo JSON

```bash
# En otra terminal o Ctrl+C en backend
cat generador-ejercicios/data/sesiones.json | jq .

# O sin jq:
cat generador-ejercicios/data/sesiones.json
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
        // ... 4 respuestas más
      ],
      "estado": "completada",
      "fecha_inicio": "2025-11-17T...",
      "fecha_fin": "2025-11-17T..."
    }
  ]
}
```

### 6.4 Testing del Sistema Adaptativo

#### Ver Recomendación en Response

**Método 1: Consola del Navegador**

Al completar sesión, en la consola deberías ver:
```javascript
✅ Sesión completada: {
  estadisticas: { ... },
  recomendacion_nivel: {
    nivel_actual: "basico",
    nivel_recomendado: "intermedio",  // Depende de tu rendimiento
    direccion: "subir",
    razon: "Excelente tasa de aciertos (80%). Nivel actual fácil.",
    confianza: "alta"
  }
}
```

**Método 2: Llamar Endpoint Directamente**

```bash
curl "http://localhost:8001/api/estudiantes/EST001/nivel-recomendado?curso=matematicas"
```

**Response**:
```json
{
  "nivel_actual": "basico",
  "nivel_recomendado": "intermedio",
  "direccion": "subir",
  "razon": "Excelente tasa de aciertos (85%) en últimas sesiones.",
  "confianza": "alta",
  "cambio_aplicado": true,
  "metricas": {
    "tasa_aciertos_historica": 0.85,
    "total_ejercicios": 5
  }
}
```

#### Casos de Prueba del Adaptador

**Test Case 1: Rendimiento Bajo → Bajar Nivel**

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

### Comandos Rápidos

**Levantar Backend**:
```bash
cd /home/user/test111/generador-ejercicios
source venv/bin/activate
python -m uvicorn main:app --reload --port 8001
```

**Levantar Frontend** (nueva terminal):
```bash
cd /home/user/test111/frontend/ejercicios-app
npm run dev
```

**Verificar**:
- Backend: http://localhost:8001/docs
- Frontend: http://localhost:3001

### URLs Importantes

| Servicio | URL | Propósito |
|----------|-----|-----------|
| Backend API | http://localhost:8001 | API REST |
| Swagger Docs | http://localhost:8001/docs | Testing interactivo |
| Frontend App | http://localhost:3001 | Aplicación web |

### Flujo de Testing Básico

1. ✅ Levantar backend → verificar en /docs
2. ✅ Testear Gemini → generar 3 ejercicios
3. ✅ Levantar frontend → verificar UI carga
4. ✅ Flujo E2E → generar, responder, completar
5. ✅ Verificar JSON → ver sesiones guardadas
6. ✅ Testear adaptador → verificar recomendaciones

---

**Creado**: 17 de Noviembre, 2025
**Última actualización**: 17 de Noviembre, 2025
**Versión**: 1.0.0
