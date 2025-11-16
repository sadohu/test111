"""
Sistema de Clasificación de Perfiles para Estudiantes de Primaria
Basado en formularios diferenciados por grado y evaluaciones diagnósticas

Autor: Sistema de IA Educativa
Fecha: 2025
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime
import json


@dataclass
class PerfilEstudiante:
    """Clase que representa el perfil completo de un estudiante"""

    # Identificación
    estudiante_id: str
    grado: str  # '1-2', '3-4', '5-6'
    fecha_creacion: datetime = field(default_factory=datetime.now)
    ultima_actualizacion: datetime = field(default_factory=datetime.now)

    # Datos del formulario inicial
    estilo_aprendizaje: Optional[str] = None  # 'visual', 'auditivo', 'kinestesico', 'multimodal'
    velocidad: Optional[str] = None  # 'rapido', 'moderado', 'pausado'
    atencion: Optional[str] = None  # 'alta', 'media', 'baja'
    interes: Optional[str] = None  # 'artistico', 'deportivo', 'cientifico', 'literario', 'social', 'matematico'
    nivel_matematicas: Optional[str] = None  # 'avanzado', 'intermedio', 'basico'
    nivel_lectura: Optional[str] = None  # 'experto', 'desarrollado', 'inicial'
    motivacion: Optional[str] = None  # 'alta', 'media', 'baja'
    frustracion: Optional[str] = None  # 'resiliente', 'intermedio', 'sensible'
    trabajo: Optional[str] = None  # 'independiente', 'colaborativo', 'guiado'
    energia: Optional[str] = None  # 'matutino', 'vespertino', 'flexible'

    # Resultados calculados
    nivel_riesgo: Optional[str] = None  # 'bajo', 'medio', 'alto'
    recomendaciones: List[str] = field(default_factory=list)
    categoria_principal: Optional[str] = None
    confianza_perfil: int = 60  # 0-100

    def to_dict(self) -> Dict:
        """Convierte el perfil a diccionario"""
        return {
            'estudiante_id': self.estudiante_id,
            'grado': self.grado,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'ultima_actualizacion': self.ultima_actualizacion.isoformat(),
            'estilo_aprendizaje': self.estilo_aprendizaje,
            'velocidad': self.velocidad,
            'atencion': self.atencion,
            'interes': self.interes,
            'nivel_matematicas': self.nivel_matematicas,
            'nivel_lectura': self.nivel_lectura,
            'motivacion': self.motivacion,
            'frustracion': self.frustracion,
            'trabajo': self.trabajo,
            'energia': self.energia,
            'nivel_riesgo': self.nivel_riesgo,
            'recomendaciones': self.recomendaciones,
            'categoria_principal': self.categoria_principal,
            'confianza_perfil': self.confianza_perfil
        }


class SistemaClasificacionPerfiles:
    """
    Sistema principal de clasificación de perfiles estudiantiles
    Implementa el algoritmo híbrido de clasificación
    """

    def __init__(self):
        self.categorias = {
            'estilo_aprendizaje': ['visual', 'auditivo', 'kinestesico', 'multimodal'],
            'velocidad': ['rapido', 'moderado', 'pausado'],
            'atencion': ['alta', 'media', 'baja'],
            'interes': ['artistico', 'deportivo', 'cientifico', 'literario', 'social', 'matematico'],
            'nivel_matematicas': ['avanzado', 'intermedio', 'basico'],
            'nivel_lectura': ['experto', 'desarrollado', 'inicial'],
            'motivacion': ['alta', 'media', 'baja'],
            'frustracion': ['resiliente', 'intermedio', 'sensible'],
            'trabajo': ['independiente', 'colaborativo', 'guiado'],
            'energia': ['matutino', 'vespertino', 'flexible']
        }

        # Mapeo de respuestas del formulario a valores de perfil
        self._inicializar_mapeos()

    def _inicializar_mapeos(self):
        """Inicializa los mapeos de respuestas a categorías"""

        # Mapeo común para todos los grados (puede variar ligeramente)
        self.mapeo_base = {
            'P1': {  # Estilo de aprendizaje
                'A': 'visual',
                'B': 'auditivo',
                'C': 'kinestesico',
                'D': 'multimodal'  # Solo 3ro-4to y 5to-6to
            },
            'P2': {  # Velocidad
                'A': 'rapido',
                'B': 'pausado',
                'C': 'moderado'
            },
            'P3': {  # Atención
                'A': 'alta',
                'B': 'media',
                'C': 'baja'
            },
            'P4': {  # Interés (varía por grado)
                'A': 'artistico',
                'B': 'deportivo',
                'C': 'literario',  # Para 1-2
                'D': 'literario',   # Para 3-4 y 5-6
                'E': 'social',      # Para 3-4 y 5-6
                'F': 'matematico'   # Solo 5to-6to
            },
            'P5': {  # Nivel matemáticas
                'A': 'avanzado',
                'B': 'intermedio',
                'C': 'basico'
            },
            'P6': {  # Nivel lectura
                'A': 'experto',
                'B': 'desarrollado',
                'C': 'inicial'
            },
            'P7': {  # Motivación
                'A': 'alta',
                'B': 'media',
                'C': 'baja'
            },
            'P8': {  # Frustración
                'A': 'resiliente',
                'B': 'sensible',
                'C': 'intermedio'
            },
            'P9': {  # Trabajo
                'A': 'independiente',
                'B': 'colaborativo',
                'C': 'guiado'
            },
            'P10': {  # Energía
                'A': 'matutino',
                'B': 'vespertino',
                'C': 'flexible'
            }
        }

        # Ajuste especial para P4 según grado
        self.mapeo_interes_por_grado = {
            '1-2': {
                'A': 'artistico',
                'B': 'deportivo',
                'C': 'literario'
            },
            '3-4': {
                'A': 'artistico',
                'B': 'deportivo',
                'C': 'cientifico',
                'D': 'literario',
                'E': 'social'
            },
            '5-6': {
                'A': 'artistico',
                'B': 'deportivo',
                'C': 'cientifico',
                'D': 'literario',
                'E': 'social',
                'F': 'matematico'
            }
        }

    def clasificar_respuestas(self, respuestas: Dict[str, str], grado: str,
                            estudiante_id: str) -> PerfilEstudiante:
        """
        Clasifica las respuestas del formulario y genera perfil inicial

        Args:
            respuestas: Dict con keys 'P1', 'P2', ... 'P10' y values 'A', 'B', 'C'...
            grado: '1-2', '3-4', o '5-6'
            estudiante_id: ID único del estudiante

        Returns:
            PerfilEstudiante con el perfil completo inicial

        Raises:
            ValueError: Si el grado no es válido o faltan respuestas
        """

        # Validar grado
        if grado not in ['1-2', '3-4', '5-6']:
            raise ValueError(f"Grado inválido: {grado}. Debe ser '1-2', '3-4' o '5-6'")

        # Validar que tengamos las 10 respuestas
        preguntas_esperadas = {f'P{i}' for i in range(1, 11)}
        preguntas_recibidas = set(respuestas.keys())

        if not preguntas_esperadas.issubset(preguntas_recibidas):
            faltantes = preguntas_esperadas - preguntas_recibidas
            raise ValueError(f"Faltan respuestas para: {faltantes}")

        # Crear perfil inicial
        perfil = PerfilEstudiante(
            estudiante_id=estudiante_id,
            grado=grado
        )

        # Mapear respuestas a valores de perfil
        perfil.estilo_aprendizaje = self.mapeo_base['P1'].get(respuestas['P1'])
        perfil.velocidad = self.mapeo_base['P2'].get(respuestas['P2'])
        perfil.atencion = self.mapeo_base['P3'].get(respuestas['P3'])

        # Interés (depende del grado)
        perfil.interes = self.mapeo_interes_por_grado[grado].get(respuestas['P4'])

        perfil.nivel_matematicas = self.mapeo_base['P5'].get(respuestas['P5'])
        perfil.nivel_lectura = self.mapeo_base['P6'].get(respuestas['P6'])
        perfil.motivacion = self.mapeo_base['P7'].get(respuestas['P7'])
        perfil.frustracion = self.mapeo_base['P8'].get(respuestas['P8'])
        perfil.trabajo = self.mapeo_base['P9'].get(respuestas['P9'])
        perfil.energia = self.mapeo_base['P10'].get(respuestas['P10'])

        # Calcular nivel de riesgo académico
        perfil.nivel_riesgo = self._calcular_riesgo(perfil)

        # Generar recomendaciones pedagógicas
        perfil.recomendaciones = self._generar_recomendaciones(perfil)

        # Asignar categoría principal
        perfil.categoria_principal = self._asignar_categoria(perfil)

        return perfil

    def _calcular_riesgo(self, perfil: PerfilEstudiante) -> str:
        """
        Calcula nivel de riesgo académico basado en el perfil

        Sistema de puntuación:
        - Factores de riesgo alto: +3 puntos
        - Factores de riesgo medio: +2 puntos
        - Factores de riesgo bajo: +1 punto
        - Factores protectores: -2 puntos

        Clasificación:
        - >= 7 puntos: ALTO riesgo
        - >= 3 puntos: MEDIO riesgo
        - < 3 puntos: BAJO riesgo

        Returns:
            'bajo', 'medio', 'alto'
        """
        puntos_riesgo = 0

        # FACTORES DE RIESGO ALTO (+3 puntos cada uno)
        if perfil.nivel_matematicas == 'basico':
            puntos_riesgo += 3

        if perfil.nivel_lectura == 'inicial':
            puntos_riesgo += 3

        if perfil.motivacion == 'baja':
            puntos_riesgo += 3

        # FACTORES DE RIESGO MEDIO (+2 puntos)
        if perfil.atencion == 'baja':
            puntos_riesgo += 2

        if perfil.frustracion == 'sensible':
            puntos_riesgo += 2

        # FACTORES DE RIESGO BAJO (+1 punto)
        if perfil.trabajo == 'guiado':
            puntos_riesgo += 1

        if perfil.velocidad == 'pausado':
            puntos_riesgo += 1

        # FACTORES PROTECTORES (-2 puntos)
        if perfil.motivacion == 'alta':
            puntos_riesgo -= 2

        if perfil.frustracion == 'resiliente':
            puntos_riesgo -= 2

        if perfil.nivel_matematicas == 'avanzado':
            puntos_riesgo -= 1

        if perfil.nivel_lectura == 'experto':
            puntos_riesgo -= 1

        # Clasificación final
        if puntos_riesgo >= 7:
            return 'alto'
        elif puntos_riesgo >= 3:
            return 'medio'
        else:
            return 'bajo'

    def _generar_recomendaciones(self, perfil: PerfilEstudiante) -> List[str]:
        """
        Genera recomendaciones pedagógicas específicas basadas en el perfil

        Returns:
            Lista de recomendaciones personalizadas
        """
        recomendaciones = []

        # Por estilo de aprendizaje
        if perfil.estilo_aprendizaje == 'visual':
            recomendaciones.append("📊 Usar organizadores visuales, mapas mentales, diagramas y videos educativos")
        elif perfil.estilo_aprendizaje == 'auditivo':
            recomendaciones.append("🎧 Proporcionar explicaciones verbales, discusiones, podcasts y audiolibros")
        elif perfil.estilo_aprendizaje == 'kinestesico':
            recomendaciones.append("✋ Incluir actividades prácticas, experimentos, manipulativos y aprendizaje por acción")
        elif perfil.estilo_aprendizaje == 'multimodal':
            recomendaciones.append("🔄 Combinar múltiples modalidades: visual, auditivo y kinestésico")

        # Por nivel de atención
        if perfil.atencion == 'baja':
            recomendaciones.append("⏱️ Diseñar sesiones cortas de 10-15 minutos con pausas activas frecuentes")
        elif perfil.atencion == 'media':
            recomendaciones.append("⏰ Organizar bloques de 20-25 minutos con descansos estructurados")
        else:  # alta
            recomendaciones.append("⭐ Aprovechar su alta concentración con proyectos más extensos y complejos")

        # Por nivel académico - Matemáticas
        if perfil.nivel_matematicas == 'basico':
            recomendaciones.append("🔢 URGENTE: Refuerzo intensivo en operaciones básicas con material concreto y juegos matemáticos")
        elif perfil.nivel_matematicas == 'intermedio':
            recomendaciones.append("📐 Consolidar operaciones básicas y gradualmente introducir problemas más complejos")
        else:  # avanzado
            recomendaciones.append("🏆 Proporcionar desafíos matemáticos avanzados y olimpiadas")

        # Por nivel académico - Lectura
        if perfil.nivel_lectura == 'inicial':
            recomendaciones.append("📚 URGENTE: Lectura guiada diaria con textos de su interés, fluidez y comprensión")
        elif perfil.nivel_lectura == 'desarrollado':
            recomendaciones.append("📖 Incrementar complejidad de textos y trabajar inferencias y análisis")
        else:  # experto
            recomendaciones.append("📕 Fomentar lectura crítica, análisis literario y escritura creativa")

        # Por motivación
        if perfil.motivacion == 'baja':
            recomendaciones.append("🎮 CRÍTICO: Usar gamificación intensiva y conectar TODO el contenido con sus intereses personales")
        elif perfil.motivacion == 'media':
            recomendaciones.append("😊 Variar actividades y conectar aprendizaje con situaciones de la vida real")
        else:  # alta
            recomendaciones.append("🌟 Nutrir su curiosidad natural con proyectos de investigación independiente")

        # Por manejo de frustración
        if perfil.frustracion == 'sensible':
            recomendaciones.append("💙 Proporcionar refuerzo positivo CONSTANTE, celebrar pequeños logros, evitar comparaciones")
        elif perfil.frustracion == 'intermedio':
            recomendaciones.append("🤔 Ofrecer apoyo cuando se frustre y enseñar estrategias de afrontamiento")
        else:  # resiliente
            recomendaciones.append("💪 Aprovechar su resiliencia con desafíos progresivos y aprendizaje por ensayo-error")

        # Por preferencia de trabajo
        if perfil.trabajo == 'independiente':
            recomendaciones.append("🧑 Proporcionar autonomía con proyectos autodirigidos y opciones de elección")
        elif perfil.trabajo == 'colaborativo':
            recomendaciones.append("👥 Facilitar trabajo en equipo, proyectos grupales y aprendizaje entre pares")
        else:  # guiado
            recomendaciones.append("👨‍🏫 Proporcionar instrucciones claras, paso a paso, con supervisión cercana")

        # Por área de interés (enriquecer con su pasión)
        if perfil.interes:
            intereses_map = {
                'artistico': '🎨 Integrar arte, música, dibujo y expresión creativa en todas las áreas',
                'deportivo': '⚽ Incorporar movimiento, juegos físicos y competencias deportivas al aprendizaje',
                'cientifico': '🔬 Incluir experimentos, indagación científica y descubrimiento',
                'literario': '📚 Fomentar lectura, escritura creativa y narrativas',
                'social': '🤝 Promover trabajo colaborativo, empatía y proyectos comunitarios',
                'matematico': '🔢 Enriquecer con retos lógicos, patrones y razonamiento abstracto'
            }
            if perfil.interes in intereses_map:
                recomendaciones.append(intereses_map[perfil.interes])

        # Por horario de energía (opcional pero útil)
        if perfil.energia == 'matutino':
            recomendaciones.append("🌅 Programar actividades más demandantes en las mañanas")
        elif perfil.energia == 'vespertino':
            recomendaciones.append("🌆 Reservar tareas complejas para después del mediodía")

        # Recomendación por nivel de riesgo general
        if perfil.nivel_riesgo == 'alto':
            recomendaciones.append("🚨 ALERTA: Estudiante de ALTO RIESGO - Requiere intervención inmediata, posible tutoría individual y seguimiento semanal")
        elif perfil.nivel_riesgo == 'medio':
            recomendaciones.append("⚠️ Estudiante en riesgo moderado - Monitoreo quincenal y apoyo adicional en áreas débiles")

        return recomendaciones

    def _asignar_categoria(self, perfil: PerfilEstudiante) -> str:
        """
        Asigna una categoría principal descriptiva al perfil

        Ejemplos: "El Artista Resiliente", "El Científico Pausado", etc.

        Returns:
            Nombre de categoría descriptivo
        """

        # Componente 1: Área de interés (principal)
        interes_nombres = {
            'artistico': 'Artista',
            'deportivo': 'Deportista',
            'cientifico': 'Científico',
            'literario': 'Lector',
            'social': 'Social',
            'matematico': 'Matemático'
        }
        componente_interes = interes_nombres.get(perfil.interes, 'Estudiante')

        # Componente 2: Característica dominante
        caracteristicas = []

        if perfil.frustracion == 'resiliente':
            caracteristicas.append('Resiliente')
        elif perfil.frustracion == 'sensible':
            caracteristicas.append('Sensible')

        if perfil.motivacion == 'alta':
            caracteristicas.append('Motivado')
        elif perfil.motivacion == 'baja':
            caracteristicas.append('Desmotivado')

        if perfil.velocidad == 'rapido':
            caracteristicas.append('Rápido')
        elif perfil.velocidad == 'pausado':
            caracteristicas.append('Pausado')

        if perfil.atencion == 'baja':
            caracteristicas.append('Impulsivo')
        elif perfil.atencion == 'alta':
            caracteristicas.append('Concentrado')

        if perfil.trabajo == 'independiente':
            caracteristicas.append('Independiente')
        elif perfil.trabajo == 'colaborativo':
            caracteristicas.append('Colaborativo')
        elif perfil.trabajo == 'guiado':
            caracteristicas.append('Guiado')

        # Elegir la característica más relevante
        componente_caracteristica = caracteristicas[0] if caracteristicas else ''

        # Construir el nombre
        if componente_caracteristica:
            return f"El {componente_interes} {componente_caracteristica}"
        else:
            return f"El {componente_interes}"

    def validar_respuesta(self, pregunta: str, respuesta: str, grado: str) -> bool:
        """
        Valida que una respuesta sea válida para una pregunta y grado dados

        Args:
            pregunta: 'P1', 'P2', ... 'P10'
            respuesta: 'A', 'B', 'C', 'D', 'E', 'F'
            grado: '1-2', '3-4', '5-6'

        Returns:
            True si la respuesta es válida, False si no
        """

        # Validaciones especiales por grado
        opciones_validas_por_grado = {
            '1-2': {
                'P1': ['A', 'B', 'C'],
                'P2': ['A', 'B', 'C'],
                'P3': ['A', 'B', 'C'],
                'P4': ['A', 'B', 'C'],
                'P5': ['A', 'B', 'C'],
                'P6': ['A', 'B', 'C'],
                'P7': ['A', 'B', 'C'],
                'P8': ['A', 'B', 'C'],
                'P9': ['A', 'B', 'C'],
                'P10': ['A', 'B', 'C']
            },
            '3-4': {
                'P1': ['A', 'B', 'C', 'D'],
                'P2': ['A', 'B', 'C'],
                'P3': ['A', 'B', 'C'],
                'P4': ['A', 'B', 'C', 'D', 'E'],
                'P5': ['A', 'B', 'C'],
                'P6': ['A', 'B', 'C'],
                'P7': ['A', 'B', 'C'],
                'P8': ['A', 'B', 'C'],
                'P9': ['A', 'B', 'C'],
                'P10': ['A', 'B', 'C']
            },
            '5-6': {
                'P1': ['A', 'B', 'C', 'D'],
                'P2': ['A', 'B', 'C'],
                'P3': ['A', 'B', 'C'],
                'P4': ['A', 'B', 'C', 'D', 'E', 'F'],
                'P5': ['A', 'B', 'C'],
                'P6': ['A', 'B', 'C'],
                'P7': ['A', 'B', 'C'],
                'P8': ['A', 'B', 'C'],
                'P9': ['A', 'B', 'C'],
                'P10': ['A', 'B', 'C']
            }
        }

        if grado not in opciones_validas_por_grado:
            return False

        if pregunta not in opciones_validas_por_grado[grado]:
            return False

        return respuesta in opciones_validas_por_grado[grado][pregunta]


def ejemplo_uso():
    """
    Función de ejemplo que muestra cómo usar el sistema de clasificación
    """

    print("=" * 80)
    print("SISTEMA DE CLASIFICACIÓN DE PERFILES - EJEMPLO DE USO")
    print("=" * 80)
    print()

    # Inicializar el sistema
    sistema = SistemaClasificacionPerfiles()

    # EJEMPLO 1: Estudiante de 1ro-2do grado (Alto Riesgo)
    print("📝 EJEMPLO 1: Estudiante de 1ro-2do grado")
    print("-" * 80)

    respuestas_ejemplo1 = {
        'P1': 'A',  # Visual
        'P2': 'C',  # Moderado
        'P3': 'B',  # Atención media
        'P4': 'C',  # Le gusta escuchar cuentos (literario)
        'P5': 'C',  # Matemáticas difíciles (básico)
        'P6': 'C',  # Necesita ayuda para leer (inicial)
        'P7': 'B',  # Motivación media
        'P8': 'B',  # Sensible a frustración
        'P9': 'C',  # Prefiere ayuda de profesora (guiado)
        'P10': 'A'  # Matutino
    }

    perfil1 = sistema.clasificar_respuestas(respuestas_ejemplo1, grado='1-2', estudiante_id='EST001')

    print(f"Estudiante ID: {perfil1.estudiante_id}")
    print(f"Categoría: {perfil1.categoria_principal}")
    print(f"Nivel de Riesgo: {perfil1.nivel_riesgo.upper()}")
    print(f"\nCaracterísticas:")
    print(f"  - Estilo: {perfil1.estilo_aprendizaje}")
    print(f"  - Velocidad: {perfil1.velocidad}")
    print(f"  - Atención: {perfil1.atencion}")
    print(f"  - Interés: {perfil1.interes}")
    print(f"  - Matemáticas: {perfil1.nivel_matematicas}")
    print(f"  - Lectura: {perfil1.nivel_lectura}")
    print(f"\nRecomendaciones:")
    for i, rec in enumerate(perfil1.recomendaciones, 1):
        print(f"  {i}. {rec}")

    print("\n")

    # EJEMPLO 2: Estudiante de 5to-6to grado (Bajo Riesgo)
    print("📝 EJEMPLO 2: Estudiante de 5to-6to grado")
    print("-" * 80)

    respuestas_ejemplo2 = {
        'P1': 'B',  # Auditivo
        'P2': 'A',  # Rápido
        'P3': 'A',  # Alta atención
        'P4': 'D',  # Literario
        'P5': 'A',  # Matemáticas avanzado
        'P6': 'A',  # Lectura experto
        'P7': 'A',  # Alta motivación
        'P8': 'A',  # Resiliente
        'P9': 'A',  # Independiente
        'P10': 'A'  # Matutino
    }

    perfil2 = sistema.clasificar_respuestas(respuestas_ejemplo2, grado='5-6', estudiante_id='EST002')

    print(f"Estudiante ID: {perfil2.estudiante_id}")
    print(f"Categoría: {perfil2.categoria_principal}")
    print(f"Nivel de Riesgo: {perfil2.nivel_riesgo.upper()}")
    print(f"\nCaracterísticas:")
    print(f"  - Estilo: {perfil2.estilo_aprendizaje}")
    print(f"  - Velocidad: {perfil2.velocidad}")
    print(f"  - Atención: {perfil2.atencion}")
    print(f"  - Interés: {perfil2.interes}")
    print(f"  - Matemáticas: {perfil2.nivel_matematicas}")
    print(f"  - Lectura: {perfil2.nivel_lectura}")
    print(f"\nRecomendaciones:")
    for i, rec in enumerate(perfil2.recomendaciones, 1):
        print(f"  {i}. {rec}")

    print("\n")

    # Guardar perfil como JSON
    print("=" * 80)
    print("Exportando perfil a JSON...")
    print("=" * 80)
    perfil_json = json.dumps(perfil2.to_dict(), indent=2, ensure_ascii=False)
    print(perfil_json)


if __name__ == "__main__":
    ejemplo_uso()
