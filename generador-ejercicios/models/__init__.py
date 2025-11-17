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

from .respuesta import (
    # Enums
    EstadoSesion,

    # Modelos de datos
    RespuestaEstudiante,
    SesionEjercicios,
    EstadisticasSesion,
    EstadisticasEstudiante,

    # Request/Response
    CrearSesionRequest,
    CrearSesionResponse,
    RegistrarRespuestaRequest,
    RegistrarRespuestaResponse,
    CompletarSesionRequest,
    CompletarSesionResponse,
    ObtenerSesionResponse,
    ListarSesionesResponse,
    ObtenerEstadisticasEstudianteResponse,
)

__all__ = [
    # Enums
    'CursoEnum',
    'NivelDificultad',
    'TipoEjercicioMatematicas',
    'TipoEjercicioVerbal',
    'EstadoSesion',

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

    # Respuestas y Sesiones
    'RespuestaEstudiante',
    'SesionEjercicios',
    'EstadisticasSesion',
    'EstadisticasEstudiante',
    'CrearSesionRequest',
    'CrearSesionResponse',
    'RegistrarRespuestaRequest',
    'RegistrarRespuestaResponse',
    'CompletarSesionRequest',
    'CompletarSesionResponse',
    'ObtenerSesionResponse',
    'ListarSesionesResponse',
    'ObtenerEstadisticasEstudianteResponse',
]
