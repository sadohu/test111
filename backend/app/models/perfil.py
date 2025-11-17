"""
Modelos Pydantic para el Sistema de Clasificación de Perfiles
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List
from datetime import datetime
from enum import Enum


# ============================================================================
# ENUMS
# ============================================================================

class Grado(str, Enum):
    """Grados escolares soportados"""
    PRIMERO_SEGUNDO = "1-2"
    TERCERO_CUARTO = "3-4"
    QUINTO_SEXTO = "5-6"


class EstiloAprendizaje(str, Enum):
    """Estilos de aprendizaje"""
    VISUAL = "visual"
    AUDITIVO = "auditivo"
    KINESTESICO = "kinestesico"
    MULTIMODAL = "multimodal"


class NivelRiesgo(str, Enum):
    """Niveles de riesgo académico"""
    BAJO = "bajo"
    MEDIO = "medio"
    ALTO = "alto"


# ============================================================================
# REQUEST MODELS
# ============================================================================

class ClasificarPerfilRequest(BaseModel):
    """
    Request para clasificar un perfil de estudiante
    """
    respuestas: Dict[str, str] = Field(
        ...,
        description="Respuestas del formulario. Formato: {'P1': 'A', 'P2': 'B', ...}",
        example={"P1": "A", "P2": "C", "P3": "B", "P4": "C", "P5": "B",
                 "P6": "B", "P7": "A", "P8": "A", "P9": "B", "P10": "A"}
    )
    grado: Grado = Field(
        ...,
        description="Grado del estudiante"
    )
    estudiante_id: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="ID único del estudiante",
        example="EST001"
    )

    @validator('respuestas')
    def validar_respuestas(cls, v):
        """Valida que tengamos las 10 respuestas"""
        preguntas_esperadas = {f'P{i}' for i in range(1, 11)}
        preguntas_recibidas = set(v.keys())

        if not preguntas_esperadas.issubset(preguntas_recibidas):
            faltantes = preguntas_esperadas - preguntas_recibidas
            raise ValueError(f"Faltan respuestas para: {faltantes}")

        return v


class ValidarRespuestaRequest(BaseModel):
    """
    Request para validar una respuesta individual
    """
    pregunta: str = Field(..., pattern="^P([1-9]|10)$", example="P1")
    respuesta: str = Field(..., pattern="^[A-F]$", example="A")
    grado: Grado


class GuardarPerfilRequest(BaseModel):
    """
    Request para guardar un perfil en la base de datos
    """
    perfil: 'PerfilEstudianteResponse'
    notas: Optional[str] = Field(None, max_length=1000)


# ============================================================================
# RESPONSE MODELS
# ============================================================================

class PerfilEstudianteResponse(BaseModel):
    """
    Response con el perfil completo del estudiante
    """
    # Identificación
    estudiante_id: str
    grado: str
    fecha_creacion: str
    ultima_actualizacion: str

    # Características del perfil
    estilo_aprendizaje: str
    velocidad: str
    atencion: str
    interes: str
    nivel_matematicas: str
    nivel_lectura: str
    motivacion: str
    frustracion: str
    trabajo: str
    energia: str

    # Resultados calculados
    nivel_riesgo: str
    recomendaciones: List[str]
    categoria_principal: str
    confianza_perfil: int = Field(..., ge=0, le=100)

    class Config:
        json_schema_extra = {
            "example": {
                "estudiante_id": "EST001",
                "grado": "3-4",
                "fecha_creacion": "2025-11-16T20:30:00",
                "ultima_actualizacion": "2025-11-16T20:30:00",
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
                    "📊 Usar organizadores visuales, mapas mentales...",
                    "⏰ Organizar bloques de 20-25 minutos..."
                ],
                "confianza_perfil": 60
            }
        }


class ValidarRespuestaResponse(BaseModel):
    """
    Response de validación de respuesta
    """
    valida: bool
    mensaje: Optional[str] = None


class APIResponse(BaseModel):
    """
    Response genérico de la API
    """
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
    message: Optional[str] = None


class HealthCheckResponse(BaseModel):
    """
    Response del health check
    """
    status: str
    app_name: str
    version: str
    timestamp: datetime


# ============================================================================
# DATABASE MODELS (para Supabase)
# ============================================================================

class PerfilDB(BaseModel):
    """
    Modelo para almacenar en Supabase
    """
    id: Optional[int] = None
    estudiante_id: str
    grado: str
    perfil_data: dict  # JSON con todos los datos del perfil
    nivel_riesgo: str
    categoria_principal: str
    fecha_creacion: Optional[datetime] = None
    fecha_actualizacion: Optional[datetime] = None
    activo: bool = True

    class Config:
        from_attributes = True


class EstudianteDB(BaseModel):
    """
    Modelo de estudiante en la base de datos
    """
    id: Optional[int] = None
    estudiante_id: str = Field(..., unique=True)
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    grado: str
    seccion: Optional[str] = None
    edad: Optional[int] = None
    fecha_registro: Optional[datetime] = None
    activo: bool = True

    class Config:
        from_attributes = True


# Actualizar referencias forward
GuardarPerfilRequest.model_rebuild()
