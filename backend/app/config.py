"""
Configuración del Backend - Sistema de Clasificación de Perfiles
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """
    Configuración de la aplicación
    Se cargan desde variables de entorno o archivo .env
    """

    # Información de la aplicación
    app_name: str = "API Sistema de Clasificación de Perfiles"
    app_version: str = "1.0.0"
    debug: bool = False

    # CORS - Orígenes permitidos
    cors_origins: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://tu-dominio.com",
    ]

    # Supabase Configuration
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_service_key: str = ""

    # Base de datos (opcional si usas Supabase)
    database_url: str = ""

    # API Keys (para autenticación)
    api_key_header: str = "X-API-Key"
    api_keys: list = []

    # Rate limiting
    rate_limit_per_minute: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """
    Retorna una instancia cacheada de Settings
    Se usa lru_cache para evitar leer el archivo .env múltiples veces
    """
    return Settings()


# Instancia global de configuración
settings = get_settings()
