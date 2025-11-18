"""
GeneradorVerbal - Servicio para generar ejercicios de razonamiento verbal personalizados
Integra: PerfilAdapter + PromptBuilder + GeminiClient
"""

import json
import time
from typing import List, Dict, Optional
from datetime import datetime

from .gemini_client import gemini_client
from .perfil_adapter import perfil_adapter
from .prompt_builder import prompt_builder
from models.ejercicio import (
    EjercicioVerbal,
    NivelDificultad,
    TipoEjercicioVerbal,
    CursoEnum
)


class GeneradorVerbal:
    """
    Generador de ejercicios de razonamiento verbal personalizados usando Gemini AI
    """

    def __init__(
        self,
        temperatura: float = 0.7,
        max_tokens: int = 2000,
        reintentos_max: int = 3
    ):
        """
        Inicializa el generador verbal

        Args:
            temperatura: Creatividad de Gemini (0.0-1.0)
            max_tokens: Máximo de tokens por generación
            reintentos_max: Intentos máximos si falla la generación
        """
        self.temperatura = temperatura
        self.max_tokens = max_tokens
        self.reintentos_max = reintentos_max

    def generar_ejercicios(
        self,
        estudiante_id: str,
        cantidad: int = 5,
        tipo_especifico: Optional[str] = None,
        forzar_nivel: Optional[NivelDificultad] = None
    ) -> Dict:
        """
        Genera ejercicios de razonamiento verbal personalizados para un estudiante

        Args:
            estudiante_id: ID del estudiante
            cantidad: Cantidad de ejercicios a generar (1-20)
            tipo_especifico: Tipo de ejercicio específico (sinonimos, antonimos, etc.)
            forzar_nivel: Forzar nivel de dificultad (ignora perfil)

        Returns:
            Diccionario con ejercicios generados y metadata

        Raises:
            ValueError: Si los parámetros son inválidos
            Exception: Si falla la generación después de reintentos
        """
        tiempo_inicio = time.time()

        # Validar parámetros
        if cantidad < 1 or cantidad > 20:
            raise ValueError("cantidad debe estar entre 1 y 20")

        # Obtener perfil del estudiante
        print(f"\n📊 Obteniendo perfil del estudiante {estudiante_id}...")
        perfil = perfil_adapter.obtener_perfil(estudiante_id)

        if not perfil:
            print(f"⚠️  Perfil no encontrado, usando perfil por defecto")
            perfil = perfil_adapter.obtener_perfil_default()

        # Determinar nivel de dificultad
        if forzar_nivel:
            nivel = self._nivel_dificultad_a_string(forzar_nivel)
            print(f"🎯 Nivel forzado: {nivel}")
        else:
            nivel = prompt_builder.determinar_nivel_desde_perfil(perfil, "verbal")
            print(f"🎯 Nivel determinado del perfil: {nivel}")

        # Determinar tipo de ejercicio
        tipo_ejercicio = tipo_especifico or self._determinar_tipo_por_nivel(nivel)
        print(f"📝 Tipo de ejercicio: {tipo_ejercicio}")

        # Construir prompt personalizado
        print(f"🔨 Construyendo prompt personalizado...")
        prompt = prompt_builder.construir_prompt_verbal(
            nivel=nivel,
            cantidad=cantidad,
            tipo_ejercicio=tipo_ejercicio,
            perfil=perfil
        )

        # Generar con reintentos
        ejercicios = []
        ultimo_error = None

        for intento in range(1, self.reintentos_max + 1):
            try:
                print(f"🤖 Generando con Gemini (intento {intento}/{self.reintentos_max})...")

                # Llamar a Gemini
                respuesta_texto = gemini_client.generar_ejercicio(
                    prompt=prompt,
                    temperatura=self.temperatura,
                    max_tokens=self.max_tokens
                )

                # Parsear respuesta JSON
                ejercicios_data = self._parsear_respuesta(respuesta_texto)

                # Validar y convertir a objetos Pydantic
                ejercicios = self._validar_ejercicios(ejercicios_data, nivel, tipo_ejercicio)

                if ejercicios:
                    print(f"✅ Generados {len(ejercicios)} ejercicios exitosamente")
                    break

            except Exception as e:
                ultimo_error = str(e)
                print(f"❌ Intento {intento} falló: {ultimo_error}")

                if intento < self.reintentos_max:
                    tiempo_espera = 2 ** intento  # Backoff exponencial
                    print(f"⏳ Esperando {tiempo_espera}s antes de reintentar...")
                    time.sleep(tiempo_espera)

        # Si no se generaron ejercicios después de todos los intentos
        if not ejercicios:
            raise Exception(
                f"No se pudieron generar ejercicios después de {self.reintentos_max} intentos. "
                f"Último error: {ultimo_error}"
            )

        # Calcular tiempo total
        tiempo_generacion = time.time() - tiempo_inicio

        # Construir respuesta
        return {
            "success": True,
            "mensaje": f"{len(ejercicios)} ejercicios generados exitosamente",
            "estudiante_id": estudiante_id,
            "curso": CursoEnum.VERBAL.value,
            "cantidad_solicitada": cantidad,
            "cantidad_generada": len(ejercicios),
            "ejercicios_matematicas": None,
            "ejercicios_verbales": ejercicios,
            "perfil_usado": self._preparar_perfil_respuesta(perfil),
            "nivel_determinado": nivel,
            "tiempo_generacion_segundos": round(tiempo_generacion, 2)
        }

    def _parsear_respuesta(self, respuesta_texto: str) -> List[Dict]:
        """
        Parsea la respuesta JSON de Gemini

        Args:
            respuesta_texto: Texto de respuesta de Gemini

        Returns:
            Lista de diccionarios con ejercicios

        Raises:
            ValueError: Si no se puede parsear el JSON
        """
        # Limpiar markdown si existe
        respuesta_limpia = respuesta_texto.strip()

        if respuesta_limpia.startswith('```json'):
            respuesta_limpia = respuesta_limpia.split('```json')[1]
            respuesta_limpia = respuesta_limpia.split('```')[0]
        elif respuesta_limpia.startswith('```'):
            respuesta_limpia = respuesta_limpia.split('```')[1]
            respuesta_limpia = respuesta_limpia.split('```')[0]

        # Parsear JSON
        try:
            data = json.loads(respuesta_limpia.strip())

            # Extraer ejercicios (puede estar en "ejercicios" o ser la lista directamente)
            if isinstance(data, dict) and "ejercicios" in data:
                return data["ejercicios"]
            elif isinstance(data, list):
                return data
            else:
                raise ValueError("Formato JSON inesperado")

        except json.JSONDecodeError as e:
            raise ValueError(f"Error al parsear JSON de Gemini: {str(e)}")

    def _validar_ejercicios(
        self,
        ejercicios_data: List[Dict],
        nivel: str,
        tipo_ejercicio: str
    ) -> List[EjercicioVerbal]:
        """
        Valida y convierte ejercicios a objetos Pydantic

        Args:
            ejercicios_data: Lista de diccionarios con ejercicios
            nivel: Nivel de dificultad esperado
            tipo_ejercicio: Tipo de ejercicio esperado

        Returns:
            Lista de objetos EjercicioVerbal validados
        """
        ejercicios_validados = []

        for i, ejercicio_dict in enumerate(ejercicios_data, 1):
            try:
                # Intentar crear objeto Pydantic (valida automáticamente)
                ejercicio = EjercicioVerbal(**ejercicio_dict)
                ejercicios_validados.append(ejercicio)

            except Exception as e:
                print(f"⚠️  Ejercicio {i} inválido: {str(e)}")
                # Continuar con los siguientes

        return ejercicios_validados

    def _nivel_dificultad_a_string(self, nivel: NivelDificultad) -> str:
        """
        Convierte NivelDificultad enum a string para prompt

        Args:
            nivel: NivelDificultad enum

        Returns:
            "basico", "intermedio", o "avanzado"
        """
        mapping = {
            NivelDificultad.FACIL: "basico",
            NivelDificultad.MEDIO: "intermedio",
            NivelDificultad.DIFICIL: "avanzado"
        }
        return mapping.get(nivel, "intermedio")

    def _determinar_tipo_por_nivel(self, nivel: str) -> str:
        """
        Determina un tipo de ejercicio apropiado según el nivel

        Args:
            nivel: "basico", "intermedio", o "avanzado"

        Returns:
            Tipo de ejercicio apropiado
        """
        tipos_por_nivel = {
            "basico": ["sinonimos", "antonimos", "categorias", "completar"],
            "intermedio": ["analogias", "termino_excluido", "comprension", "oraciones_incompletas"],
            "avanzado": ["comprension_inferencial", "analogias_complejas", "plan_de_redaccion", "conectores_logicos"]
        }

        # Retornar el primer tipo para ese nivel
        return tipos_por_nivel.get(nivel, ["sinonimos"])[0]

    def _preparar_perfil_respuesta(self, perfil: Dict) -> Dict:
        """
        Prepara un resumen del perfil para la respuesta

        Args:
            perfil: Perfil completo del estudiante

        Returns:
            Diccionario con datos relevantes del perfil
        """
        return {
            "estudiante_id": perfil.get("estudiante_id", "DEFAULT"),
            "grado": perfil.get("grado", "3-4"),
            "nivel_lectura": perfil.get("nivel_lectura", "desarrollado"),
            "estilo_aprendizaje": perfil.get("estilo_aprendizaje", "visual"),
            "velocidad_lectura": perfil.get("velocidad_lectura", "promedio"),
            "areas_interes": perfil.get("areas_interes_texto", "general")
        }

    def generar_por_tipo(
        self,
        estudiante_id: str,
        tipos: List[str],
        cantidad_por_tipo: int = 3
    ) -> Dict:
        """
        Genera ejercicios de múltiples tipos

        Args:
            estudiante_id: ID del estudiante
            tipos: Lista de tipos de ejercicios
            cantidad_por_tipo: Cantidad por cada tipo

        Returns:
            Diccionario con todos los ejercicios generados
        """
        tiempo_inicio = time.time()
        todos_ejercicios = []
        total_solicitado = len(tipos) * cantidad_por_tipo

        print(f"\n📚 Generando {len(tipos)} tipos de ejercicios verbales...")

        for tipo in tipos:
            try:
                print(f"\n--- Tipo: {tipo} ---")
                resultado = self.generar_ejercicios(
                    estudiante_id=estudiante_id,
                    cantidad=cantidad_por_tipo,
                    tipo_especifico=tipo
                )
                todos_ejercicios.extend(resultado["ejercicios_verbales"])

            except Exception as e:
                print(f"❌ Error generando tipo '{tipo}': {str(e)}")
                # Continuar con los siguientes tipos

        tiempo_total = time.time() - tiempo_inicio

        # Obtener perfil para respuesta
        perfil = perfil_adapter.obtener_perfil(estudiante_id)
        if not perfil:
            perfil = perfil_adapter.obtener_perfil_default()

        return {
            "success": len(todos_ejercicios) > 0,
            "mensaje": f"{len(todos_ejercicios)} ejercicios generados de {len(tipos)} tipos",
            "estudiante_id": estudiante_id,
            "curso": CursoEnum.VERBAL.value,
            "cantidad_solicitada": total_solicitado,
            "cantidad_generada": len(todos_ejercicios),
            "ejercicios_matematicas": None,
            "ejercicios_verbales": todos_ejercicios,
            "perfil_usado": self._preparar_perfil_respuesta(perfil),
            "nivel_determinado": prompt_builder.determinar_nivel_desde_perfil(perfil, "verbal"),
            "tiempo_generacion_segundos": round(tiempo_total, 2)
        }


# Singleton
generador_verbal = GeneradorVerbal()


if __name__ == "__main__":
    # Test del GeneradorVerbal
    print("=" * 70)
    print("TEST: GeneradorVerbal")
    print("=" * 70)

    # Estudiante de ejemplo
    estudiante_test = "EST001"

    try:
        # Test 1: Generar 3 ejercicios simples
        print("\n🧪 Test 1: Generar 3 ejercicios de sinónimos (nivel automático)")
        resultado = generador_verbal.generar_ejercicios(
            estudiante_id=estudiante_test,
            cantidad=3,
            tipo_especifico="sinonimos"
        )

        print(f"\n✅ Resultado:")
        print(f"  - Éxito: {resultado['success']}")
        print(f"  - Mensaje: {resultado['mensaje']}")
        print(f"  - Cantidad generada: {resultado['cantidad_generada']}")
        print(f"  - Nivel determinado: {resultado['nivel_determinado']}")
        print(f"  - Tiempo: {resultado['tiempo_generacion_segundos']}s")

        # Mostrar primer ejercicio
        if resultado["ejercicios_verbales"]:
            primer_ejercicio = resultado["ejercicios_verbales"][0]
            print(f"\n📝 Primer ejercicio generado:")
            print(f"  ID: {primer_ejercicio.id}")
            print(f"  Título: {primer_ejercicio.titulo}")
            print(f"  Enunciado: {primer_ejercicio.enunciado}")
            print(f"  Opciones: {len(primer_ejercicio.opciones)}")
            print(f"  Respuesta correcta: {primer_ejercicio.respuesta_correcta}")
            print(f"  Nivel: {primer_ejercicio.nivel}")
            print(f"  Tipo: {primer_ejercicio.tipo}")
            print(f"  Palabra clave: {primer_ejercicio.palabra_clave}")

        print("\n" + "=" * 70)
        print("✅ GeneradorVerbal funcionando correctamente")
        print("=" * 70)

    except Exception as e:
        print(f"\n❌ Error en test: {str(e)}")
        import traceback
        traceback.print_exc()
