# 🎯 Generación de Ejercicios con Gemini AI - Propuesta de Implementación

**Fecha:** 17 de Noviembre 2025
**Estado:** 🔜 Planificado - Por implementar
**Base:** Adaptación del chatbot existente en `/chatbot`

---

## 📋 Tabla de Contenidos

1. [Contexto y Objetivo](#contexto)
2. [Arquitectura Propuesta](#arquitectura)
3. [Estructura del Proyecto](#estructura)
4. [Prompts de Gemini por Tipo de Ejercicio](#prompts)
5. [Integración con Perfiles](#integracion-perfiles)
6. [Roadmap de Implementación](#roadmap)
7. [Ejemplos de Uso](#ejemplos)

---

## 🎯 Contexto y Objetivo {#contexto}

### Situación Actual

✅ **Completado:**
- Sistema de clasificación de perfiles estudiantiles
- Almacenamiento de perfiles en JSON
- 10 características por estudiante
- Nivel de riesgo y recomendaciones

### Objetivo Nuevo

🎯 **Implementar:**
- Sistema de generación automática de ejercicios con Gemini AI
- Personalización basada en los perfiles recolectados
- Dos cursos MVP: **Razonamiento Matemático** y **Razonamiento Verbal**
- Ejercicios adaptativos según nivel y estilo de aprendizaje

### ¿Por qué Gemini?

- ✅ Ya existe implementación base en `/chatbot/main.py`
- ✅ Capacidad de generar contenido educativo estructurado
- ✅ Gratis (hasta cierto límite de requests)
- ✅ Integración sencilla con Python
- ✅ Puede adaptar dificultad y estilo dinámicamente

---

## 📐 Arquitectura Propuesta {#arquitectura}

### Visión General

```
┌─────────────────────────────────────────────────────────────┐
│                  SISTEMA COMPLETO                            │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Estudiante  │─────►│  Formulario  │─────►│   Backend    │
│              │      │  (Frontend)  │      │   FastAPI    │
└──────────────┘      └──────────────┘      └──────┬───────┘
                                                    │
                                                    ▼
                                            ┌───────────────┐
                                            │ Clasificador  │
                                            │   Perfiles    │
                                            └──────┬────────┘
                                                   │
                                                   ▼
                                          backend/data/perfiles.json
                                                   │
                                                   │ Lee perfil
                                                   ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Estudiante  │◄─────│   Frontend   │◄─────│  Generador   │
│  resuelve    │      │  muestra     │      │  Ejercicios  │
│  ejercicio   │      │  ejercicio   │      │   (Gemini)   │
└──────────────┘      └──────────────┘      └──────┬───────┘
                                                    │
                                                    │ Usa API
                                                    ▼
                                            ┌───────────────┐
                                            │  Google       │
                                            │  Gemini API   │
                                            └───────────────┘
```

### Flujo de Generación

```
1. Estudiante solicita ejercicios
   │
   ▼
2. Frontend envía: { estudiante_id, curso, cantidad }
   │
   ▼
3. Backend /api/generar-ejercicios
   ├─► Obtener perfil del estudiante (JSON)
   ├─► Determinar parámetros:
   │   ├─ Nivel de dificultad (según perfil.nivel_matematicas/lectura)
   │   ├─ Estilo de presentación (según perfil.estilo_aprendizaje)
   │   ├─ Longitud de ejercicio (según perfil.atencion)
   │   └─ Tipo de feedback (según perfil.frustracion)
   │
   └─► GeneradorEjerciciosGemini.generar()
       ├─► Construir prompt personalizado
       ├─► Llamar a Gemini API
       └─► Parsear respuesta estructurada
   │
   ▼
4. Respuesta: Lista de ejercicios JSON
   │
   ▼
5. Frontend muestra ejercicios adaptados al estudiante
```

---

## 📁 Estructura del Proyecto {#estructura}

### Nueva Estructura Propuesta

```
test111/
├── generador-ejercicios/          # 🆕 Nuevo módulo
│   ├── main.py                    # FastAPI app para ejercicios
│   ├── config.py                  # Configuración
│   ├── requirements.txt           # Dependencias
│   ├── .env.example
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gemini_client.py       # Cliente Gemini (adaptado de /chatbot)
│   │   ├── generador_matematicas.py
│   │   ├── generador_verbal.py
│   │   └── perfil_adapter.py      # Lee perfiles del JSON
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── ejercicio.py           # Modelos de ejercicios
│   │   └── request.py             # Request/Response models
│   │
│   ├── prompts/                   # 🆕 Prompts de Gemini organizados
│   │   ├── matematicas/
│   │   │   ├── basico.txt
│   │   │   ├── intermedio.txt
│   │   │   └── avanzado.txt
│   │   └── verbal/
│   │       ├── basico.txt
│   │       ├── intermedio.txt
│   │       └── avanzado.txt
│   │
│   └── tests/
│       └── test_generador.py
│
├── chatbot/                       # ✅ Existente (base)
│   ├── main.py                    # Base para gemini_client.py
│   ├── requirements.txt
│   └── README_GEMINI_CHATBOT.md
│
├── backend/                       # ✅ Existente (perfiles)
│   └── data/
│       └── perfiles.json         # Fuente de perfiles
│
└── frontend/
    └── ejercicios-app/            # 🆕 Nuevo frontend para ejercicios
        └── (similar a sistema-categorizacion)
```

---

## 🧩 Componentes Principales

### 1. Gemini Client (`services/gemini_client.py`)

**Adaptado de:** `/chatbot/main.py`

```python
import google.generativeai as genai
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiClient:
    """
    Cliente para interactuar con Google Gemini API
    Adaptado del chatbot original para generación de ejercicios
    """

    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY no encontrada en .env")

        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    def generar_ejercicio(
        self,
        prompt: str,
        temperatura: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """
        Genera un ejercicio usando Gemini

        Args:
            prompt: Prompt completo con instrucciones
            temperatura: Creatividad (0.0-1.0)
            max_tokens: Longitud máxima de respuesta

        Returns:
            Respuesta de Gemini como string
        """
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=temperatura,
                    max_output_tokens=max_tokens
                )
            )

            return response.text

        except Exception as e:
            raise Exception(f"Error al llamar Gemini API: {str(e)}")

    def generar_ejercicios_batch(
        self,
        prompts: List[str],
        temperatura: float = 0.7
    ) -> List[str]:
        """Genera múltiples ejercicios en batch"""
        resultados = []
        for prompt in prompts:
            resultado = self.generar_ejercicio(prompt, temperatura)
            resultados.append(resultado)
        return resultados

# Singleton
gemini_client = GeminiClient()
```

---

### 2. Generador de Matemáticas (`services/generador_matematicas.py`)

```python
from typing import Dict, List
import json
from .gemini_client import gemini_client
from .perfil_adapter import PerfilAdapter

class GeneradorMatematicas:
    """
    Genera ejercicios de razonamiento matemático
    personalizados según el perfil del estudiante
    """

    def __init__(self):
        self.perfil_adapter = PerfilAdapter()

    def generar_ejercicios(
        self,
        estudiante_id: str,
        cantidad: int = 5,
        tema: str = "general"
    ) -> List[Dict]:
        """
        Genera ejercicios de matemáticas personalizados

        Args:
            estudiante_id: ID del estudiante
            cantidad: Número de ejercicios a generar
            tema: "general", "suma-resta", "multiplicacion", "fracciones", etc.

        Returns:
            Lista de ejercicios en formato JSON
        """
        # 1. Obtener perfil del estudiante
        perfil = self.perfil_adapter.obtener_perfil(estudiante_id)

        if not perfil:
            # Usar perfil por defecto si no existe
            perfil = self.perfil_adapter.obtener_perfil_default()

        # 2. Determinar parámetros de generación
        params = self._determinar_parametros(perfil, tema)

        # 3. Construir prompt para Gemini
        prompt = self._construir_prompt(params, cantidad)

        # 4. Llamar a Gemini
        respuesta = gemini_client.generar_ejercicio(
            prompt,
            temperatura=0.7  # Algo de creatividad
        )

        # 5. Parsear respuesta JSON
        ejercicios = self._parsear_respuesta(respuesta)

        # 6. Validar y retornar
        return self._validar_ejercicios(ejercicios, cantidad)

    def _determinar_parametros(self, perfil: Dict, tema: str) -> Dict:
        """
        Determina parámetros de generación basados en el perfil
        """
        # Nivel de dificultad
        nivel_mate = perfil.get('nivel_matematicas', 'intermedio')
        if nivel_mate == 'avanzado':
            dificultad = 'difícil'
            operaciones = ['suma', 'resta', 'multiplicación', 'división', 'fracciones']
        elif nivel_mate == 'basico':
            dificultad = 'fácil'
            operaciones = ['suma', 'resta']
        else:  # intermedio
            dificultad = 'moderado'
            operaciones = ['suma', 'resta', 'multiplicación']

        # Estilo de presentación
        estilo = perfil.get('estilo_aprendizaje', 'visual')
        if estilo == 'visual':
            incluir_diagramas = True
            descripcion_visual = True
        else:
            incluir_diagramas = False
            descripcion_visual = False

        # Longitud según atención
        atencion = perfil.get('atencion', 'media')
        if atencion == 'baja':
            enunciado_max_palabras = 30
        elif atencion == 'alta':
            enunciado_max_palabras = 80
        else:
            enunciado_max_palabras = 50

        # Grado escolar
        grado = perfil.get('grado', '3-4')

        return {
            'dificultad': dificultad,
            'operaciones': operaciones,
            'incluir_diagramas': incluir_diagramas,
            'descripcion_visual': descripcion_visual,
            'enunciado_max_palabras': enunciado_max_palabras,
            'grado': grado,
            'tema': tema,
            'nivel_matematicas': nivel_mate,
            'estilo_aprendizaje': estilo
        }

    def _construir_prompt(self, params: Dict, cantidad: int) -> str:
        """
        Construye el prompt para Gemini
        """
        # Cargar template base
        nivel = params['nivel_matematicas']
        template_path = f"prompts/matematicas/{nivel}.txt"

        try:
            with open(template_path, 'r', encoding='utf-8') as f:
                template = f.read()
        except FileNotFoundError:
            template = self._get_default_template()

        # Personalizar prompt
        prompt = template.format(
            cantidad=cantidad,
            dificultad=params['dificultad'],
            operaciones=', '.join(params['operaciones']),
            grado=params['grado'],
            max_palabras=params['enunciado_max_palabras'],
            incluir_visual='Sí' if params['descripcion_visual'] else 'No',
            tema=params['tema']
        )

        return prompt

    def _get_default_template(self) -> str:
        """Template por defecto si no existe archivo"""
        return """
Eres un profesor de matemáticas de primaria en Perú.

Genera {cantidad} ejercicios de razonamiento matemático con las siguientes características:

- **Grado:** {grado}
- **Dificultad:** {dificultad}
- **Operaciones permitidas:** {operaciones}
- **Tema específico:** {tema}
- **Máximo de palabras en enunciado:** {max_palabras}
- **Incluir descripción visual:** {incluir_visual}

Formato de respuesta ESTRICTO (JSON):
```json
[
  {{
    "id": "MAT001",
    "titulo": "Título corto del problema",
    "enunciado": "Descripción del problema en máximo {max_palabras} palabras",
    "opciones": [
      "A) ...",
      "B) ...",
      "C) ...",
      "D) ..."
    ],
    "respuesta_correcta": "A",
    "explicacion": "Explicación paso a paso de la solución",
    "nivel": "{dificultad}",
    "tema": "{tema}"
  }}
]
```

IMPORTANTE:
- Genera EXACTAMENTE {cantidad} ejercicios
- Responde SOLO con el JSON, sin texto adicional
- Usa lenguaje apropiado para niños de {grado} grado
- Los problemas deben ser contextualizados (situaciones de la vida real)
"""

    def _parsear_respuesta(self, respuesta: str) -> List[Dict]:
        """
        Parsea la respuesta JSON de Gemini
        """
        try:
            # Limpiar la respuesta (remover markdown si existe)
            respuesta_limpia = respuesta.strip()
            if respuesta_limpia.startswith('```json'):
                respuesta_limpia = respuesta_limpia.split('```json')[1]
                respuesta_limpia = respuesta_limpia.split('```')[0]
            elif respuesta_limpia.startswith('```'):
                respuesta_limpia = respuesta_limpia.split('```')[1]
                respuesta_limpia = respuesta_limpia.split('```')[0]

            # Parsear JSON
            ejercicios = json.loads(respuesta_limpia)

            return ejercicios

        except json.JSONDecodeError as e:
            raise Exception(f"Error al parsear respuesta de Gemini: {str(e)}\nRespuesta: {respuesta}")

    def _validar_ejercicios(self, ejercicios: List[Dict], cantidad: int) -> List[Dict]:
        """Valida que los ejercicios tengan el formato correcto"""
        ejercicios_validos = []

        for ej in ejercicios:
            if all(key in ej for key in ['enunciado', 'opciones', 'respuesta_correcta']):
                ejercicios_validos.append(ej)

        if len(ejercicios_validos) < cantidad:
            raise Exception(f"Solo se generaron {len(ejercicios_validos)} ejercicios válidos de {cantidad} solicitados")

        return ejercicios_validos[:cantidad]

# Singleton
generador_matematicas = GeneradorMatematicas()
```

---

### 3. Generador de Verbal (`services/generador_verbal.py`)

```python
class GeneradorVerbal:
    """
    Genera ejercicios de razonamiento verbal
    personalizados según el perfil del estudiante
    """

    def __init__(self):
        self.perfil_adapter = PerfilAdapter()

    def generar_ejercicios(
        self,
        estudiante_id: str,
        cantidad: int = 5,
        tema: str = "general"
    ) -> List[Dict]:
        """
        Genera ejercicios de razonamiento verbal

        Args:
            estudiante_id: ID del estudiante
            cantidad: Número de ejercicios
            tema: "sinonimos", "antonimos", "analogias", "comprension", "general"

        Returns:
            Lista de ejercicios JSON
        """
        # Similar estructura a GeneradorMatematicas
        perfil = self.perfil_adapter.obtener_perfil(estudiante_id)
        params = self._determinar_parametros(perfil, tema)
        prompt = self._construir_prompt(params, cantidad)

        respuesta = gemini_client.generar_ejercicio(prompt, temperatura=0.7)

        ejercicios = self._parsear_respuesta(respuesta)
        return self._validar_ejercicios(ejercicios, cantidad)

    def _determinar_parametros(self, perfil: Dict, tema: str) -> Dict:
        """Determina parámetros basados en perfil"""
        nivel_lectura = perfil.get('nivel_lectura', 'desarrollado')

        if nivel_lectura == 'experto':
            dificultad = 'difícil'
            tipos = ['analogías', 'inferencias', 'comprensión profunda']
        elif nivel_lectura == 'inicial':
            dificultad = 'fácil'
            tipos = ['sinónimos básicos', 'antónimos', 'completar oraciones']
        else:
            dificultad = 'moderado'
            tipos = ['sinónimos', 'antónimos', 'analogías simples']

        return {
            'dificultad': dificultad,
            'tipos_ejercicio': tipos,
            'nivel_lectura': nivel_lectura,
            'grado': perfil.get('grado', '3-4'),
            'tema': tema
        }

# Singleton
generador_verbal = GeneradorVerbal()
```

---

### 4. Perfil Adapter (`services/perfil_adapter.py`)

```python
import json
from pathlib import Path
from typing import Dict, Optional

class PerfilAdapter:
    """
    Adaptador para leer perfiles desde backend/data/perfiles.json
    """

    def __init__(self):
        # Path relativo desde generador-ejercicios/ a backend/data/
        self.perfiles_path = Path(__file__).parent.parent.parent / "backend" / "data" / "perfiles.json"

    def obtener_perfil(self, estudiante_id: str) -> Optional[Dict]:
        """
        Obtiene el perfil más reciente de un estudiante

        Args:
            estudiante_id: ID del estudiante

        Returns:
            Dict con el perfil o None si no existe
        """
        try:
            if not self.perfiles_path.exists():
                return None

            with open(self.perfiles_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Buscar perfil más reciente del estudiante
            perfiles = data.get('perfiles', [])
            perfiles_estudiante = [
                p for p in reversed(perfiles)
                if p.get('estudiante_id') == estudiante_id
            ]

            return perfiles_estudiante[0] if perfiles_estudiante else None

        except Exception as e:
            print(f"Error al leer perfil: {e}")
            return None

    def obtener_perfil_default(self) -> Dict:
        """Retorna perfil por defecto si el estudiante no tiene uno"""
        return {
            'estudiante_id': 'DEFAULT',
            'grado': '3-4',
            'estilo_aprendizaje': 'visual',
            'nivel_matematicas': 'intermedio',
            'nivel_lectura': 'desarrollado',
            'atencion': 'media',
            'frustracion': 'intermedio',
            'nivel_riesgo': 'medio'
        }

# Singleton
perfil_adapter = PerfilAdapter()
```

---

## 📝 Prompts de Gemini {#prompts}

### Template: Matemáticas Básico

**Archivo:** `generador-ejercicios/prompts/matematicas/basico.txt`

```
Eres un profesor de matemáticas especializado en primaria (grados {grado}) en Perú.

Tu tarea es generar {cantidad} ejercicios de razonamiento matemático BÁSICO que sean:
- Apropiados para estudiantes de {grado} grado
- Con dificultad {dificultad}
- Usando solo estas operaciones: {operaciones}
- Contextualizados en situaciones de la vida real peruana
- Con enunciados de máximo {max_palabras} palabras

CARACTERÍSTICAS:
- Números pequeños (1-20 para suma/resta)
- Un solo paso de razonamiento
- Lenguaje muy simple y claro
- Contextos familiares (mercado, escuela, casa)

Formato JSON ESTRICTO:
```json
[
  {{
    "id": "MAT_BAS_001",
    "titulo": "Título corto",
    "enunciado": "Problema contextualizado en máximo {max_palabras} palabras",
    "opciones": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "respuesta_correcta": "A",
    "explicacion": "Paso a paso cómo llegar a la respuesta",
    "nivel": "basico",
    "tema": "{tema}",
    "operacion_principal": "suma|resta",
    "contexto": "mercado|escuela|casa|juegos"
  }}
]
```

Ejemplo de ejercicio BÁSICO:
{{
  "id": "MAT_BAS_001",
  "titulo": "Frutas en el mercado",
  "enunciado": "María compró 5 manzanas en el mercado. Su mamá le dio 3 manzanas más. ¿Cuántas manzanas tiene María ahora?",
  "opciones": [
    "A) 8 manzanas",
    "B) 7 manzanas",
    "C) 9 manzanas",
    "D) 6 manzanas"
  ],
  "respuesta_correcta": "A",
  "explicacion": "María tenía 5 manzanas. Le dieron 3 más. Sumamos: 5 + 3 = 8 manzanas en total.",
  "nivel": "basico",
  "tema": "suma",
  "operacion_principal": "suma",
  "contexto": "mercado"
}}

GENERA {cantidad} EJERCICIOS SIMILARES. Responde SOLO con el JSON.
```

### Template: Matemáticas Intermedio

**Archivo:** `generador-ejercicios/prompts/matematicas/intermedio.txt`

```
Eres un profesor de matemáticas de primaria (grados {grado}) en Perú.

Genera {cantidad} ejercicios de razonamiento matemático INTERMEDIO:
- Grado: {grado}
- Dificultad: {dificultad}
- Operaciones: {operaciones}
- Máximo {max_palabras} palabras por enunciado

CARACTERÍSTICAS NIVEL INTERMEDIO:
- Números hasta 100
- Dos pasos de razonamiento
- Puede incluir multiplicación simple
- Contextos variados

FORMATO JSON:
[mismo formato que básico, pero nivel: "intermedio"]

IMPORTANTE: Los problemas deben requerir 2 pasos para resolverse.
```

### Template: Verbal Básico

**Archivo:** `generador-ejercicios/prompts/verbal/basico.txt`

```
Eres un profesor de comunicación de primaria ({grado} grado) en Perú.

Genera {cantidad} ejercicios de razonamiento verbal BÁSICO:
- Tipo: {tema} (sinónimos, antónimos, completar oraciones)
- Nivel de lectura: {nivel_lectura}
- Vocabulario apropiado para {grado} grado

FORMATO JSON:
```json
[
  {{
    "id": "VRB_BAS_001",
    "tipo": "sinonimo",
    "pregunta": "¿Qué palabra significa lo mismo que CONTENTO?",
    "opciones": ["A) Triste", "B) Feliz", "C) Enojado", "D) Cansado"],
    "respuesta_correcta": "B",
    "explicacion": "Contento y feliz significan lo mismo: sentirse bien y alegre",
    "nivel": "basico",
    "palabra_clave": "contento"
  }}
]
```

GENERA {cantidad} EJERCICIOS. Solo JSON en la respuesta.
```

---

## 🔗 Integración con Perfiles {#integracion-perfiles}

### Mapeo: Perfil → Parámetros de Generación

```python
# Tabla de decisiones

NIVEL_MATEMATICAS_MAP = {
    'avanzado': {
        'dificultad': 'difícil',
        'operaciones': ['suma', 'resta', 'mult', 'div', 'fracciones'],
        'pasos_razonamiento': 3,
        'rango_numeros': (1, 1000)
    },
    'intermedio': {
        'dificultad': 'moderado',
        'operaciones': ['suma', 'resta', 'mult'],
        'pasos_razonamiento': 2,
        'rango_numeros': (1, 100)
    },
    'basico': {
        'dificultad': 'fácil',
        'operaciones': ['suma', 'resta'],
        'pasos_razonamiento': 1,
        'rango_numeros': (1, 20)
    }
}

ESTILO_APRENDIZAJE_MAP = {
    'visual': {
        'incluir_diagramas': True,
        'descripcion_visual': True,
        'usar_emojis': True
    },
    'auditivo': {
        'incluir_narrativa': True,
        'diálogos': True
    },
    'kinestesico': {
        'incluir_actividad': True,
        'manipulables': True
    }
}

ATENCION_MAP = {
    'alta': {
        'max_palabras_enunciado': 80,
        'ejercicios_por_sesion': 10
    },
    'media': {
        'max_palabras_enunciado': 50,
        'ejercicios_por_sesion': 7
    },
    'baja': {
        'max_palabras_enunciado': 30,
        'ejercicios_por_sesion': 5
    }
}
```

---

## 🗺 Roadmap de Implementación {#roadmap}

### Fase 1: Setup y Base (3-4 días)

**Día 1:**
- [x] Crear estructura de directorios `generador-ejercicios/`
- [x] Copiar y adaptar `gemini_client.py` desde `/chatbot/main.py`
- [x] Configurar requirements.txt
- [x] Crear .env.example con GEMINI_API_KEY

**Día 2:**
- [x] Implementar `PerfilAdapter` para leer perfiles del JSON
- [x] Crear modelos Pydantic para ejercicios
- [x] Setup básico de FastAPI en `main.py`

**Día 3:**
- [x] Implementar `GeneradorMatematicas` versión básica
- [x] Crear 3 prompts (básico, intermedio, avanzado)
- [x] Testing manual con Gemini

**Día 4:**
- [x] Implementar `GeneradorVerbal` versión básica
- [x] Crear prompts para verbal
- [x] Testing de integración

### Fase 2: API Endpoints (2-3 días)

**Día 5:**
- [x] Crear endpoint `POST /api/generar-ejercicios`
- [x] Validación de requests
- [x] Error handling

**Día 6:**
- [x] Endpoint `POST /api/generar-ejercicios/matematicas`
- [x] Endpoint `POST /api/generar-ejercicios/verbal`
- [x] Documentación con Swagger

**Día 7:**
- [x] Testing de endpoints
- [x] Script de pruebas automáticas

### Fase 3: Frontend (3-4 días)

**Día 8-9:**
- [x] Crear `frontend/ejercicios-app/`
- [x] Componentes de UI para mostrar ejercicios
- [x] Integración con API de ejercicios

**Día 10-11:**
- [x] Página de selección de curso
- [x] Página de resolución de ejercicios
- [x] Sistema de feedback

### Fase 4: Refinamiento (2-3 días)

**Día 12:**
- [x] Ajustar prompts según resultados reales
- [x] Mejorar parseo de respuestas de Gemini

**Día 13:**
- [x] Testing con estudiantes reales
- [x] Ajustes finales

**Total estimado: 13-14 días de desarrollo**

---

## 💡 Ejemplos de Uso {#ejemplos}

### Ejemplo 1: Estudiante con Nivel Básico en Matemáticas

**Perfil del estudiante:**
```json
{
  "estudiante_id": "EST002",
  "grado": "1-2",
  "nivel_matematicas": "basico",
  "estilo_aprendizaje": "visual",
  "atencion": "baja"
}
```

**Request:**
```json
POST /api/generar-ejercicios
{
  "estudiante_id": "EST002",
  "curso": "matematicas",
  "cantidad": 3
}
```

**Ejercicios generados:**
```json
[
  {
    "id": "MAT_BAS_001",
    "titulo": "Juguetes en la caja",
    "enunciado": "Pedro tiene 4 carritos. Su amigo le regala 3 carritos más. ¿Cuántos carritos tiene ahora?",
    "opciones": [
      "A) 7 carritos",
      "B) 6 carritos",
      "C) 8 carritos",
      "D) 5 carritos"
    ],
    "respuesta_correcta": "A",
    "explicacion": "Pedro tenía 4 + le dieron 3 = 7 carritos",
    "nivel": "basico"
  },
  // ... 2 ejercicios más
]
```

### Ejemplo 2: Estudiante Avanzado en Verbal

**Perfil:**
```json
{
  "estudiante_id": "EST003",
  "grado": "5-6",
  "nivel_lectura": "experto",
  "estilo_aprendizaje": "auditivo",
  "atencion": "alta"
}
```

**Request:**
```json
POST /api/generar-ejercicios
{
  "estudiante_id": "EST003",
  "curso": "verbal",
  "tipo": "analogias",
  "cantidad": 5
}
```

**Ejercicio generado:**
```json
{
  "id": "VRB_AVZ_001",
  "tipo": "analogia",
  "pregunta": "LIBRO es a LECTURA como PINCEL es a:",
  "opciones": [
    "A) Cuadro",
    "B) Pintura",
    "C) Arte",
    "D) Color"
  ],
  "respuesta_correcta": "B",
  "explicacion": "El libro se usa para la lectura, así como el pincel se usa para la pintura",
  "nivel": "avanzado"
}
```

---

## 📊 Métricas y Monitoreo

### KPIs a Rastrear

- **Tiempo de generación:** <3 segundos por ejercicio
- **Tasa de éxito de parseo:** >95%
- **Satisfacción del estudiante:** Encuesta post-ejercicios
- **Dificultad percibida:** ¿Muy fácil/Adecuado/Muy difícil?

### Logs Importantes

```python
# En cada generación, loggear:
{
  "timestamp": "2025-11-17T14:30:00",
  "estudiante_id": "EST001",
  "curso": "matematicas",
  "perfil": {
    "nivel": "intermedio",
    "estilo": "visual"
  },
  "ejercicios_generados": 5,
  "tiempo_generacion_ms": 2850,
  "gemini_tokens_usados": 1200
}
```

---

## 🎯 Conclusión

Este sistema de generación de ejercicios con Gemini AI:

✅ **Se integra perfectamente** con el sistema de perfiles existente
✅ **Personaliza automáticamente** según características del estudiante
✅ **Es escalable** - puede agregar más cursos fácilmente
✅ **Usa tecnología probada** - Gemini API ya funciona en `/chatbot`
✅ **MVP alcanzable** - 13-14 días de desarrollo

**Próximo paso inmediato:** Iniciar Fase 1 - Setup y Base

---

**Archivo:** `docs/20251117/04-generacion-ejercicios-gemini.md`
**Última actualización:** 2025-11-17
**Estado:** Documentación completa - Listo para implementar
