"""
Cliente para Google Gemini API - Generación de Ejercicios
Adaptado de chatbot-test/main.py para generar ejercicios educativos personalizados
"""

import os
from typing import List, Optional
from dotenv import load_dotenv
import google.generativeai as genai

# Cargar variables de entorno
load_dotenv()


class GeminiClient:
    """
    Cliente para interactuar con Google Gemini API
    Especializado en generación de ejercicios educativos
    """

    def __init__(self):
        """Inicializa el cliente de Gemini"""
        self.api_key = os.getenv('GEMINI_API_KEY')

        if not self.api_key:
            raise ValueError(
                "❌ GEMINI_API_KEY no encontrada en .env\n"
                "Crea un archivo .env con tu API key de Google Gemini"
            )

        # Configurar Gemini
        genai.configure(api_key=self.api_key)

        # Modelo por defecto
        self.model_name = os.getenv('GEMINI_MODEL', 'gemini-pro')
        self.model = genai.GenerativeModel(self.model_name)

    def generar_contenido(
        self,
        prompt: str,
        temperatura: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Genera contenido usando Gemini

        Args:
            prompt: Prompt completo con instrucciones
            temperatura: Controla creatividad (0.0 = determinista, 1.0 = creativo)
            max_tokens: Longitud máxima de respuesta (None = sin límite)

        Returns:
            Texto generado por Gemini

        Raises:
            Exception: Si hay error en la generación
        """
        try:
            # Configurar parámetros de generación
            generation_config = {
                "temperature": temperatura,
            }

            if max_tokens:
                generation_config["max_output_tokens"] = max_tokens

            # Generar contenido
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config
            )

            return response.text

        except Exception as e:
            raise Exception(f"Error al generar contenido con Gemini: {str(e)}")

    def generar_ejercicio(
        self,
        prompt: str,
        temperatura: float = 0.7,
        max_tokens: int = 2000
    ) -> str:
        """
        Genera un ejercicio educativo usando Gemini

        Args:
            prompt: Prompt con especificaciones del ejercicio
            temperatura: Creatividad (0.7 recomendado para ejercicios)
            max_tokens: Longitud máxima (2000 suficiente para ejercicios)

        Returns:
            Ejercicio generado en formato JSON (string)
        """
        return self.generar_contenido(prompt, temperatura, max_tokens)

    def generar_ejercicios_batch(
        self,
        prompts: List[str],
        temperatura: float = 0.7
    ) -> List[str]:
        """
        Genera múltiples ejercicios en batch

        Args:
            prompts: Lista de prompts
            temperatura: Creatividad

        Returns:
            Lista de ejercicios generados
        """
        resultados = []

        for i, prompt in enumerate(prompts, 1):
            try:
                resultado = self.generar_ejercicio(prompt, temperatura)
                resultados.append(resultado)
            except Exception as e:
                print(f"⚠️  Error en ejercicio {i}: {str(e)}")
                # Continuar con el siguiente

        return resultados

    def validar_respuesta_json(self, respuesta: str) -> bool:
        """
        Valida que la respuesta parezca ser JSON válido

        Args:
            respuesta: Texto de respuesta de Gemini

        Returns:
            True si parece JSON válido
        """
        import json
        try:
            # Intentar limpiar markdown si existe
            respuesta_limpia = respuesta.strip()
            if respuesta_limpia.startswith('```json'):
                respuesta_limpia = respuesta_limpia.split('```json')[1]
                respuesta_limpia = respuesta_limpia.split('```')[0]
            elif respuesta_limpia.startswith('```'):
                respuesta_limpia = respuesta_limpia.split('```')[1]
                respuesta_limpia = respuesta_limpia.split('```')[0]

            # Intentar parsear
            json.loads(respuesta_limpia)
            return True
        except:
            return False


# Singleton
gemini_client = GeminiClient()
