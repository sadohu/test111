# 🔌 Guía de Integración Frontend-Backend

Esta guía explica cómo iniciar y probar la integración completa entre el frontend y backend del Sistema de Clasificación de Perfiles Estudiantiles.

## 📋 Descripción General

El sistema está compuesto por:

- **Frontend** (Next.js + TypeScript): Formulario interactivo para estudiantes
- **Backend** (FastAPI + Python): API RESTful con clasificación de perfiles y almacenamiento JSON

### Flujo de Datos

```
1. Estudiante completa formulario (10 preguntas) → Frontend
2. Frontend envía todas las respuestas → Backend API (/api/clasificar-perfil)
3. Backend clasifica el perfil con el algoritmo
4. Backend guarda automáticamente en backend/data/perfiles.json
5. Backend retorna perfil clasificado → Frontend
6. Frontend muestra resultados al estudiante
```

## 🚀 Inicio Rápido

### 1️⃣ Iniciar el Backend

```bash
# Navegar al directorio del backend
cd backend

# Crear entorno virtual (primera vez)
python -m venv venv

# Activar entorno virtual
# En Linux/Mac:
source venv/bin/activate
# En Windows:
venv\Scripts\activate

# Instalar dependencias (primera vez)
pip install -r requirements.txt

# Iniciar servidor
python -m app.main
```

El backend estará disponible en: **http://localhost:8000**
- Documentación: http://localhost:8000/docs
- API Health: http://localhost:8000/api/health

### 2️⃣ Iniciar el Frontend

```bash
# En otra terminal, navegar al directorio del frontend
cd frontend/sistema-categorizacion

# Instalar dependencias (primera vez)
npm install

# Verificar que .env.local existe con:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

## 🧪 Probar la Integración

### Opción 1: Prueba Manual (Navegador)

1. Abre http://localhost:3000 en tu navegador
2. Completa el formulario de 10 preguntas
3. Envía las respuestas
4. Observa el perfil clasificado en pantalla
5. Verifica que se guardó en `backend/data/perfiles.json`

### Opción 2: Prueba Automática (Script Python)

```bash
# Asegúrate de que el backend esté corriendo

# Ejecutar script de prueba
cd backend
python test_integracion.py
```

El script ejecutará 7 pruebas:
- ✅ Health Check
- ✅ Clasificar Perfil (simula frontend)
- ✅ Obtener Perfil Guardado
- ✅ Listar Perfiles
- ✅ Estadísticas
- ✅ Múltiples Estudiantes
- ✅ Validar Respuesta

### Opción 3: Prueba con cURL

```bash
# Clasificar un perfil
curl -X POST "http://localhost:8000/api/clasificar-perfil" \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": "EST001",
    "grado": "3-4",
    "respuestas": {
      "P1": "A", "P2": "C", "P3": "B", "P4": "C", "P5": "B",
      "P6": "B", "P7": "A", "P8": "A", "P9": "B", "P10": "A"
    }
  }'

# Obtener perfil guardado
curl http://localhost:8000/api/perfil/EST001

# Listar todos los perfiles
curl http://localhost:8000/api/perfiles

# Ver estadísticas
curl http://localhost:8000/api/estadisticas
```

## 📁 Estructura de Archivos

```
test111/
├── backend/
│   ├── app/
│   │   ├── main.py                    # Aplicación FastAPI
│   │   ├── routes/perfil.py          # Endpoints de la API
│   │   ├── services/
│   │   │   ├── clasificador.py       # Algoritmo de clasificación
│   │   │   └── json_storage.py       # Almacenamiento en JSON
│   │   └── models/perfil.py          # Modelos Pydantic
│   ├── data/
│   │   └── perfiles.json             # ⭐ Perfiles guardados (generado automáticamente)
│   ├── requirements.txt
│   └── test_integracion.py           # Script de prueba
│
└── frontend/sistema-categorizacion/
    ├── src/
    │   ├── models/perfil.types.ts    # TypeScript types
    │   ├── services/
    │   │   ├── api.client.ts         # Cliente HTTP
    │   │   └── perfil.service.ts     # Servicio de perfiles
    │   └── components/
    │       └── FormularioCategorizacion.tsx  # Formulario principal
    ├── .env.local                     # ⭐ Configuración local (NEXT_PUBLIC_API_URL)
    └── package.json
```

## 🔍 Verificar que Todo Funciona

### Backend (http://localhost:8000)

✅ **Verificación Rápida:**
```bash
curl http://localhost:8000/api/health
# Debe responder: {"status":"healthy","service":"Sistema de Clasificación de Perfiles","version":"1.0.0"}
```

✅ **Ver Documentación Interactiva:**
- Abre http://localhost:8000/docs en tu navegador
- Prueba los endpoints directamente desde Swagger UI

### Frontend (http://localhost:3000)

✅ **Verificación Rápida:**
- Abre http://localhost:3000 en tu navegador
- Deberías ver el formulario de categorización
- Abre la consola del navegador (F12) → Network
- Al enviar el formulario, deberías ver una petición POST a `http://localhost:8000/api/clasificar-perfil`

### Archivo JSON

✅ **Verificar almacenamiento:**
```bash
# Ver perfiles guardados
cat backend/data/perfiles.json

# O con formato bonito
python -m json.tool backend/data/perfiles.json
```

## 📊 Ejemplo de Respuesta del Backend

Cuando el frontend envía las respuestas, el backend responde con:

```json
{
  "estudiante_id": "EST001",
  "grado": "3-4",
  "fecha_creacion": "2025-11-17T10:30:00",
  "estilo_aprendizaje": "visual",
  "velocidad": "moderado",
  "atencion": "media",
  "interes": "cientifico",
  "nivel_matematicas": "intermedio",
  "nivel_lectura": "desarrollado",
  "motivacion": "alta",
  "frustracion": "resiliente",
  "trabajo": "colaborativo",
  "energia": "matutino",
  "nivel_riesgo": "bajo",
  "categoria_principal": "El Científico Resiliente",
  "recomendaciones": [
    "📊 Usar organizadores visuales y mapas mentales",
    "⏰ Organizar bloques de estudio de 20-25 minutos",
    "🔬 Incorporar experimentos y actividades prácticas"
  ],
  "confianza_perfil": 60
}
```

Y automáticamente guarda en `backend/data/perfiles.json`:

```json
{
  "metadata": {
    "created_at": "2025-11-17T08:00:00",
    "version": "1.0.0",
    "total_perfiles": 1,
    "last_updated": "2025-11-17T10:30:00"
  },
  "perfiles": [
    {
      "estudiante_id": "EST001",
      "grado": "3-4",
      "categoria_principal": "El Científico Resiliente",
      "nivel_riesgo": "bajo",
      "respuestas_originales": {
        "P1": "A", "P2": "C", "P3": "B", ...
      },
      "fecha_guardado": "2025-11-17T10:30:00",
      ...
    }
  ]
}
```

## 🐛 Solución de Problemas

### Error: "Connection refused" al enviar formulario

❌ **Problema:** El backend no está corriendo
✅ **Solución:** Inicia el backend con `python -m app.main` en `backend/`

### Error: "CORS policy"

❌ **Problema:** El frontend no puede conectarse al backend por CORS
✅ **Solución:** Verifica que `backend/app/config.py` tenga `http://localhost:3000` en `cors_origins`

### Error: "Module not found" en backend

❌ **Problema:** Dependencias no instaladas
✅ **Solución:**
```bash
cd backend
pip install -r requirements.txt
```

### Error: "Cannot find module" en frontend

❌ **Problema:** Dependencias no instaladas
✅ **Solución:**
```bash
cd frontend/sistema-categorizacion
npm install
```

### El archivo perfiles.json no se crea

❌ **Problema:** El backend no tiene permisos o el directorio no existe
✅ **Solución:** El directorio `backend/data/` se crea automáticamente al iniciar el backend

### Frontend no encuentra la API

❌ **Problema:** La variable de entorno no está configurada
✅ **Solución:** Verifica que exista `frontend/sistema-categorizacion/.env.local` con:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 Recursos Adicionales

- **Backend README:** `backend/README.md` - Documentación completa del API
- **Frontend ARQUITECTURA:** `frontend/sistema-categorizacion/ARQUITECTURA.md` - Arquitectura del frontend
- **API Docs:** http://localhost:8000/docs - Documentación interactiva Swagger

## 🎯 Próximos Pasos

Una vez que la integración esté funcionando:

1. ✅ Prueba con diferentes respuestas de estudiantes
2. ✅ Revisa las categorías asignadas en `backend/data/perfiles.json`
3. ✅ Consulta las estadísticas: http://localhost:8000/api/estadisticas
4. 🔜 Integra con Supabase para almacenamiento en la nube
5. 🔜 Implementa autenticación para estudiantes
6. 🔜 Crea dashboard de visualización de perfiles

---

**¿Problemas?** Revisa los logs del backend en la terminal donde ejecutaste `python -m app.main`
