"""
Modelos Pydantic para el Generador de Ejercicios
"""

from .ejercicio import (
    # Enums
    CursoEnum,
    NivelDificultad,
    TipoEjercicioMatematicas,
    TipoEjercicioVerbal,

    # Modelos de Ejercicios
    EjercicioBase,
    EjercicioMatematicas,
    EjercicioVerbal,

    # Modelos de Respuesta
    ListaEjerciciosResponse,
    ParametrosGeneracion,
    EstadisticasEjercicios,
)

from .request import (
    # Request Models
    GenerarEjerciciosRequest,
    ValidarRespuestaEjercicioRequest,

    # Response Models
    GenerarEjerciciosResponse,
    ValidarRespuestaResponse,
    ErrorResponse,
    HealthCheckResponse,

    # Auxiliares
    EstadoGeneracion,
    ConfiguracionGenerador,
)

__all__ = [
    # Enums
    'CursoEnum',
    'NivelDificultad',
    'TipoEjercicioMatematicas',
    'TipoEjercicioVerbal',

    # Ejercicios
    'EjercicioBase',
    'EjercicioMatematicas',
    'EjercicioVerbal',
    'ListaEjerciciosResponse',
    'ParametrosGeneracion',
    'EstadisticasEjercicios',

    # Requests
    'GenerarEjerciciosRequest',
    'ValidarRespuestaEjercicioRequest',

    # Responses
    'GenerarEjerciciosResponse',
    'ValidarRespuestaResponse',
    'ErrorResponse',
    'HealthCheckResponse',

    # Auxiliares
    'EstadoGeneracion',
    'ConfiguracionGenerador',
]
