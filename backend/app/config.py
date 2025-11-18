"""
Configuración del Backend - Sistema de Clasificación de Perfiles
"""

from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache
from typing import List, Union


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
    cors_origins: Union[List[str], str] = [
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
    api_keys: Union[List[str], str] = []

    # Rate limiting
    rate_limit_per_minute: int = 60

    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Convierte string separado por comas a lista"""
        if isinstance(v, str):
            # Si es string vacío, retornar lista vacía
            if not v or v.strip() == "":
                return []
            # Dividir por comas y limpiar espacios
            return [origin.strip() for origin in v.split(',')]
        return v

    @field_validator('api_keys', mode='before')
    @classmethod
    def parse_api_keys(cls, v):
        """Convierte string separado por comas a lista"""
        if isinstance(v, str):
            # Si es string vacío, retornar lista vacía
            if not v or v.strip() == "":
                return []
            # Dividir por comas y limpiar espacios
            return [key.strip() for key in v.split(',')]
        return v

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
