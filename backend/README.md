# 🎯 Backend API - Sistema de Clasificación de Perfiles Estudiantiles

API RESTful desarrollada con FastAPI para clasificar perfiles de estudiantes basados en formularios psicopedagógicos.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints de la API](#endpoints-de-la-api)
- [Integración con Supabase](#integración-con-supabase)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Ejemplos](#ejemplos)

## ✨ Características

- ✅ **Clasificación Automática de Perfiles**: 10 categorías de perfiles estudiantiles
- ✅ **Evaluación de Riesgo**: 3 niveles (bajo, medio, alto)
- ✅ **Recomendaciones Personalizadas**: Sugerencias pedagógicas por perfil
- ✅ **Validación de Datos**: Pydantic para validación robusta
- ✅ **Documentación Automática**: Swagger UI y ReDoc incluidos
- ✅ **CORS Configurado**: Listo para integración con frontend
- ✅ **Integración con Supabase**: Almacenamiento persistente (opcional)

## 🛠 Tecnologías

- **FastAPI** 0.104+ - Framework web moderno y rápido
- **Pydantic** 2.5+ - Validación de datos
- **Uvicorn** - Servidor ASGI de alto rendimiento
- **Supabase** - Backend-as-a-Service (opcional)
- **Python** 3.8+

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd backend
```

### 2. Crear entorno virtual

```bash
python -m venv venv

# En Linux/Mac
source venv/bin/activate

# En Windows
venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

## ⚙️ Configuración

### 1. Crear archivo .env

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

### 2. Configurar variables de entorno

Edita `.env` con tus valores:

```env
# Información de la Aplicación
APP_NAME="API Sistema de Clasificación de Perfiles"
APP_VERSION="1.0.0"
DEBUG=true

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Supabase (opcional - obtén estos valores desde https://supabase.com)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key
SUPABASE_SERVICE_KEY=tu-service-role-key
```

## 🚀 Uso

### Iniciar el servidor

```bash
# Modo desarrollo (con reload automático)
python -m app.main

# O con uvicorn directamente
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en:
- **API**: http://localhost:8000
- **Documentación Interactiva**: http://localhost:8000/docs
- **Documentación ReDoc**: http://localhost:8000/redoc

## 📚 Endpoints de la API

### 🏥 Health Check

```http
GET /api/health
```

**Respuesta:**
```json
{
  "status": "healthy",
  "service": "Sistema de Clasificación de Perfiles",
  "version": "1.0.0"
}
```

---

### 📝 Clasificar Perfil

```http
POST /api/clasificar-perfil
```

**Request Body:**
```json
{
  "estudiante_id": "EST001",
  "grado": "3-4",
  "respuestas": {
    "P1": "A",
    "P2": "C",
    "P3": "B",
    "P4": "C",
    "P5": "B",
    "P6": "B",
    "P7": "A",
    "P8": "A",
    "P9": "B",
    "P10": "A"
  }
}
```

**Respuesta Exitosa (200):**
```json
{
  "estudiante_id": "EST001",
  "grado": "3-4",
  "fecha_creacion": "2025-11-17T10:30:00",
  "ultima_actualizacion": "2025-11-17T10:30:00",
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

---

### ✅ Validar Respuesta

```http
POST /api/validar-respuesta
```

**Request Body:**
```json
{
  "pregunta": "P1",
  "respuesta": "A",
  "grado": "3-4"
}
```

**Respuesta:**
```json
{
  "valida": true,
  "mensaje": "Respuesta válida"
}
```

---

### 📋 Obtener Formulario por Grado

```http
GET /api/formulario/{grado}
```

**Parámetros:**
- `grado`: "1-2", "3-4", o "5-6"

**Ejemplo:**
```http
GET /api/formulario/3-4
```

---

### 🏷 Listar Categorías

```http
GET /api/categorias
```

**Respuesta:**
```json
{
  "total": 10,
  "categorias": [
    "El Científico Resiliente",
    "El Artista Creativo",
    "El Explorador Kinestésico",
    "El Estratega Analítico",
    "El Líder Social",
    "El Pensador Silencioso",
    "El Aprendiz Constante",
    "El Desafiante Audaz",
    "El Soñador Creativo",
    "El Observador Reflexivo"
  ]
}
```

## 🗄 Integración con Supabase

### Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Copia tus credenciales a `.env`
3. Crea las tablas necesarias:

```sql
-- Tabla de Perfiles
CREATE TABLE perfiles (
  id BIGSERIAL PRIMARY KEY,
  estudiante_id TEXT NOT NULL,
  grado TEXT NOT NULL,
  perfil_data JSONB NOT NULL,
  nivel_riesgo TEXT NOT NULL,
  categoria_principal TEXT NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

-- Tabla de Estudiantes
CREATE TABLE estudiantes (
  id BIGSERIAL PRIMARY KEY,
  estudiante_id TEXT UNIQUE NOT NULL,
  nombre TEXT,
  apellido TEXT,
  grado TEXT NOT NULL,
  seccion TEXT,
  edad INTEGER,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activo BOOLEAN DEFAULT TRUE
);

-- Índices
CREATE INDEX idx_perfiles_estudiante ON perfiles(estudiante_id);
CREATE INDEX idx_perfiles_riesgo ON perfiles(nivel_riesgo);
CREATE INDEX idx_estudiantes_id ON estudiantes(estudiante_id);
```

### Endpoints con Supabase (Próximamente)

```http
POST /api/perfil/guardar        # Guardar perfil en Supabase
GET /api/perfil/{id}            # Obtener perfil desde Supabase
GET /api/perfiles               # Listar perfiles con filtros
PUT /api/perfil/{id}            # Actualizar perfil
DELETE /api/perfil/{id}         # Eliminar perfil (soft delete)
```

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Aplicación FastAPI principal
│   ├── config.py               # Configuración y settings
│   ├── models/                 # Modelos Pydantic
│   │   ├── __init__.py
│   │   └── perfil.py          # Request/Response models
│   ├── routes/                 # Endpoints de la API
│   │   ├── __init__.py
│   │   └── perfil.py          # Rutas de perfiles
│   ├── services/               # Lógica de negocio
│   │   ├── __init__.py
│   │   └── clasificador.py    # Sistema de clasificación
│   └── database/               # Integración con BD
│       ├── __init__.py
│       └── supabase_client.py # Cliente de Supabase
├── requirements.txt            # Dependencias Python
├── .env.example               # Plantilla de configuración
└── README.md                  # Esta documentación
```

## 💡 Ejemplos de Uso

### Ejemplo con Python (requests)

```python
import requests

# Clasificar perfil
url = "http://localhost:8000/api/clasificar-perfil"
data = {
    "estudiante_id": "EST001",
    "grado": "3-4",
    "respuestas": {
        "P1": "A", "P2": "C", "P3": "B", "P4": "C", "P5": "B",
        "P6": "B", "P7": "A", "P8": "A", "P9": "B", "P10": "A"
    }
}

response = requests.post(url, json=data)
perfil = response.json()

print(f"Categoría: {perfil['categoria_principal']}")
print(f"Nivel de Riesgo: {perfil['nivel_riesgo']}")
print(f"Recomendaciones: {perfil['recomendaciones']}")
```

### Ejemplo con cURL

```bash
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
```

### Ejemplo con JavaScript (Fetch)

```javascript
const clasificarPerfil = async () => {
  const response = await fetch('http://localhost:8000/api/clasificar-perfil', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      estudiante_id: 'EST001',
      grado: '3-4',
      respuestas: {
        P1: 'A', P2: 'C', P3: 'B', P4: 'C', P5: 'B',
        P6: 'B', P7: 'A', P8: 'A', P9: 'B', P10: 'A'
      }
    })
  });

  const perfil = await response.json();
  console.log('Perfil:', perfil);
};
```

## 🧪 Testing

```bash
# Instalar dependencias de testing
pip install pytest pytest-asyncio httpx

# Ejecutar tests (próximamente)
pytest
```

## 🔒 Seguridad

- ✅ Validación de entrada con Pydantic
- ✅ CORS configurado para dominios específicos
- ✅ Variables sensibles en .env (no commiteadas)
- 🔜 Autenticación con API Keys (próximamente)
- 🔜 Rate limiting (próximamente)

## 📝 Licencia

Este proyecto es parte del Sistema de Clasificación de Perfiles Estudiantiles.

## 🤝 Contribución

Para contribuir al proyecto:

1. Crea un feature branch
2. Realiza tus cambios
3. Ejecuta los tests
4. Crea un Pull Request

## 📧 Soporte

Para preguntas o problemas, abre un issue en el repositorio.

---

**Desarrollado con ❤️ usando FastAPI**
