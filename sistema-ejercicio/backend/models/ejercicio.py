"""
Modelos Pydantic para Ejercicios
Define la estructura de datos para ejercicios de Matemáticas y Verbal
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict
from enum import Enum


# ============================================================================
# ENUMS
# ============================================================================

class CursoEnum(str, Enum):
    """Cursos disponibles para generar ejercicios"""
    MATEMATICAS = "matematicas"
    VERBAL = "verbal"


class NivelDificultad(str, Enum):
    """Niveles de dificultad de ejercicios"""
    FACIL = "facil"
    MODERADO = "moderado"
    DIFICIL = "dificil"


class TipoEjercicioMatematicas(str, Enum):
    """Tipos de ejercicios de matemáticas"""
    SUMA = "suma"
    RESTA = "resta"
    MULTIPLICACION = "multiplicacion"
    DIVISION = "division"
    FRACCIONES = "fracciones"
    PROBLEMAS = "problemas"
    GENERAL = "general"


class TipoEjercicioVerbal(str, Enum):
    """Tipos de ejercicios verbales"""
    SINONIMOS = "sinonimos"
    ANTONIMOS = "antonimos"
    ANALOGIAS = "analogias"
    COMPRENSION = "comprension"
    COMPLETAR_ORACIONES = "completar_oraciones"
    GENERAL = "general"


# ============================================================================
# MODELOS DE EJERCICIOS
# ============================================================================

class EjercicioBase(BaseModel):
    """
    Modelo base para cualquier ejercicio
    """
    id: str = Field(..., description="ID único del ejercicio")
    titulo: Optional[str] = Field(None, description="Título corto del ejercicio")
    enunciado: str = Field(..., min_length=10, description="Descripción del problema")
    opciones: List[str] = Field(..., min_items=2, max_items=6, description="Opciones de respuesta")
    respuesta_correcta: str = Field(..., description="Letra de la respuesta correcta (A, B, C, D...)")
    explicacion: str = Field(..., description="Explicación de la solución")
    nivel: NivelDificultad = Field(..., description="Nivel de dificultad")

    @validator('respuesta_correcta')
    def validar_respuesta_correcta(cls, v, values):
        """Valida que la respuesta correcta sea una opción válida"""
        if 'opciones' in values:
            opciones = values['opciones']
            letras_validas = [chr(65 + i) for i in range(len(opciones))]  # A, B, C, D...
            if v not in letras_validas:
                raise ValueError(f"respuesta_correcta debe ser una de: {', '.join(letras_validas)}")
        return v

    @validator('opciones')
    def validar_formato_opciones(cls, v):
        """Valida que las opciones tengan el formato correcto"""
        for i, opcion in enumerate(v):
            letra_esperada = chr(65 + i)  # A, B, C, D...
            if not opcion.startswith(f"{letra_esperada})"):
                raise ValueError(f"La opción {i+1} debe empezar con '{letra_esperada})'")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "id": "MAT_001",
                "titulo": "Suma de números",
                "enunciado": "Juan tiene 5 manzanas y su mamá le da 3 más. ¿Cuántas manzanas tiene ahora?",
                "opciones": [
                    "A) 8 manzanas",
                    "B) 7 manzanas",
                    "C) 9 manzanas",
                    "D) 6 manzanas"
                ],
                "respuesta_correcta": "A",
                "explicacion": "Juan tenía 5 manzanas. Le dieron 3 más. 5 + 3 = 8 manzanas.",
                "nivel": "facil"
            }
        }


class EjercicioMatematicas(EjercicioBase):
    """
    Modelo específico para ejercicios de matemáticas
    """
    tipo: TipoEjercicioMatematicas = Field(..., description="Tipo de ejercicio matemático")
    operacion_principal: Optional[str] = Field(None, description="Operación principal (suma, resta, etc.)")
    contexto: Optional[str] = Field(None, description="Contexto del problema (mercado, escuela, etc.)")
    incluye_visual: bool = Field(False, description="Si incluye descripción visual")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "MAT_BAS_001",
                "titulo": "Frutas en el mercado",
                "enunciado": "María compró 5 manzanas. Su mamá le dio 3 más. ¿Cuántas tiene?",
                "opciones": [
                    "A) 8 manzanas",
                    "B) 7 manzanas",
                    "C) 9 manzanas",
                    "D) 6 manzanas"
                ],
                "respuesta_correcta": "A",
                "explicacion": "5 + 3 = 8 manzanas en total",
                "nivel": "facil",
                "tipo": "suma",
                "operacion_principal": "suma",
                "contexto": "mercado",
                "incluye_visual": True
            }
        }


class EjercicioVerbal(EjercicioBase):
    """
    Modelo específico para ejercicios de razonamiento verbal
    """
    tipo: TipoEjercicioVerbal = Field(..., description="Tipo de ejercicio verbal")
    palabra_clave: Optional[str] = Field(None, description="Palabra clave del ejercicio")
    categoria_semantica: Optional[str] = Field(None, description="Categoría semántica")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "VRB_BAS_001",
                "titulo": "Sinónimos",
                "enunciado": "¿Qué palabra significa lo mismo que CONTENTO?",
                "opciones": [
                    "A) Triste",
                    "B) Feliz",
                    "C) Enojado",
                    "D) Cansado"
                ],
                "respuesta_correcta": "B",
                "explicacion": "Contento y feliz significan lo mismo: sentirse bien y alegre",
                "nivel": "facil",
                "tipo": "sinonimos",
                "palabra_clave": "contento",
                "categoria_semantica": "emociones"
            }
        }


# ============================================================================
# MODELOS DE RESPUESTA
# ============================================================================

class ListaEjerciciosResponse(BaseModel):
    """
    Respuesta con lista de ejercicios generados
    """
    curso: CursoEnum
    cantidad: int
    nivel: NivelDificultad
    ejercicios_matematicas: Optional[List[EjercicioMatematicas]] = None
    ejercicios_verbales: Optional[List[EjercicioVerbal]] = None
    estudiante_id: str
    perfil_usado: Dict
    generado_en: str = Field(..., description="Timestamp de generación")

    @validator('cantidad')
    def validar_cantidad_ejercicios(cls, v, values):
        """Valida que la cantidad coincida con los ejercicios generados"""
        if 'ejercicios_matematicas' in values and values['ejercicios_matematicas']:
            if len(values['ejercicios_matematicas']) != v:
                raise ValueError(f"Se esperaban {v} ejercicios, se generaron {len(values['ejercicios_matematicas'])}")
        if 'ejercicios_verbales' in values and values['ejercicios_verbales']:
            if len(values['ejercicios_verbales']) != v:
                raise ValueError(f"Se esperaban {v} ejercicios, se generaron {len(values['ejercicios_verbales'])}")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "curso": "matematicas",
                "cantidad": 3,
                "nivel": "facil",
                "ejercicios_matematicas": [
                    {
                        "id": "MAT_001",
                        "enunciado": "...",
                        "opciones": ["A) ...", "B) ..."],
                        "respuesta_correcta": "A",
                        "explicacion": "...",
                        "nivel": "facil",
                        "tipo": "suma"
                    }
                ],
                "estudiante_id": "EST001",
                "perfil_usado": {"nivel_matematicas": "basico"},
                "generado_en": "2025-11-17T22:00:00"
            }
        }


# ============================================================================
# MODELOS AUXILIARES
# ============================================================================

class ParametrosGeneracion(BaseModel):
    """
    Parámetros determinados a partir del perfil del estudiante
    """
    dificultad: NivelDificultad
    operaciones_permitidas: List[str] = Field(default_factory=list)
    max_palabras_enunciado: int = Field(50, ge=20, le=100)
    incluir_visual: bool = False
    incluir_narrativa: bool = False
    contextos_preferidos: List[str] = Field(default_factory=list)
    vocabulario_nivel: str = "basico"

    class Config:
        json_schema_extra = {
            "example": {
                "dificultad": "facil",
                "operaciones_permitidas": ["suma", "resta"],
                "max_palabras_enunciado": 30,
                "incluir_visual": True,
                "incluir_narrativa": False,
                "contextos_preferidos": ["mercado", "escuela", "casa"],
                "vocabulario_nivel": "basico"
            }
        }


class EstadisticasEjercicios(BaseModel):
    """
    Estadísticas de ejercicios generados
    """
    total_generados: int
    por_curso: Dict[str, int]
    por_nivel: Dict[str, int]
    estudiantes_unicos: int
    tiempo_promedio_generacion: float = Field(..., description="En segundos")

    class Config:
        json_schema_extra = {
            "example": {
                "total_generados": 150,
                "por_curso": {
                    "matematicas": 90,
                    "verbal": 60
                },
                "por_nivel": {
                    "facil": 50,
                    "moderado": 70,
                    "dificil": 30
                },
                "estudiantes_unicos": 25,
                "tiempo_promedio_generacion": 2.5
            }
        }
