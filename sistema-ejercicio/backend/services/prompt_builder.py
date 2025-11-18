"""
PromptBuilder - Carga y formatea templates de prompts para Gemini
Reemplaza variables con datos del perfil del estudiante
"""

from pathlib import Path
from typing import Dict, Optional
import os


class PromptBuilder:
    """
    Construye prompts personalizados a partir de templates
    """

    def __init__(self, prompts_dir: Optional[Path] = None):
        """
        Inicializa el PromptBuilder

        Args:
            prompts_dir: Directorio donde están los prompts (default: generador-ejercicios/prompts/)
        """
        if prompts_dir:
            self.prompts_dir = Path(prompts_dir)
        else:
            # Ruta relativa desde este archivo
            current_dir = Path(__file__).parent.parent
            self.prompts_dir = current_dir / "prompts"

        # Verificar que el directorio existe
        if not self.prompts_dir.exists():
            raise FileNotFoundError(f"Directorio de prompts no encontrado: {self.prompts_dir}")

    def cargar_template(self, curso: str, nivel: str) -> str:
        """
        Carga un template de prompt desde el archivo

        Args:
            curso: "matematicas" o "verbal"
            nivel: "basico", "intermedio", o "avanzado"

        Returns:
            Contenido del template como string

        Raises:
            FileNotFoundError: Si el template no existe
        """
        # Construir ruta del archivo
        template_path = self.prompts_dir / curso / f"{nivel}.txt"

        if not template_path.exists():
            raise FileNotFoundError(
                f"Template no encontrado: {template_path}\n"
                f"Curso: {curso}, Nivel: {nivel}"
            )

        # Leer el template
        with open(template_path, 'r', encoding='utf-8') as f:
            return f.read()

    def construir_prompt_matematicas(
        self,
        nivel: str,
        cantidad: int,
        tipo_ejercicio: str,
        perfil: Dict
    ) -> str:
        """
        Construye un prompt de matemáticas personalizado

        Args:
            nivel: "basico", "intermedio", o "avanzado"
            cantidad: Número de ejercicios a generar
            tipo_ejercicio: Tipo específico (suma, resta, multiplicacion, etc.)
            perfil: Diccionario con datos del perfil del estudiante

        Returns:
            Prompt completo listo para enviar a Gemini
        """
        # Cargar template
        template = self.cargar_template("matematicas", nivel)

        # Extraer información del perfil con valores por defecto
        nivel_matematicas = perfil.get('nivel_matematicas', 'intermedio')
        estilo_aprendizaje = perfil.get('estilo_aprendizaje', 'visual')
        velocidad_lectura = perfil.get('velocidad_lectura', 'promedio')
        areas_interes = perfil.get('areas_interes_texto', 'ciencias, naturaleza')

        # Determinar contexto preferido basado en áreas de interés
        contexto_preferido = self._determinar_contexto(
            perfil.get('areas_interes_texto', ''),
            curso="matematicas"
        )

        # Reemplazar variables en el template
        prompt = template.format(
            cantidad=cantidad,
            tipo_ejercicio=tipo_ejercicio,
            nivel_matematicas=nivel_matematicas,
            estilo_aprendizaje=estilo_aprendizaje,
            velocidad_lectura=velocidad_lectura,
            areas_interes=areas_interes,
            contexto_preferido=contexto_preferido
        )

        return prompt

    def construir_prompt_verbal(
        self,
        nivel: str,
        cantidad: int,
        tipo_ejercicio: str,
        perfil: Dict
    ) -> str:
        """
        Construye un prompt de razonamiento verbal personalizado

        Args:
            nivel: "basico", "intermedio", o "avanzado"
            cantidad: Número de ejercicios a generar
            tipo_ejercicio: Tipo específico (sinonimos, antonimos, analogias, etc.)
            perfil: Diccionario con datos del perfil del estudiante

        Returns:
            Prompt completo listo para enviar a Gemini
        """
        # Cargar template
        template = self.cargar_template("verbal", nivel)

        # Extraer información del perfil con valores por defecto
        nivel_lectura = perfil.get('nivel_lectura', 'desarrollado')
        estilo_aprendizaje = perfil.get('estilo_aprendizaje', 'visual')
        velocidad_lectura = perfil.get('velocidad_lectura', 'promedio')
        areas_interes = perfil.get('areas_interes_texto', 'lectura, ciencias')

        # Determinar contexto preferido
        contexto_preferido = self._determinar_contexto(
            perfil.get('areas_interes_texto', ''),
            curso="verbal"
        )

        # Reemplazar variables en el template
        prompt = template.format(
            cantidad=cantidad,
            tipo_ejercicio=tipo_ejercicio,
            nivel_lectura=nivel_lectura,
            estilo_aprendizaje=estilo_aprendizaje,
            velocidad_lectura=velocidad_lectura,
            areas_interes=areas_interes,
            contexto_preferido=contexto_preferido
        )

        return prompt

    def _determinar_contexto(self, areas_interes: str, curso: str) -> str:
        """
        Determina el contexto preferido basado en áreas de interés

        Args:
            areas_interes: String con áreas de interés del estudiante
            curso: "matematicas" o "verbal"

        Returns:
            Contexto apropiado (mercado, escuela, hogar, naturaleza, deportes)
        """
        areas_lower = areas_interes.lower()

        # Mapeo de palabras clave a contextos
        if any(word in areas_lower for word in ['deporte', 'fútbol', 'juego', 'correr']):
            return 'deportes'
        elif any(word in areas_lower for word in ['naturaleza', 'animal', 'planta', 'ciencia']):
            return 'naturaleza'
        elif any(word in areas_lower for word in ['familia', 'casa', 'cocina', 'comida']):
            return 'hogar'
        elif any(word in areas_lower for word in ['compra', 'dinero', 'venta', 'tienda']):
            return 'mercado'
        else:
            # Default: escuela
            return 'escuela'

    def determinar_nivel_desde_perfil(self, perfil: Dict, curso: str) -> str:
        """
        Determina el nivel (básico/intermedio/avanzado) basado en el perfil

        Args:
            perfil: Diccionario con datos del perfil
            curso: "matematicas" o "verbal"

        Returns:
            "basico", "intermedio", o "avanzado"
        """
        if curso == "matematicas":
            nivel_matematicas = perfil.get('nivel_matematicas', 'intermedio')
            grado = perfil.get('grado', '3-4')

            # Lógica de determinación
            if nivel_matematicas in ['basico', 'en_desarrollo'] or grado in ['1-2']:
                return 'basico'
            elif nivel_matematicas == 'avanzado' or grado in ['5-6']:
                return 'avanzado'
            else:
                return 'intermedio'

        else:  # verbal
            nivel_lectura = perfil.get('nivel_lectura', 'desarrollado')
            grado = perfil.get('grado', '3-4')

            if nivel_lectura in ['inicial', 'en_desarrollo'] or grado in ['1-2']:
                return 'basico'
            elif nivel_lectura == 'avanzado' or grado in ['5-6']:
                return 'avanzado'
            else:
                return 'intermedio'

    def verificar_templates_disponibles(self) -> Dict[str, list]:
        """
        Verifica qué templates están disponibles

        Returns:
            Diccionario con cursos y niveles disponibles
        """
        disponibles = {
            "matematicas": [],
            "verbal": []
        }

        for curso in ["matematicas", "verbal"]:
            curso_dir = self.prompts_dir / curso
            if curso_dir.exists():
                for nivel in ["basico", "intermedio", "avanzado"]:
                    template_file = curso_dir / f"{nivel}.txt"
                    if template_file.exists():
                        disponibles[curso].append(nivel)

        return disponibles


# Singleton para uso global
prompt_builder = PromptBuilder()


# Función de conveniencia
def construir_prompt(
    curso: str,
    nivel: str,
    cantidad: int,
    tipo_ejercicio: str,
    perfil: Dict
) -> str:
    """
    Función de conveniencia para construir prompts

    Args:
        curso: "matematicas" o "verbal"
        nivel: "basico", "intermedio", o "avanzado"
        cantidad: Número de ejercicios
        tipo_ejercicio: Tipo específico de ejercicio
        perfil: Perfil del estudiante

    Returns:
        Prompt formateado listo para Gemini
    """
    if curso == "matematicas":
        return prompt_builder.construir_prompt_matematicas(
            nivel=nivel,
            cantidad=cantidad,
            tipo_ejercicio=tipo_ejercicio,
            perfil=perfil
        )
    elif curso == "verbal":
        return prompt_builder.construir_prompt_verbal(
            nivel=nivel,
            cantidad=cantidad,
            tipo_ejercicio=tipo_ejercicio,
            perfil=perfil
        )
    else:
        raise ValueError(f"Curso inválido: {curso}. Debe ser 'matematicas' o 'verbal'")


if __name__ == "__main__":
    # Test del PromptBuilder
    print("=" * 60)
    print("TEST: PromptBuilder")
    print("=" * 60)

    # Verificar templates disponibles
    builder = PromptBuilder()
    disponibles = builder.verificar_templates_disponibles()
    print(f"\n✓ Templates disponibles:")
    for curso, niveles in disponibles.items():
        print(f"  - {curso}: {', '.join(niveles)}")

    # Perfil de ejemplo
    perfil_ejemplo = {
        'estudiante_id': 'EST001',
        'grado': '3-4',
        'nivel_matematicas': 'intermedio',
        'nivel_lectura': 'desarrollado',
        'estilo_aprendizaje': 'visual',
        'velocidad_lectura': 'promedio',
        'areas_interes_texto': 'naturaleza, animales, ciencias'
    }

    # Construir un prompt de matemáticas
    print("\n✓ Construyendo prompt de matemáticas (intermedio, suma)...")
    prompt_mate = builder.construir_prompt_matematicas(
        nivel='intermedio',
        cantidad=3,
        tipo_ejercicio='suma',
        perfil=perfil_ejemplo
    )
    print(f"  Longitud del prompt: {len(prompt_mate)} caracteres")
    print(f"  Primeras 200 caracteres: {prompt_mate[:200]}...")

    # Construir un prompt verbal
    print("\n✓ Construyendo prompt verbal (intermedio, sinonimos)...")
    prompt_verbal = builder.construir_prompt_verbal(
        nivel='intermedio',
        cantidad=3,
        tipo_ejercicio='sinonimos',
        perfil=perfil_ejemplo
    )
    print(f"  Longitud del prompt: {len(prompt_verbal)} caracteres")
    print(f"  Primeras 200 caracteres: {prompt_verbal[:200]}...")

    # Determinar nivel desde perfil
    print("\n✓ Determinación de nivel:")
    nivel_mate = builder.determinar_nivel_desde_perfil(perfil_ejemplo, 'matematicas')
    nivel_verbal = builder.determinar_nivel_desde_perfil(perfil_ejemplo, 'verbal')
    print(f"  Nivel matemáticas: {nivel_mate}")
    print(f"  Nivel verbal: {nivel_verbal}")

    print("\n" + "=" * 60)
    print("✅ PromptBuilder funcionando correctamente")
    print("=" * 60)
