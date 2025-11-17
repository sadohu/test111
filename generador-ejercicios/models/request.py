"""
Modelos Pydantic para Requests y Responses de la API
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from .ejercicio import (
    CursoEnum,
    NivelDificultad,
    TipoEjercicioMatematicas,
    TipoEjercicioVerbal,
    EjercicioMatematicas,
    EjercicioVerbal
)


# ============================================================================
# REQUEST MODELS
# ============================================================================

class GenerarEjerciciosRequest(BaseModel):
    """
    Request para generar ejercicios personalizados
    """
    estudiante_id: str = Field(..., min_length=1, description="ID del estudiante")
    curso: CursoEnum = Field(..., description="Curso para generar ejercicios")
    cantidad: int = Field(5, ge=1, le=20, description="Cantidad de ejercicios a generar")
    tipo_especifico: Optional[str] = Field(None, description="Tipo específico de ejercicio")
    forzar_nivel: Optional[NivelDificultad] = Field(None, description="Forzar nivel de dificultad (ignora perfil)")

    @validator('tipo_especifico')
    def validar_tipo_especifico(cls, v, values):
        """Valida que el tipo específico sea válido para el curso"""
        if v and 'curso' in values:
            curso = values['curso']
            if curso == CursoEnum.MATEMATICAS:
                tipos_validos = [e.value for e in TipoEjercicioMatematicas]
                if v not in tipos_validos:
                    raise ValueError(f"tipo_especifico debe ser uno de: {', '.join(tipos_validos)}")
            elif curso == CursoEnum.VERBAL:
                tipos_validos = [e.value for e in TipoEjercicioVerbal]
                if v not in tipos_validos:
                    raise ValueError(f"tipo_especifico debe ser uno de: {', '.join(tipos_validos)}")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "estudiante_id": "EST001",
                "curso": "matematicas",
                "cantidad": 5,
                "tipo_especifico": "suma",
                "forzar_nivel": None
            }
        }


class ValidarRespuestaEjercicioRequest(BaseModel):
    """
    Request para validar la respuesta de un estudiante a un ejercicio
    """
    ejercicio_id: str = Field(..., description="ID del ejercicio")
    respuesta_estudiante: str = Field(..., description="Letra de respuesta del estudiante (A, B, C, D...)")
    tiempo_respuesta_segundos: Optional[int] = Field(None, ge=0, description="Tiempo que tomó responder")

    @validator('respuesta_estudiante')
    def validar_formato_respuesta(cls, v):
        """Valida que la respuesta sea una letra válida"""
        if not v or len(v) != 1 or not v.isalpha():
            raise ValueError("respuesta_estudiante debe ser una letra (A, B, C, D...)")
        return v.upper()

    class Config:
        json_schema_extra = {
            "example": {
                "ejercicio_id": "MAT_001",
                "respuesta_estudiante": "A",
                "tiempo_respuesta_segundos": 45
            }
        }


# ============================================================================
# RESPONSE MODELS
# ============================================================================

class GenerarEjerciciosResponse(BaseModel):
    """
    Response con ejercicios generados
    """
    success: bool
    mensaje: str
    estudiante_id: str
    curso: CursoEnum
    cantidad_solicitada: int
    cantidad_generada: int
    ejercicios_matematicas: Optional[List[EjercicioMatematicas]] = None
    ejercicios_verbales: Optional[List[EjercicioVerbal]] = None
    perfil_usado: dict = Field(..., description="Perfil que se usó para personalizar")
    nivel_determinado: NivelDificultad
    tiempo_generacion_segundos: float

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "mensaje": "5 ejercicios generados exitosamente",
                "estudiante_id": "EST001",
                "curso": "matematicas",
                "cantidad_solicitada": 5,
                "cantidad_generada": 5,
                "ejercicios_matematicas": [
                    {
                        "id": "MAT_BAS_001",
                        "titulo": "Suma simple",
                        "enunciado": "Juan tiene 5 manzanas...",
                        "opciones": ["A) 8", "B) 7", "C) 9", "D) 6"],
                        "respuesta_correcta": "A",
                        "explicacion": "5 + 3 = 8",
                        "nivel": "facil",
                        "tipo": "suma",
                        "operacion_principal": "suma",
                        "contexto": "mercado",
                        "incluye_visual": True
                    }
                ],
                "perfil_usado": {
                    "nivel_matematicas": "basico",
                    "estilo_aprendizaje": "visual"
                },
                "nivel_determinado": "facil",
                "tiempo_generacion_segundos": 2.5
            }
        }


class ValidarRespuestaResponse(BaseModel):
    """
    Response de validación de respuesta
    """
    success: bool
    ejercicio_id: str
    es_correcta: bool
    respuesta_estudiante: str
    respuesta_correcta: str
    explicacion: str
    retroalimentacion: str = Field(..., description="Mensaje de feedback para el estudiante")

    class Config:
        json_schema_extra = {
            "example_correcta": {
                "success": True,
                "ejercicio_id": "MAT_001",
                "es_correcta": True,
                "respuesta_estudiante": "A",
                "respuesta_correcta": "A",
                "explicacion": "5 + 3 = 8 manzanas en total",
                "retroalimentacion": "¡Excelente! Tu respuesta es correcta. Sumaste correctamente 5 + 3 = 8."
            },
            "example_incorrecta": {
                "success": True,
                "ejercicio_id": "MAT_001",
                "es_correcta": False,
                "respuesta_estudiante": "B",
                "respuesta_correcta": "A",
                "explicacion": "5 + 3 = 8 manzanas en total",
                "retroalimentacion": "No es correcto. La respuesta correcta es A. Recuerda: cuando sumamos 5 + 3, obtenemos 8."
            }
        }


class ErrorResponse(BaseModel):
    """
    Response de error estándar
    """
    success: bool = False
    error: str = Field(..., description="Mensaje de error")
    detalle: Optional[str] = Field(None, description="Detalles adicionales del error")
    codigo_error: Optional[str] = Field(None, description="Código de error para debugging")

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "error": "No se pudo generar ejercicios",
                "detalle": "El perfil del estudiante no fue encontrado",
                "codigo_error": "PERFIL_NO_ENCONTRADO"
            }
        }


class HealthCheckResponse(BaseModel):
    """
    Response del health check
    """
    status: str
    servicio: str
    version: str
    gemini_disponible: bool
    perfiles_disponibles: int

    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "servicio": "Generador de Ejercicios - Gemini AI",
                "version": "1.0.0",
                "gemini_disponible": True,
                "perfiles_disponibles": 25
            }
        }


# ============================================================================
# MODELS AUXILIARES
# ============================================================================

class EstadoGeneracion(BaseModel):
    """
    Estado de generación de ejercicios (para tracking)
    """
    ejercicio_id: str
    estado: str = Field(..., description="pendiente, generando, completado, error")
    tiempo_inicio: Optional[str] = None
    tiempo_fin: Optional[str] = None
    error: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "ejercicio_id": "MAT_001",
                "estado": "completado",
                "tiempo_inicio": "2025-11-17T22:00:00",
                "tiempo_fin": "2025-11-17T22:00:02",
                "error": None
            }
        }


class ConfiguracionGenerador(BaseModel):
    """
    Configuración del generador de ejercicios
    """
    temperatura_gemini: float = Field(0.7, ge=0.0, le=1.0)
    max_tokens: int = Field(2000, ge=500, le=4000)
    reintentos_max: int = Field(3, ge=1, le=5)
    timeout_segundos: int = Field(30, ge=10, le=120)

    class Config:
        json_schema_extra = {
            "example": {
                "temperatura_gemini": 0.7,
                "max_tokens": 2000,
                "reintentos_max": 3,
                "timeout_segundos": 30
            }
        }
