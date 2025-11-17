"""
Rutas de la API para Clasificación de Perfiles Estudiantiles
"""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, List
import logging

from app.models.perfil import (
    ClasificarPerfilRequest,
    ValidarRespuestaRequest,
    GuardarPerfilRequest,
    PerfilEstudianteResponse,
    ValidarRespuestaResponse,
    APIResponse,
)
from app.services.clasificador import (
    SistemaClasificacionPerfiles,
    PerfilEstudiante,
)
from app.services.json_storage import json_storage

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crear router
router = APIRouter(
    prefix="/api",
    tags=["perfiles"],
)

# Instancia del sistema de clasificación
clasificador = SistemaClasificacionPerfiles()


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/clasificar-perfil", response_model=PerfilEstudianteResponse)
async def clasificar_perfil(request: ClasificarPerfilRequest):
    """
    Clasifica el perfil de un estudiante basado en sus respuestas al formulario.

    Args:
        request: Contiene respuestas del formulario, grado y estudiante_id

    Returns:
        PerfilEstudianteResponse con todas las características del perfil

    Raises:
        HTTPException: Si hay error en la clasificación
    """
    try:
        logger.info(f"Clasificando perfil para estudiante: {request.estudiante_id}")

        # Clasificar usando el sistema de clasificación
        perfil = clasificador.clasificar_respuestas(
            respuestas=request.respuestas,
            grado=request.grado.value,
            estudiante_id=request.estudiante_id
        )

        # Convertir a response model
        response = PerfilEstudianteResponse(
            estudiante_id=perfil.estudiante_id,
            grado=perfil.grado,
            fecha_creacion=perfil.fecha_creacion.isoformat(),
            ultima_actualizacion=perfil.ultima_actualizacion.isoformat(),
            estilo_aprendizaje=perfil.estilo_aprendizaje,
            velocidad=perfil.velocidad,
            atencion=perfil.atencion,
            interes=perfil.interes,
            nivel_matematicas=perfil.nivel_matematicas,
            nivel_lectura=perfil.nivel_lectura,
            motivacion=perfil.motivacion,
            frustracion=perfil.frustracion,
            trabajo=perfil.trabajo,
            energia=perfil.energia,
            nivel_riesgo=perfil.nivel_riesgo,
            recomendaciones=perfil.recomendaciones,
            categoria_principal=perfil.categoria_principal,
            confianza_perfil=perfil.confianza_perfil,
        )

        # Guardar en JSON automáticamente
        perfil_dict = response.model_dump()
        perfil_dict["respuestas_originales"] = request.respuestas
        storage_result = json_storage.guardar_perfil(perfil_dict)

        if storage_result.get("success"):
            logger.info(f"💾 Perfil guardado en JSON: {storage_result.get('file')}")
        else:
            logger.warning(f"⚠️  No se pudo guardar en JSON: {storage_result.get('error')}")

        logger.info(f"✅ Perfil clasificado exitosamente: {perfil.categoria_principal}")
        return response

    except ValueError as e:
        logger.error(f"Error de validación: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error al clasificar perfil: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al clasificar perfil: {str(e)}"
        )


@router.post("/validar-respuesta", response_model=ValidarRespuestaResponse)
async def validar_respuesta(request: ValidarRespuestaRequest):
    """
    Valida que una respuesta individual sea correcta para una pregunta.

    Args:
        request: Contiene pregunta, respuesta y grado

    Returns:
        ValidarRespuestaResponse indicando si la respuesta es válida
    """
    try:
        # Validar que la pregunta existe en el mapeo
        if request.pregunta not in clasificador.mapeo_base:
            return ValidarRespuestaResponse(
                valida=False,
                mensaje=f"Pregunta {request.pregunta} no existe"
            )

        # Validar que la respuesta existe para esa pregunta
        opciones_validas = clasificador.mapeo_base[request.pregunta].keys()
        if request.respuesta not in opciones_validas:
            return ValidarRespuestaResponse(
                valida=False,
                mensaje=f"Respuesta {request.respuesta} no es válida para {request.pregunta}"
            )

        return ValidarRespuestaResponse(
            valida=True,
            mensaje="Respuesta válida"
        )

    except Exception as e:
        logger.error(f"Error al validar respuesta: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al validar respuesta: {str(e)}"
        )


@router.get("/formulario/{grado}")
async def obtener_formulario(grado: str):
    """
    Obtiene el formulario para un grado específico.

    Args:
        grado: Grado escolar ("1-2", "3-4", "5-6")

    Returns:
        Dict con la estructura del formulario

    Note:
        En una implementación completa, esto cargaría desde data/formularios.json
        Por ahora retorna una estructura básica.
    """
    try:
        # Validar grado
        grados_validos = ["1-2", "3-4", "5-6"]
        if grado not in grados_validos:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Grado debe ser uno de: {grados_validos}"
            )

        # TODO: Cargar desde data/formularios.json
        # Por ahora retornamos estructura básica
        return {
            "grado": grado,
            "preguntas": [
                {"id": f"P{i}", "numero": i} for i in range(1, 11)
            ],
            "mensaje": "Formulario básico - implementar carga desde JSON"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener formulario: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener formulario: {str(e)}"
        )


@router.get("/categorias")
async def obtener_categorias():
    """
    Obtiene la lista de todas las categorías de perfiles disponibles.

    Returns:
        List con los nombres de las 10 categorías
    """
    try:
        categorias = list(clasificador.categorias.keys())
        return {
            "total": len(categorias),
            "categorias": categorias
        }
    except Exception as e:
        logger.error(f"Error al obtener categorías: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener categorías: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Endpoint de health check para verificar que el servicio está funcionando.

    Returns:
        Estado del servicio
    """
    return {
        "status": "healthy",
        "service": "Sistema de Clasificación de Perfiles",
        "version": "1.0.0"
    }


# ============================================================================
# ENDPOINTS DE GESTIÓN DE PERFILES GUARDADOS
# ============================================================================

@router.get("/perfiles")
async def listar_perfiles_guardados(
    grado: str = None,
    nivel_riesgo: str = None,
    limit: int = 50
):
    """
    Lista los perfiles guardados en JSON con filtros opcionales.

    Args:
        grado: Filtrar por grado (opcional)
        nivel_riesgo: Filtrar por nivel de riesgo (opcional)
        limit: Límite de resultados (default: 50)

    Returns:
        Lista de perfiles guardados
    """
    try:
        perfiles = json_storage.listar_perfiles(
            grado=grado,
            nivel_riesgo=nivel_riesgo,
            limit=limit
        )

        return {
            "success": True,
            "total": len(perfiles),
            "perfiles": perfiles
        }

    except Exception as e:
        logger.error(f"Error al listar perfiles: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al listar perfiles: {str(e)}"
        )


@router.get("/perfil/{estudiante_id}")
async def obtener_perfil_guardado(estudiante_id: str):
    """
    Obtiene el perfil más reciente de un estudiante desde JSON.

    Args:
        estudiante_id: ID del estudiante

    Returns:
        Perfil del estudiante
    """
    try:
        perfil = json_storage.obtener_perfil(estudiante_id)

        if not perfil:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró perfil para estudiante: {estudiante_id}"
            )

        return {
            "success": True,
            "perfil": perfil
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener perfil: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener perfil: {str(e)}"
        )


@router.get("/estadisticas")
async def obtener_estadisticas():
    """
    Obtiene estadísticas de los perfiles guardados.

    Returns:
        Estadísticas por categoría, nivel de riesgo y grado
    """
    try:
        estadisticas = json_storage.obtener_estadisticas()

        return {
            "success": True,
            "estadisticas": estadisticas
        }

    except Exception as e:
        logger.error(f"Error al obtener estadísticas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener estadísticas: {str(e)}"
        )
