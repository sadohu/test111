"""
Modelos Pydantic para tracking de respuestas de estudiantes
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

from .ejercicio import CursoEnum, NivelDificultad


# ============================================================================
# ENUMS
# ============================================================================

class EstadoSesion(str, Enum):
    """Estado de una sesión de ejercicios"""
    INICIADA = "iniciada"
    EN_PROGRESO = "en_progreso"
    COMPLETADA = "completada"
    ABANDONADA = "abandonada"


# ============================================================================
# MODELOS DE RESPUESTA
# ============================================================================

class RespuestaEstudiante(BaseModel):
    """Respuesta de un estudiante a un ejercicio"""
    ejercicio_id: str = Field(..., description="ID del ejercicio respondido")
    opcion_seleccionada: str = Field(..., description="Opción elegida (A, B, C, D)")
    es_correcta: bool = Field(..., description="Si la respuesta es correcta")
    tiempo_respuesta_segundos: int = Field(..., ge=0, description="Tiempo en segundos")
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())

    class Config:
        json_schema_extra = {
            "example": {
                "ejercicio_id": "MAT_INT_001",
                "opcion_seleccionada": "A",
                "es_correcta": True,
                "tiempo_respuesta_segundos": 45,
                "timestamp": "2025-11-17T22:30:00"
            }
        }


class SesionEjercicios(BaseModel):
    """Sesión completa de ejercicios de un estudiante"""
    sesion_id: str = Field(..., description="ID único de la sesión")
    estudiante_id: str = Field(..., description="ID del estudiante")
    curso: CursoEnum = Field(..., description="Curso de la sesión")
    nivel_determinado: str = Field(..., description="Nivel usado (basico/intermedio/avanzado)")

    # Ejercicios
    cantidad_ejercicios: int = Field(..., ge=1, le=20)
    ejercicios_ids: List[str] = Field(..., description="IDs de los ejercicios generados")

    # Respuestas
    respuestas: List[RespuestaEstudiante] = Field(default_factory=list)

    # Timestamps
    fecha_inicio: str = Field(default_factory=lambda: datetime.now().isoformat())
    fecha_fin: Optional[str] = None

    # Estado
    estado: EstadoSesion = Field(default=EstadoSesion.INICIADA)

    # Metadata
    perfil_usado: Dict = Field(default_factory=dict, description="Resumen del perfil usado")

    class Config:
        json_schema_extra = {
            "example": {
                "sesion_id": "SES_20251117_EST001_001",
                "estudiante_id": "EST001",
                "curso": "matematicas",
                "nivel_determinado": "intermedio",
                "cantidad_ejercicios": 5,
                "ejercicios_ids": ["MAT_INT_001", "MAT_INT_002"],
                "respuestas": [],
                "fecha_inicio": "2025-11-17T22:00:00",
                "fecha_fin": None,
                "estado": "iniciada",
                "perfil_usado": {}
            }
        }


class EstadisticasSesion(BaseModel):
    """Estadísticas calculadas de una sesión"""
    sesion_id: str
    estudiante_id: str
    curso: CursoEnum

    total_ejercicios: int = Field(..., ge=0)
    ejercicios_completados: int = Field(..., ge=0)
    ejercicios_correctos: int = Field(..., ge=0)
    ejercicios_incorrectos: int = Field(..., ge=0)

    tasa_aciertos: float = Field(..., ge=0.0, le=1.0, description="0.0 a 1.0")
    tasa_completacion: float = Field(..., ge=0.0, le=1.0)

    tiempo_total_segundos: int = Field(..., ge=0)
    tiempo_promedio_segundos: float = Field(..., ge=0)
    tiempo_min_segundos: Optional[int] = None
    tiempo_max_segundos: Optional[int] = None

    fecha_inicio: str
    fecha_fin: Optional[str]

    class Config:
        json_schema_extra = {
            "example": {
                "sesion_id": "SES_20251117_EST001_001",
                "estudiante_id": "EST001",
                "curso": "matematicas",
                "total_ejercicios": 5,
                "ejercicios_completados": 5,
                "ejercicios_correctos": 4,
                "ejercicios_incorrectos": 1,
                "tasa_aciertos": 0.8,
                "tasa_completacion": 1.0,
                "tiempo_total_segundos": 300,
                "tiempo_promedio_segundos": 60.0,
                "tiempo_min_segundos": 30,
                "tiempo_max_segundos": 90,
                "fecha_inicio": "2025-11-17T22:00:00",
                "fecha_fin": "2025-11-17T22:05:00"
            }
        }


class EstadisticasEstudiante(BaseModel):
    """Estadísticas agregadas de un estudiante"""
    estudiante_id: str

    # Totales
    total_sesiones: int = Field(..., ge=0)
    total_ejercicios_completados: int = Field(..., ge=0)
    total_ejercicios_correctos: int = Field(..., ge=0)

    # Promedios
    tasa_aciertos_promedio: float = Field(..., ge=0.0, le=1.0)
    tiempo_promedio_por_ejercicio: float = Field(..., ge=0)

    # Por curso
    sesiones_matematicas: int = Field(default=0, ge=0)
    sesiones_verbal: int = Field(default=0, ge=0)

    tasa_aciertos_matematicas: Optional[float] = Field(None, ge=0.0, le=1.0)
    tasa_aciertos_verbal: Optional[float] = Field(None, ge=0.0, le=1.0)

    # Última actividad
    ultima_sesion_fecha: Optional[str] = None
    ultima_sesion_id: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "estudiante_id": "EST001",
                "total_sesiones": 10,
                "total_ejercicios_completados": 50,
                "total_ejercicios_correctos": 40,
                "tasa_aciertos_promedio": 0.8,
                "tiempo_promedio_por_ejercicio": 65.5,
                "sesiones_matematicas": 6,
                "sesiones_verbal": 4,
                "tasa_aciertos_matematicas": 0.85,
                "tasa_aciertos_verbal": 0.75,
                "ultima_sesion_fecha": "2025-11-17T22:00:00",
                "ultima_sesion_id": "SES_20251117_EST001_001"
            }
        }


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class CrearSesionRequest(BaseModel):
    """Request para crear una nueva sesión"""
    estudiante_id: str = Field(..., min_length=1)
    curso: CursoEnum
    ejercicios_ids: List[str] = Field(..., min_items=1, max_items=20)
    nivel_determinado: str
    perfil_usado: Dict = Field(default_factory=dict)

    class Config:
        json_schema_extra = {
            "example": {
                "estudiante_id": "EST001",
                "curso": "matematicas",
                "ejercicios_ids": ["MAT_INT_001", "MAT_INT_002", "MAT_INT_003"],
                "nivel_determinado": "intermedio",
                "perfil_usado": {
                    "grado": "3-4",
                    "nivel_matematicas": "intermedio"
                }
            }
        }


class CrearSesionResponse(BaseModel):
    """Response al crear una sesión"""
    success: bool
    mensaje: str
    sesion_id: str
    sesion: SesionEjercicios


class RegistrarRespuestaRequest(BaseModel):
    """Request para registrar una respuesta"""
    ejercicio_id: str
    opcion_seleccionada: str = Field(..., pattern="^[A-Z]$")
    es_correcta: bool
    tiempo_respuesta_segundos: int = Field(..., ge=0)

    class Config:
        json_schema_extra = {
            "example": {
                "ejercicio_id": "MAT_INT_001",
                "opcion_seleccionada": "A",
                "es_correcta": True,
                "tiempo_respuesta_segundos": 45
            }
        }


class RegistrarRespuestaResponse(BaseModel):
    """Response al registrar una respuesta"""
    success: bool
    mensaje: str
    respuesta: RespuestaEstudiante
    progreso: Dict = Field(default_factory=dict, description="Progreso de la sesión")


class CompletarSesionRequest(BaseModel):
    """Request para marcar sesión como completada"""
    fecha_fin: Optional[str] = Field(default_factory=lambda: datetime.now().isoformat())


class CompletarSesionResponse(BaseModel):
    """Response al completar sesión"""
    success: bool
    mensaje: str
    sesion_id: str
    estadisticas: EstadisticasSesion


class ObtenerSesionResponse(BaseModel):
    """Response al obtener una sesión"""
    success: bool
    sesion: SesionEjercicios
    estadisticas: EstadisticasSesion


class ListarSesionesResponse(BaseModel):
    """Response al listar sesiones de un estudiante"""
    success: bool
    estudiante_id: str
    total_sesiones: int
    sesiones: List[SesionEjercicios]


class ObtenerEstadisticasEstudianteResponse(BaseModel):
    """Response con estadísticas de un estudiante"""
    success: bool
    estudiante_id: str
    estadisticas: EstadisticasEstudiante
    sesiones_recientes: List[SesionEjercicios] = Field(default_factory=list)
