"""
Generador de Ejercicios - API REST con FastAPI
Genera ejercicios personalizados de matemáticas y razonamiento verbal usando Gemini AI
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from models import (
    GenerarEjerciciosRequest,
    GenerarEjerciciosResponse,
    ValidarRespuestaEjercicioRequest,
    ValidarRespuestaResponse,
    ErrorResponse,
    HealthCheckResponse,
    CursoEnum,
    # Tracking de respuestas
    CrearSesionRequest,
    CrearSesionResponse,
    RegistrarRespuestaRequest,
    RegistrarRespuestaResponse,
    CompletarSesionRequest,
    CompletarSesionResponse,
    ObtenerSesionResponse,
    ListarSesionesResponse,
    ObtenerEstadisticasEstudianteResponse,
    # Adaptación de nivel
    RecomendacionNivel,
)
from services import (
    generador_matematicas,
    generador_verbal,
    perfil_adapter,
    gemini_client,
    respuestas_storage,
    adaptador_nivel
)

# Cargar variables de entorno
load_dotenv()

# Metadatos de la API
API_VERSION = "1.0.0"
API_TITLE = "Generador de Ejercicios - Gemini AI"
API_DESCRIPTION = """
API para generar ejercicios educativos personalizados usando Google Gemini AI.

## Características

* **Ejercicios de Matemáticas**: Suma, resta, multiplicación, división, fracciones, geometría, y más
* **Razonamiento Verbal**: Sinónimos, antónimos, analogías, comprensión lectora, y más
* **Personalización**: Basada en perfil del estudiante (nivel, estilo de aprendizaje, intereses)
* **Tres Niveles**: Básico (grados 1-2), Intermedio (grados 3-4), Avanzado (grados 5-6)
* **Adaptativo**: Usa perfiles almacenados del sistema de clasificación

## Flujo de Uso

1. El estudiante completa el formulario de clasificación (frontend)
2. El backend de clasificación guarda el perfil en JSON
3. Esta API usa ese perfil para generar ejercicios personalizados
4. Los ejercicios se adaptan al nivel y estilo del estudiante
"""


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Configuración al iniciar y cerrar la aplicación
    """
    # Startup
    print("=" * 70)
    print(f"🚀 Iniciando {API_TITLE} v{API_VERSION}")
    print("=" * 70)

    # Verificar API key de Gemini
    try:
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            print("⚠️  WARNING: GEMINI_API_KEY no encontrada en .env")
        else:
            print("✅ GEMINI_API_KEY configurada")

        # Verificar conexión con perfil adapter
        perfiles_disponibles = perfil_adapter.contar_perfiles()
        print(f"✅ PerfilAdapter conectado: {perfiles_disponibles} perfiles disponibles")

    except Exception as e:
        print(f"⚠️  Error en verificación inicial: {str(e)}")

    print("=" * 70)

    yield

    # Shutdown
    print("\n👋 Cerrando aplicación...")


# Crear aplicación FastAPI
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/", tags=["General"])
async def root():
    """
    Endpoint raíz con información de la API
    """
    return {
        "servicio": API_TITLE,
        "version": API_VERSION,
        "status": "running",
        "documentacion": "/docs",
        "endpoints": {
            "health": "/health",
            "generar_ejercicios": "/api/generar-ejercicios",
            "generar_matematicas": "/api/generar-ejercicios/matematicas",
            "generar_verbal": "/api/generar-ejercicios/verbal"
        }
    }


@app.get(
    "/health",
    response_model=HealthCheckResponse,
    tags=["General"]
)
async def health_check():
    """
    Verifica el estado del servicio
    """
    try:
        # Verificar Gemini
        gemini_disponible = True
        try:
            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                gemini_disponible = False
        except:
            gemini_disponible = False

        # Contar perfiles disponibles
        perfiles_disponibles = perfil_adapter.contar_perfiles()

        return HealthCheckResponse(
            status="healthy",
            servicio=API_TITLE,
            version=API_VERSION,
            gemini_disponible=gemini_disponible,
            perfiles_disponibles=perfiles_disponibles
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/api/generar-ejercicios",
    response_model=GenerarEjerciciosResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    tags=["Ejercicios"]
)
async def generar_ejercicios(request: GenerarEjerciciosRequest):
    """
    Genera ejercicios personalizados según el curso especificado

    - **estudiante_id**: ID del estudiante (debe existir perfil guardado)
    - **curso**: "matematicas" o "verbal"
    - **cantidad**: Número de ejercicios (1-20, default: 5)
    - **tipo_especifico**: Opcional - tipo específico de ejercicio
    - **forzar_nivel**: Opcional - forzar nivel de dificultad
    """
    try:
        if request.curso == CursoEnum.MATEMATICAS:
            resultado = generador_matematicas.generar_ejercicios(
                estudiante_id=request.estudiante_id,
                cantidad=request.cantidad,
                tipo_especifico=request.tipo_especifico,
                forzar_nivel=request.forzar_nivel
            )
        elif request.curso == CursoEnum.VERBAL:
            resultado = generador_verbal.generar_ejercicios(
                estudiante_id=request.estudiante_id,
                cantidad=request.cantidad,
                tipo_especifico=request.tipo_especifico,
                forzar_nivel=request.forzar_nivel
            )
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Curso inválido: {request.curso}"
            )

        return GenerarEjerciciosResponse(**resultado)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar ejercicios: {str(e)}")


@app.post(
    "/api/generar-ejercicios/matematicas",
    response_model=GenerarEjerciciosResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    tags=["Ejercicios"]
)
async def generar_ejercicios_matematicas(request: GenerarEjerciciosRequest):
    """
    Genera ejercicios de matemáticas personalizados

    Tipos disponibles por nivel:
    - **Básico**: suma, resta, conteo, comparacion, figuras, patrones
    - **Intermedio**: multiplicacion, division, fracciones, geometria, problemas_mixtos
    - **Avanzado**: operaciones_combinadas, porcentajes, geometria_avanzada, proporciones
    """
    try:
        resultado = generador_matematicas.generar_ejercicios(
            estudiante_id=request.estudiante_id,
            cantidad=request.cantidad,
            tipo_especifico=request.tipo_especifico,
            forzar_nivel=request.forzar_nivel
        )

        return GenerarEjerciciosResponse(**resultado)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar ejercicios: {str(e)}")


@app.post(
    "/api/generar-ejercicios/verbal",
    response_model=GenerarEjerciciosResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    tags=["Ejercicios"]
)
async def generar_ejercicios_verbal(request: GenerarEjerciciosRequest):
    """
    Genera ejercicios de razonamiento verbal personalizados

    Tipos disponibles por nivel:
    - **Básico**: sinonimos, antonimos, categorias, completar, analogias
    - **Intermedio**: termino_excluido, comprension, oraciones_incompletas
    - **Avanzado**: comprension_inferencial, analogias_complejas, plan_de_redaccion, conectores_logicos
    """
    try:
        resultado = generador_verbal.generar_ejercicios(
            estudiante_id=request.estudiante_id,
            cantidad=request.cantidad,
            tipo_especifico=request.tipo_especifico,
            forzar_nivel=request.forzar_nivel
        )

        return GenerarEjerciciosResponse(**resultado)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar ejercicios: {str(e)}")


@app.post(
    "/api/validar-respuesta",
    response_model=ValidarRespuestaResponse,
    responses={
        400: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    tags=["Validación"]
)
async def validar_respuesta(request: ValidarRespuestaEjercicioRequest):
    """
    Valida la respuesta de un estudiante a un ejercicio

    **Nota**: Este endpoint requiere que los ejercicios se almacenen.
    Por ahora retorna un ejemplo, en producción se debe implementar
    el almacenamiento de ejercicios generados.
    """
    # TODO: Implementar almacenamiento de ejercicios y validación
    # Por ahora retornamos un ejemplo

    return ValidarRespuestaResponse(
        success=True,
        ejercicio_id=request.ejercicio_id,
        es_correcta=True,
        respuesta_estudiante=request.respuesta_estudiante,
        respuesta_correcta="A",
        explicacion="Esta es una explicación de ejemplo",
        retroalimentacion="¡Muy bien! Continúa así."
    )


# ============================================================================
# ENDPOINTS DE TRACKING DE RESPUESTAS
# ============================================================================

@app.post(
    "/api/sesiones/crear",
    response_model=CrearSesionResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    tags=["Sesiones"]
)
async def crear_sesion(request: CrearSesionRequest):
    """
    Crea una nueva sesión de ejercicios para un estudiante

    Este endpoint debe llamarse después de generar ejercicios.
    Almacena la sesión y permite tracking de respuestas.
    """
    try:
        # Generar ID de sesión
        sesion_id = respuestas_storage.generar_id_sesion(request.estudiante_id)

        # Crear objeto de sesión
        from models import SesionEjercicios
        sesion = SesionEjercicios(
            sesion_id=sesion_id,
            estudiante_id=request.estudiante_id,
            curso=request.curso,
            nivel_determinado=request.nivel_determinado,
            cantidad_ejercicios=len(request.ejercicios_ids),
            ejercicios_ids=request.ejercicios_ids,
            perfil_usado=request.perfil_usado
        )

        # Guardar sesión
        sesion_guardada = respuestas_storage.crear_sesion(sesion)

        return CrearSesionResponse(
            success=True,
            mensaje="Sesión creada exitosamente",
            sesion_id=sesion_id,
            sesion=sesion_guardada
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear sesión: {str(e)}")


@app.post(
    "/api/sesiones/{sesion_id}/responder",
    response_model=RegistrarRespuestaResponse,
    responses={
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    tags=["Sesiones"]
)
async def registrar_respuesta(sesion_id: str, request: RegistrarRespuestaRequest):
    """
    Registra la respuesta de un estudiante a un ejercicio

    Actualiza el progreso de la sesión y registra si la respuesta es correcta.
    """
    try:
        # Crear respuesta
        from models import RespuestaEstudiante
        respuesta = RespuestaEstudiante(
            ejercicio_id=request.ejercicio_id,
            opcion_seleccionada=request.opcion_seleccionada,
            es_correcta=request.es_correcta,
            tiempo_respuesta_segundos=request.tiempo_respuesta_segundos
        )

        # Registrar
        sesion_actualizada = respuestas_storage.registrar_respuesta(sesion_id, respuesta)

        if not sesion_actualizada:
            raise HTTPException(
                status_code=404,
                detail=f"Sesión {sesion_id} no encontrada"
            )

        # Calcular progreso
        progreso = {
            "completados": len(sesion_actualizada.respuestas),
            "total": sesion_actualizada.cantidad_ejercicios,
            "correctos": sum(1 for r in sesion_actualizada.respuestas if r.es_correcta)
        }

        return RegistrarRespuestaResponse(
            success=True,
            mensaje="Respuesta registrada exitosamente",
            respuesta=respuesta,
            progreso=progreso
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al registrar respuesta: {str(e)}")


@app.post(
    "/api/sesiones/{sesion_id}/completar",
    response_model=CompletarSesionResponse,
    responses={
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    tags=["Sesiones"]
)
async def completar_sesion(sesion_id: str, request: CompletarSesionRequest):
    """
    Marca una sesión como completada y calcula estadísticas finales

    Se debe llamar cuando el estudiante termine todos los ejercicios.
    """
    try:
        # Completar sesión
        sesion_completada = respuestas_storage.completar_sesion(sesion_id, request.fecha_fin)

        if not sesion_completada:
            raise HTTPException(
                status_code=404,
                detail=f"Sesión {sesion_id} no encontrada"
            )

        # Calcular estadísticas
        estadisticas = respuestas_storage.calcular_estadisticas_sesion(sesion_id)

        # Calcular recomendación de nivel
        recomendacion = None
        try:
            # Obtener estadísticas del estudiante
            stats_estudiante = respuestas_storage.calcular_estadisticas_estudiante(
                sesion_completada.estudiante_id
            )

            # Recomendar nivel
            recomendacion_dict = adaptador_nivel.recomendar_nivel(
                nivel_actual=sesion_completada.nivel_determinado,
                estadisticas_sesion=estadisticas,
                estadisticas_estudiante=stats_estudiante,
                sesion=sesion_completada
            )

            recomendacion = RecomendacionNivel(**recomendacion_dict)
        except Exception as e:
            print(f"⚠️ Error calculando recomendación de nivel: {e}")
            # Continuar sin recomendación

        return CompletarSesionResponse(
            success=True,
            mensaje="Sesión completada exitosamente",
            sesion_id=sesion_id,
            estadisticas=estadisticas,
            recomendacion_nivel=recomendacion
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al completar sesión: {str(e)}")


@app.get(
    "/api/sesiones/{sesion_id}",
    response_model=ObtenerSesionResponse,
    responses={
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    tags=["Sesiones"]
)
async def obtener_sesion(sesion_id: str):
    """
    Obtiene los detalles completos de una sesión

    Incluye todos los ejercicios, respuestas y estadísticas.
    """
    try:
        sesion = respuestas_storage.obtener_sesion(sesion_id)

        if not sesion:
            raise HTTPException(
                status_code=404,
                detail=f"Sesión {sesion_id} no encontrada"
            )

        # Calcular estadísticas
        estadisticas = respuestas_storage.calcular_estadisticas_sesion(sesion_id)

        return ObtenerSesionResponse(
            success=True,
            sesion=sesion,
            estadisticas=estadisticas
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/api/estudiantes/{estudiante_id}/sesiones",
    response_model=ListarSesionesResponse,
    responses={
        500: {"model": ErrorResponse}
    },
    tags=["Estudiantes"]
)
async def listar_sesiones_estudiante(estudiante_id: str, limite: int = 10):
    """
    Lista todas las sesiones de un estudiante

    Ordenadas por fecha (más reciente primero).
    Parámetro limite: número máximo de sesiones a retornar (default: 10).
    """
    try:
        sesiones = respuestas_storage.listar_sesiones_estudiante(estudiante_id, limite)

        return ListarSesionesResponse(
            success=True,
            estudiante_id=estudiante_id,
            total_sesiones=len(sesiones),
            sesiones=sesiones
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/api/estudiantes/{estudiante_id}/estadisticas",
    response_model=ObtenerEstadisticasEstudianteResponse,
    responses={
        500: {"model": ErrorResponse}
    },
    tags=["Estudiantes"]
)
async def obtener_estadisticas_estudiante(estudiante_id: str):
    """
    Obtiene estadísticas agregadas de un estudiante

    Incluye totales, promedios y desempeño por curso.
    """
    try:
        estadisticas = respuestas_storage.calcular_estadisticas_estudiante(estudiante_id)
        sesiones_recientes = respuestas_storage.listar_sesiones_estudiante(estudiante_id, 5)

        return ObtenerEstadisticasEstudianteResponse(
            success=True,
            estudiante_id=estudiante_id,
            estadisticas=estadisticas,
            sesiones_recientes=sesiones_recientes
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/api/estudiantes/{estudiante_id}/nivel-recomendado",
    response_model=RecomendacionNivel,
    responses={
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    tags=["Estudiantes"]
)
async def obtener_nivel_recomendado(estudiante_id: str, curso: CursoEnum):
    """
    Obtiene la recomendación de nivel para un estudiante

    Basándose en su historial de rendimiento, recomienda el próximo
    nivel de dificultad (básico, intermedio o avanzado).

    Parámetros:
    - estudiante_id: ID del estudiante
    - curso: Curso para el que se quiere la recomendación (matematicas|verbal)
    """
    try:
        # Obtener estadísticas del estudiante
        stats_estudiante = respuestas_storage.calcular_estadisticas_estudiante(estudiante_id)

        if stats_estudiante.total_sesiones == 0:
            # Sin historial, retornar nivel básico como recomendación
            return RecomendacionNivel(
                nivel_actual="basico",
                nivel_recomendado="basico",
                direccion="mantener",
                razon="Sin historial previo. Se recomienda comenzar en nivel básico.",
                confianza="baja",
                cambio_aplicado=False,
                metricas={"total_sesiones": 0}
            )

        # Obtener última sesión del curso especificado
        sesiones = respuestas_storage.listar_sesiones_estudiante(estudiante_id)
        sesiones_curso = [s for s in sesiones if s.curso == curso]

        if not sesiones_curso:
            # Sin historial en este curso, usar nivel intermedio como default
            return RecomendacionNivel(
                nivel_actual="intermedio",
                nivel_recomendado="intermedio",
                direccion="mantener",
                razon=f"Sin historial en {curso.value}. Se recomienda nivel intermedio.",
                confianza="baja",
                cambio_aplicado=False,
                metricas={"sesiones_curso": 0}
            )

        # Obtener última sesión y sus estadísticas
        ultima_sesion = sesiones_curso[0]  # Ya están ordenadas por fecha
        stats_sesion = respuestas_storage.calcular_estadisticas_sesion(ultima_sesion.sesion_id)

        # Recomendar nivel
        recomendacion_dict = adaptador_nivel.recomendar_nivel(
            nivel_actual=ultima_sesion.nivel_determinado,
            estadisticas_sesion=stats_sesion,
            estadisticas_estudiante=stats_estudiante,
            sesion=ultima_sesion
        )

        return RecomendacionNivel(**recomendacion_dict)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al calcular nivel recomendado: {str(e)}")


# ============================================================================
# ENDPOINTS DE PERFILES
# ============================================================================

@app.get(
    "/api/perfiles/{estudiante_id}",
    tags=["Perfiles"]
)
async def obtener_perfil_estudiante(estudiante_id: str):
    """
    Obtiene el perfil más reciente de un estudiante
    """
    try:
        perfil = perfil_adapter.obtener_perfil(estudiante_id)

        if not perfil:
            raise HTTPException(
                status_code=404,
                detail=f"Perfil no encontrado para estudiante: {estudiante_id}"
            )

        return {
            "success": True,
            "estudiante_id": estudiante_id,
            "perfil": perfil
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/api/perfiles",
    tags=["Perfiles"]
)
async def listar_perfiles():
    """
    Lista todos los perfiles disponibles con información resumida
    """
    try:
        total = perfil_adapter.contar_perfiles()
        estudiantes = perfil_adapter.listar_estudiantes()

        return {
            "success": True,
            "total_perfiles": total,
            "estudiantes": estudiantes
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# MANEJO DE ERRORES
# ============================================================================

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "success": False,
        "error": "Endpoint no encontrado",
        "detalle": "Verifica la URL y el método HTTP",
        "codigo_error": "NOT_FOUND"
    }


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return {
        "success": False,
        "error": "Error interno del servidor",
        "detalle": str(exc),
        "codigo_error": "INTERNAL_ERROR"
    }


if __name__ == "__main__":
    import uvicorn

    # Configuración para desarrollo
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,  # Puerto diferente al backend de clasificación (8000)
        reload=True,  # Auto-reload en desarrollo
        log_level="info"
    )
