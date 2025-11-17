"""
Servicios del Backend
"""

from app.services.clasificador import SistemaClasificacionPerfiles, PerfilEstudiante
from app.services.json_storage import JSONStorageService, json_storage

__all__ = [
    "SistemaClasificacionPerfiles",
    "PerfilEstudiante",
    "JSONStorageService",
    "json_storage",
]
