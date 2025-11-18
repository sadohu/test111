"""
API Backend - Sistema de Clasificación de Perfiles Estudiantiles
FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.routes import perfil_router

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# CREAR APLICACIÓN FASTAPI
# ============================================================================

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    API Backend para el Sistema de Clasificación de Perfiles Estudiantiles.

    Este servicio proporciona endpoints para:
    - Clasificar perfiles de estudiantes basados en formularios
    - Validar respuestas individuales
    - Obtener formularios por grado
    - Gestionar perfiles en Supabase (próximamente)

    ## Endpoints Principales

    * **POST /api/clasificar-perfil** - Clasifica el perfil completo de un estudiante
    * **POST /api/validar-respuesta** - Valida una respuesta individual
    * **GET /api/formulario/{grado}** - Obtiene el formulario para un grado
    * **GET /api/categorias** - Lista todas las categorías de perfiles
    * **GET /api/health** - Health check del servicio
    """,
    docs_url="/docs",
    redoc_url="/redoc",
)


# ============================================================================
# CONFIGURAR CORS
# ============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# REGISTRAR ROUTERS
# ============================================================================

app.include_router(perfil_router)


# ============================================================================
# EVENTOS DE INICIO/CIERRE
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Ejecutar al iniciar la aplicación"""
    logger.info(f"🚀 Iniciando {settings.app_name} v{settings.app_version}")
    logger.info(f"📝 Documentación disponible en /docs")
    logger.info(f"🔧 Modo Debug: {settings.debug}")

    # TODO: Inicializar conexión a Supabase cuando esté configurado
    if settings.supabase_url and settings.supabase_key:
        logger.info("✅ Supabase configurado")
    else:
        logger.warning("⚠️  Supabase no configurado - algunos endpoints no estarán disponibles")


@app.on_event("shutdown")
async def shutdown_event():
    """Ejecutar al cerrar la aplicación"""
    logger.info("👋 Cerrando aplicación...")
    # TODO: Cerrar conexiones a base de datos


# ============================================================================
# ENDPOINTS RAÍZ
# ============================================================================

@app.get("/")
async def root():
    """Endpoint raíz con información del servicio"""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs",
        "health": "/api/health"
    }


# ============================================================================
# MANEJADORES DE ERRORES
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Manejador global de excepciones"""
    logger.error(f"Error no manejado: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Error interno del servidor",
            "detail": str(exc) if settings.debug else "Contacte al administrador"
        }
    )


# ============================================================================
# EJECUTAR CON UVICORN
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )
