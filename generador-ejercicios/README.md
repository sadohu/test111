# Generador de Ejercicios - Gemini AI

Sistema de generación automática de ejercicios educativos personalizados usando Google Gemini AI.

## 🎯 Características

- **Dos Cursos**: Matemáticas y Razonamiento Verbal
- **Tres Niveles**: Básico (grados 1-2), Intermedio (grados 3-4), Avanzado (grados 5-6)
- **Personalización**: Basada en perfil del estudiante
- **API REST**: Endpoints listos para integrar con frontend
- **Validación**: Pydantic para validación automática de datos
- **Prompts Estructurados**: Templates personalizables para cada nivel

## 📋 Requisitos

- Python 3.8+
- Google Gemini API Key
- Perfiles de estudiantes almacenados en `backend/data/perfiles.json`

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd generador-ejercicios
pip install -r requirements.txt
```

### 2. Configurar API Key de Gemini

Asegúrate de tener tu API key en el archivo `.env` en la raíz del proyecto:

```bash
# En /home/user/test111/.env
GEMINI_API_KEY=tu_api_key_aqui
GEMINI_MODEL=gemini-pro
```

### 3. Verificar estructura de directorios

```
generador-ejercicios/
├── main.py                 # FastAPI app
├── requirements.txt        # Dependencias
├── README.md              # Este archivo
├── models/                # Modelos Pydantic
│   ├── __init__.py
│   ├── ejercicio.py       # Modelos de ejercicios
│   └── request.py         # Request/Response models
├── services/              # Lógica de negocio
│   ├── __init__.py
│   ├── gemini_client.py   # Cliente de Gemini
│   ├── perfil_adapter.py  # Leer perfiles
│   ├── prompt_builder.py  # Construir prompts
│   ├── generador_matematicas.py
│   └── generador_verbal.py
└── prompts/               # Templates de prompts
    ├── matematicas/
    │   ├── basico.txt
    │   ├── intermedio.txt
    │   └── avanzado.txt
    └── verbal/
        ├── basico.txt
        ├── intermedio.txt
        └── avanzado.txt
```

## 🎮 Uso

### Iniciar el servidor

```bash
cd generador-ejercicios
python main.py
```

El servidor estará disponible en: `http://localhost:8001`

Documentación interactiva: `http://localhost:8001/docs`

### Endpoints Principales

#### 1. Health Check

```bash
GET /health
```

Verifica el estado del servicio.

#### 2. Generar Ejercicios (General)

```bash
POST /api/generar-ejercicios
Content-Type: application/json

{
  "estudiante_id": "EST001",
  "curso": "matematicas",
  "cantidad": 5,
  "tipo_especifico": "suma",
  "forzar_nivel": null
}
```

#### 3. Generar Ejercicios de Matemáticas

```bash
POST /api/generar-ejercicios/matematicas
Content-Type: application/json

{
  "estudiante_id": "EST001",
  "curso": "matematicas",
  "cantidad": 3,
  "tipo_especifico": "multiplicacion"
}
```

**Tipos disponibles por nivel:**
- **Básico**: suma, resta, conteo, comparacion, figuras, patrones
- **Intermedio**: multiplicacion, division, fracciones, geometria, problemas_mixtos
- **Avanzado**: operaciones_combinadas, porcentajes, geometria_avanzada, proporciones

#### 4. Generar Ejercicios de Razonamiento Verbal

```bash
POST /api/generar-ejercicios/verbal
Content-Type: application/json

{
  "estudiante_id": "EST001",
  "curso": "verbal",
  "cantidad": 3,
  "tipo_especifico": "sinonimos"
}
```

**Tipos disponibles por nivel:**
- **Básico**: sinonimos, antonimos, categorias, completar, analogias
- **Intermedio**: termino_excluido, comprension, oraciones_incompletas
- **Avanzado**: comprension_inferencial, analogias_complejas, plan_de_redaccion, conectores_logicos

#### 5. Obtener Perfil de Estudiante

```bash
GET /api/perfiles/{estudiante_id}
```

#### 6. Listar Todos los Perfiles

```bash
GET /api/perfiles
```

### Ejemplo de Respuesta

```json
{
  "success": true,
  "mensaje": "3 ejercicios generados exitosamente",
  "estudiante_id": "EST001",
  "curso": "matematicas",
  "cantidad_solicitada": 3,
  "cantidad_generada": 3,
  "ejercicios_matematicas": [
    {
      "id": "MAT_INT_001",
      "titulo": "Compra en el mercado",
      "enunciado": "Carlos fue al mercado con 50 soles...",
      "opciones": [
        "A) 36 soles",
        "B) 34 soles",
        "C) 40 soles",
        "D) 38 soles"
      ],
      "respuesta_correcta": "A",
      "explicacion": "Primero calculamos lo que gastó...",
      "nivel": "medio",
      "tipo": "problemas_mixtos",
      "operacion_principal": "multiplicacion_resta",
      "contexto": "mercado",
      "incluye_visual": false
    }
  ],
  "ejercicios_verbales": null,
  "perfil_usado": {
    "estudiante_id": "EST001",
    "grado": "3-4",
    "nivel_matematicas": "intermedio",
    "estilo_aprendizaje": "visual",
    "velocidad_lectura": "promedio",
    "areas_interes": "naturaleza, ciencias"
  },
  "nivel_determinado": "intermedio",
  "tiempo_generacion_segundos": 3.45
}
```

## 🧪 Testing

### Test de PromptBuilder

```bash
cd generador-ejercicios/services
python prompt_builder.py
```

### Test de GeneradorMatematicas

```bash
cd generador-ejercicios/services
python generador_matematicas.py
```

### Test de GeneradorVerbal

```bash
cd generador-ejercicios/services
python generador_verbal.py
```

## 🏗️ Arquitectura

```
┌─────────────┐
│   Frontend  │ (Next.js)
└──────┬──────┘
       │ HTTP POST /api/generar-ejercicios
       ▼
┌──────────────────────────────────────┐
│      FastAPI (main.py)               │
│  - Validación de requests            │
│  - Enrutamiento                      │
│  - Manejo de errores                 │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Generador (matematicas/verbal)      │
│  1. Obtiene perfil del estudiante    │
│  2. Determina nivel de dificultad    │
│  3. Construye prompt personalizado   │
│  4. Llama a Gemini AI                │
│  5. Valida y retorna ejercicios      │
└──────┬───────────────────────────────┘
       │
       ├──► PerfilAdapter ──► backend/data/perfiles.json
       │
       ├──► PromptBuilder ──► prompts/matematicas/*.txt
       │                   └─► prompts/verbal/*.txt
       │
       └──► GeminiClient ──► Google Gemini API
```

## 🎨 Personalización

### Cómo funciona la personalización

El sistema personaliza los ejercicios basándose en:

1. **Nivel de dificultad**: Determinado por grado y nivel de matemáticas/lectura
2. **Estilo de aprendizaje**: Visual, auditivo, kinestésico, lectura/escritura
3. **Velocidad de lectura**: Afecta longitud de enunciados
4. **Áreas de interés**: Define contextos (deportes, naturaleza, hogar, etc.)

### Ejemplo de Personalización

**Estudiante con perfil:**
- Estilo: Visual
- Interés: Naturaleza
- Nivel: Intermedio

**Ejercicio generado:**
```
"Un ornitólogo observa 15 aves rojas y 23 aves azules
en el bosque. Describe detalladamente los colores de
sus plumajes..."
```

Incluye: descripción visual, contexto de naturaleza, complejidad media.

## 📝 Logs y Debugging

El sistema imprime logs detallados:

```
📊 Obteniendo perfil del estudiante EST001...
🎯 Nivel determinado del perfil: intermedio
📝 Tipo de ejercicio: suma
🔨 Construyendo prompt personalizado...
🤖 Generando con Gemini (intento 1/3)...
✅ Generados 3 ejercicios exitosamente
```

## 🔒 Seguridad

- Las API keys se cargan desde variables de entorno
- Validación automática con Pydantic
- Límites en cantidad de ejercicios (1-20)
- Reintentos con backoff exponencial

## 🚦 Próximos Pasos

- [ ] Implementar almacenamiento de ejercicios generados
- [ ] Agregar sistema de validación de respuestas
- [ ] Estadísticas de uso por estudiante
- [ ] Cache de ejercicios generados
- [ ] Integración con frontend
- [ ] Tests unitarios y de integración

## 📚 Documentación Adicional

- **Swagger UI**: `http://localhost:8001/docs`
- **ReDoc**: `http://localhost:8001/redoc`
- **OpenAPI JSON**: `http://localhost:8001/openapi.json`

## 🤝 Integración con Sistema de Clasificación

Este módulo se integra con el backend de clasificación de perfiles:

1. **Backend de Clasificación** (puerto 8000): Clasifica estudiantes y guarda perfiles
2. **Generador de Ejercicios** (puerto 8001): Lee perfiles y genera ejercicios

**Flujo completo:**
```
Estudiante → Formulario → Backend Clasificación → perfiles.json
                                                        ↓
Frontend Ejercicios → API Generador → Lee perfiles.json → Gemini AI → Ejercicios
```

## 📄 Licencia

Este proyecto es parte del sistema educativo adaptativo.

## 👤 Autor

Desarrollado como parte del sistema de educación personalizada con IA.

---

**Nota**: Asegúrate de tener una API key válida de Google Gemini y perfiles de estudiantes en `backend/data/perfiles.json` antes de usar este sistema.
