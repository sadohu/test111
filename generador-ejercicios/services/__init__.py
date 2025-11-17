"""
Servicios del Generador de Ejercicios
"""

from .gemini_client import gemini_client, GeminiClient
from .perfil_adapter import perfil_adapter, PerfilAdapter
from .prompt_builder import prompt_builder, PromptBuilder, construir_prompt
from .generador_matematicas import generador_matematicas, GeneradorMatematicas
from .generador_verbal import generador_verbal, GeneradorVerbal
from .respuestas_storage import respuestas_storage, RespuestasStorage
from .adaptador_nivel import adaptador_nivel, AdaptadorNivel

__all__ = [
    # Singletons
    'gemini_client',
    'perfil_adapter',
    'prompt_builder',
    'generador_matematicas',
    'generador_verbal',
    'respuestas_storage',
    'adaptador_nivel',

    # Clases
    'GeminiClient',
    'PerfilAdapter',
    'PromptBuilder',
    'GeneradorMatematicas',
    'GeneradorVerbal',
    'RespuestasStorage',
    'AdaptadorNivel',

    # Funciones
    'construir_prompt',
]
