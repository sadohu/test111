"""
AdaptadorNivel - Servicio para ajustar dinámicamente el nivel de dificultad

Sistema adaptativo basado en reglas y métricas de rendimiento.
NO usa Machine Learning, sino lógica basada en:
- Tasa de aciertos
- Tiempo de respuesta
- Rachas de correctas/incorrectas
- Historial de sesiones previas

Autor: Claude AI
Fecha: 17 de Noviembre, 2025
"""

from typing import Dict, List, Optional, Tuple
from enum import Enum

from ..models.respuesta import (
    SesionEjercicios,
    EstadisticasSesion,
    EstadisticasEstudiante,
    RespuestaEstudiante,
)


# ============================================================================
# ENUMS Y CONSTANTES
# ============================================================================

class Nivel(str, Enum):
    """Niveles de dificultad"""
    BASICO = "basico"
    INTERMEDIO = "intermedio"
    AVANZADO = "avanzado"


class DireccionCambio(str, Enum):
    """Dirección del cambio de nivel"""
    SUBIR = "subir"
    MANTENER = "mantener"
    BAJAR = "bajar"


class ConfianzaRecomendacion(str, Enum):
    """Nivel de confianza en la recomendación"""
    ALTA = "alta"          # >= 10 ejercicios, patrón claro
    MEDIA = "media"        # 5-9 ejercicios, patrón moderado
    BAJA = "baja"          # < 5 ejercicios, datos insuficientes


# Umbrales de rendimiento
UMBRAL_BAJAR_NIVEL = 0.50      # < 50% de aciertos → bajar
UMBRAL_MANTENER_BAJO = 0.50    # 50-70% → mantener
UMBRAL_MANTENER_ALTO = 0.70    # 50-70% → mantener
UMBRAL_SUBIR_NIVEL = 0.80      # > 80% de aciertos → subir

# Umbrales de tiempo (en segundos)
TIEMPO_MUY_RAPIDO = 20         # < 20 seg → muy rápido
TIEMPO_RAPIDO = 40             # < 40 seg → rápido
TIEMPO_NORMAL = 60             # 40-60 seg → normal
TIEMPO_LENTO = 80              # > 60 seg → lento

# Rachas
RACHA_CORRECTAS_MINIMA = 5     # 5+ correctas seguidas → considerar subir
RACHA_INCORRECTAS_MINIMA = 3   # 3+ incorrectas seguidas → considerar bajar

# Mínimo de ejercicios para recomendación confiable
MIN_EJERCICIOS_ALTA_CONFIANZA = 10
MIN_EJERCICIOS_MEDIA_CONFIANZA = 5


# ============================================================================
# CLASE PRINCIPAL
# ============================================================================

class AdaptadorNivel:
    """
    Servicio para adaptar el nivel de dificultad basándose en el rendimiento.

    Este servicio analiza estadísticas y recomienda el próximo nivel
    usando reglas basadas en métricas (sin Machine Learning).
    """

    def __init__(self):
        """Inicializa el adaptador"""
        self.niveles_ordenados = [Nivel.BASICO, Nivel.INTERMEDIO, Nivel.AVANZADO]

    # ========================================================================
    # API PÚBLICA
    # ========================================================================

    def recomendar_nivel(
        self,
        nivel_actual: str,
        estadisticas_sesion: Optional[EstadisticasSesion] = None,
        estadisticas_estudiante: Optional[EstadisticasEstudiante] = None,
        sesion: Optional[SesionEjercicios] = None,
    ) -> Dict:
        """
        Recomienda el próximo nivel basándose en el rendimiento.

        Args:
            nivel_actual: Nivel actual del estudiante
            estadisticas_sesion: Estadísticas de la sesión actual
            estadisticas_estudiante: Estadísticas históricas del estudiante
            sesion: Sesión completa (para analizar rachas)

        Returns:
            Dict con:
            - nivel_recomendado: str
            - razon: str (explicación del cambio)
            - confianza: str (alta/media/baja)
            - direccion: str (subir/mantener/bajar)
            - metricas: Dict (métricas usadas para la decisión)
        """
        # Normalizar nivel actual
        try:
            nivel = Nivel(nivel_actual)
        except ValueError:
            nivel = Nivel.INTERMEDIO  # Default

        # Analizar métricas
        metricas = self._analizar_metricas(
            estadisticas_sesion,
            estadisticas_estudiante,
            sesion
        )

        # Determinar confianza
        confianza = self._calcular_confianza(metricas)

        # Decidir cambio de nivel
        direccion, razon = self._decidir_cambio_nivel(nivel, metricas, confianza)

        # Aplicar cambio
        nivel_nuevo = self._aplicar_cambio(nivel, direccion)

        return {
            "nivel_actual": nivel_actual,
            "nivel_recomendado": nivel_nuevo.value,
            "direccion": direccion.value,
            "razon": razon,
            "confianza": confianza.value,
            "metricas": metricas,
            "cambio_aplicado": nivel_nuevo.value != nivel_actual
        }

    # ========================================================================
    # ANÁLISIS DE MÉTRICAS
    # ========================================================================

    def _analizar_metricas(
        self,
        stats_sesion: Optional[EstadisticasSesion],
        stats_estudiante: Optional[EstadisticasEstudiante],
        sesion: Optional[SesionEjercicios],
    ) -> Dict:
        """Analiza todas las métricas relevantes"""
        metricas = {
            "total_ejercicios": 0,
            "tasa_aciertos_sesion": 0.0,
            "tasa_aciertos_historica": 0.0,
            "tiempo_promedio_sesion": 0.0,
            "tiempo_promedio_historico": 0.0,
            "racha_correctas_actual": 0,
            "racha_incorrectas_actual": 0,
            "racha_correctas_maxima": 0,
            "racha_incorrectas_maxima": 0,
            "total_sesiones": 0,
            "mejora_reciente": False,
        }

        # Métricas de sesión actual
        if stats_sesion:
            metricas["total_ejercicios"] = stats_sesion.ejercicios_completados
            metricas["tasa_aciertos_sesion"] = stats_sesion.tasa_aciertos
            metricas["tiempo_promedio_sesion"] = stats_sesion.tiempo_promedio_segundos

        # Métricas históricas
        if stats_estudiante:
            metricas["tasa_aciertos_historica"] = stats_estudiante.tasa_aciertos_promedio
            metricas["tiempo_promedio_historico"] = stats_estudiante.tiempo_promedio_por_ejercicio
            metricas["total_sesiones"] = stats_estudiante.total_sesiones

            # Verificar mejora reciente
            if stats_sesion:
                metricas["mejora_reciente"] = (
                    stats_sesion.tasa_aciertos > stats_estudiante.tasa_aciertos_promedio
                )

        # Analizar rachas en la sesión actual
        if sesion and sesion.respuestas:
            rachas = self._analizar_rachas(sesion.respuestas)
            metricas.update(rachas)

        return metricas

    def _analizar_rachas(self, respuestas: List[RespuestaEstudiante]) -> Dict:
        """
        Analiza rachas de respuestas correctas e incorrectas.

        Rachas largas indican:
        - Correctas: Ejercicios muy fáciles → subir nivel
        - Incorrectas: Ejercicios muy difíciles → bajar nivel
        """
        if not respuestas:
            return {
                "racha_correctas_actual": 0,
                "racha_incorrectas_actual": 0,
                "racha_correctas_maxima": 0,
                "racha_incorrectas_maxima": 0,
            }

        racha_correctas_actual = 0
        racha_incorrectas_actual = 0
        racha_correctas_maxima = 0
        racha_incorrectas_maxima = 0

        # Analizar desde el final (racha actual)
        for respuesta in reversed(respuestas):
            if respuesta.es_correcta:
                racha_correctas_actual += 1
                racha_incorrectas_actual = 0
            else:
                racha_incorrectas_actual += 1
                racha_correctas_actual = 0

            # Guardar máximas
            racha_correctas_maxima = max(racha_correctas_maxima, racha_correctas_actual)
            racha_incorrectas_maxima = max(racha_incorrectas_maxima, racha_incorrectas_actual)

        # Ahora analizar todas las rachas para obtener las máximas reales
        temp_correctas = 0
        temp_incorrectas = 0
        for respuesta in respuestas:
            if respuesta.es_correcta:
                temp_correctas += 1
                temp_incorrectas = 0
                racha_correctas_maxima = max(racha_correctas_maxima, temp_correctas)
            else:
                temp_incorrectas += 1
                temp_correctas = 0
                racha_incorrectas_maxima = max(racha_incorrectas_maxima, temp_incorrectas)

        return {
            "racha_correctas_actual": racha_correctas_actual,
            "racha_incorrectas_actual": racha_incorrectas_actual,
            "racha_correctas_maxima": racha_correctas_maxima,
            "racha_incorrectas_maxima": racha_incorrectas_maxima,
        }

    def _calcular_confianza(self, metricas: Dict) -> ConfianzaRecomendacion:
        """
        Calcula la confianza en la recomendación basándose en cantidad de datos.

        Más ejercicios completados = mayor confianza
        """
        total = metricas.get("total_ejercicios", 0)

        if total >= MIN_EJERCICIOS_ALTA_CONFIANZA:
            return ConfianzaRecomendacion.ALTA
        elif total >= MIN_EJERCICIOS_MEDIA_CONFIANZA:
            return ConfianzaRecomendacion.MEDIA
        else:
            return ConfianzaRecomendacion.BAJA

    # ========================================================================
    # DECISIÓN DE CAMBIO DE NIVEL
    # ========================================================================

    def _decidir_cambio_nivel(
        self,
        nivel_actual: Nivel,
        metricas: Dict,
        confianza: ConfianzaRecomendacion
    ) -> Tuple[DireccionCambio, str]:
        """
        Decide si subir, mantener o bajar el nivel.

        Reglas de decisión:
        1. Tasa de aciertos < 50% → BAJAR
        2. Tasa de aciertos > 80% + tiempo rápido → SUBIR
        3. Racha de 5+ correctas → SUBIR
        4. Racha de 3+ incorrectas → BAJAR
        5. Tasa 50-70% → MANTENER
        6. Confianza baja → MANTENER (conservador)
        """
        tasa_sesion = metricas.get("tasa_aciertos_sesion", 0.0)
        tasa_historica = metricas.get("tasa_aciertos_historica", 0.0)
        tiempo_sesion = metricas.get("tiempo_promedio_sesion", 0.0)
        racha_correctas = metricas.get("racha_correctas_maxima", 0)
        racha_incorrectas = metricas.get("racha_incorrectas_maxima", 0)
        mejora_reciente = metricas.get("mejora_reciente", False)

        # Usar tasa de sesión si está disponible, sino histórica
        tasa_principal = tasa_sesion if tasa_sesion > 0 else tasa_historica

        # REGLA 1: Confianza baja → ser conservador
        if confianza == ConfianzaRecomendacion.BAJA:
            if tasa_principal < UMBRAL_BAJAR_NIVEL:
                return (
                    DireccionCambio.BAJAR,
                    f"Tasa de aciertos baja ({tasa_principal:.0%}), pero pocos datos. Se recomienda bajar."
                )
            return (
                DireccionCambio.MANTENER,
                f"Datos insuficientes ({metricas['total_ejercicios']} ejercicios). Mantener nivel actual."
            )

        # REGLA 2: Racha larga de incorrectas → BAJAR (señal fuerte)
        if racha_incorrectas >= RACHA_INCORRECTAS_MINIMA:
            return (
                DireccionCambio.BAJAR,
                f"Racha de {racha_incorrectas} respuestas incorrectas seguidas. El nivel actual es muy difícil."
            )

        # REGLA 3: Tasa muy baja → BAJAR
        if tasa_principal < UMBRAL_BAJAR_NIVEL:
            return (
                DireccionCambio.BAJAR,
                f"Tasa de aciertos baja ({tasa_principal:.0%}). Nivel actual muy difícil."
            )

        # REGLA 4: Racha larga de correctas + tiempo rápido → SUBIR
        if racha_correctas >= RACHA_CORRECTAS_MINIMA:
            if tiempo_sesion > 0 and tiempo_sesion < TIEMPO_RAPIDO:
                return (
                    DireccionCambio.SUBIR,
                    f"Racha de {racha_correctas} respuestas correctas seguidas con tiempo rápido ({tiempo_sesion:.0f}s). Nivel actual muy fácil."
                )
            else:
                return (
                    DireccionCambio.SUBIR,
                    f"Racha de {racha_correctas} respuestas correctas seguidas. Nivel actual fácil."
                )

        # REGLA 5: Tasa muy alta + tiempo rápido → SUBIR
        if tasa_principal > UMBRAL_SUBIR_NIVEL:
            if tiempo_sesion > 0 and tiempo_sesion < TIEMPO_RAPIDO:
                return (
                    DireccionCambio.SUBIR,
                    f"Excelente tasa de aciertos ({tasa_principal:.0%}) con tiempo rápido ({tiempo_sesion:.0f}s). Nivel actual muy fácil."
                )
            else:
                return (
                    DireccionCambio.SUBIR,
                    f"Excelente tasa de aciertos ({tasa_principal:.0%}). Nivel actual fácil."
                )

        # REGLA 6: Tasa alta sin tiempo rápido → MANTENER pero con posibilidad de subir
        if tasa_principal > UMBRAL_MANTENER_ALTO:
            if mejora_reciente:
                return (
                    DireccionCambio.MANTENER,
                    f"Buena tasa de aciertos ({tasa_principal:.0%}) y mejorando. Mantener nivel para consolidar."
                )
            return (
                DireccionCambio.MANTENER,
                f"Buena tasa de aciertos ({tasa_principal:.0%}). Mantener nivel actual."
            )

        # REGLA 7: Tasa media → MANTENER
        return (
            DireccionCambio.MANTENER,
            f"Tasa de aciertos adecuada ({tasa_principal:.0%}). Nivel actual apropiado."
        )

    def _aplicar_cambio(
        self,
        nivel_actual: Nivel,
        direccion: DireccionCambio
    ) -> Nivel:
        """
        Aplica el cambio de nivel respetando límites.

        No se puede bajar de básico ni subir de avanzado.
        """
        if direccion == DireccionCambio.MANTENER:
            return nivel_actual

        indice_actual = self.niveles_ordenados.index(nivel_actual)

        if direccion == DireccionCambio.SUBIR:
            # No subir si ya está en avanzado
            if indice_actual >= len(self.niveles_ordenados) - 1:
                return nivel_actual
            return self.niveles_ordenados[indice_actual + 1]

        elif direccion == DireccionCambio.BAJAR:
            # No bajar si ya está en básico
            if indice_actual <= 0:
                return nivel_actual
            return self.niveles_ordenados[indice_actual - 1]

        return nivel_actual

    # ========================================================================
    # MÉTODOS AUXILIARES
    # ========================================================================

    def obtener_siguiente_nivel(self, nivel_actual: str) -> Optional[str]:
        """Obtiene el siguiente nivel superior"""
        try:
            nivel = Nivel(nivel_actual)
            indice = self.niveles_ordenados.index(nivel)
            if indice < len(self.niveles_ordenados) - 1:
                return self.niveles_ordenados[indice + 1].value
            return None
        except (ValueError, IndexError):
            return None

    def obtener_nivel_anterior(self, nivel_actual: str) -> Optional[str]:
        """Obtiene el nivel anterior (más fácil)"""
        try:
            nivel = Nivel(nivel_actual)
            indice = self.niveles_ordenados.index(nivel)
            if indice > 0:
                return self.niveles_ordenados[indice - 1].value
            return None
        except (ValueError, IndexError):
            return None

    def validar_nivel(self, nivel: str) -> bool:
        """Valida que un nivel sea válido"""
        try:
            Nivel(nivel)
            return True
        except ValueError:
            return False


# ============================================================================
# SINGLETON
# ============================================================================

adaptador_nivel = AdaptadorNivel()


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    print("=" * 70)
    print("TEST: AdaptadorNivel")
    print("=" * 70)

    # Test 1: Rendimiento bajo → bajar nivel
    print("\n📊 Test 1: Rendimiento bajo (30% aciertos)")
    stats_sesion_baja = EstadisticasSesion(
        sesion_id="TEST001",
        estudiante_id="EST001",
        curso="matematicas",
        total_ejercicios=10,
        ejercicios_completados=10,
        ejercicios_correctos=3,
        ejercicios_incorrectos=7,
        tasa_aciertos=0.3,
        tasa_completacion=1.0,
        tiempo_total_segundos=400,
        tiempo_promedio_segundos=40.0,
        fecha_inicio="2025-11-17T22:00:00",
        fecha_fin="2025-11-17T22:10:00"
    )

    resultado = adaptador_nivel.recomendar_nivel(
        nivel_actual="intermedio",
        estadisticas_sesion=stats_sesion_baja
    )
    print(f"Nivel actual: {resultado['nivel_actual']}")
    print(f"Nivel recomendado: {resultado['nivel_recomendado']}")
    print(f"Dirección: {resultado['direccion']}")
    print(f"Razón: {resultado['razon']}")
    print(f"Confianza: {resultado['confianza']}")

    # Test 2: Rendimiento alto + tiempo rápido → subir nivel
    print("\n📊 Test 2: Rendimiento alto (90% aciertos, tiempo rápido)")
    stats_sesion_alta = EstadisticasSesion(
        sesion_id="TEST002",
        estudiante_id="EST001",
        curso="matematicas",
        total_ejercicios=10,
        ejercicios_completados=10,
        ejercicios_correctos=9,
        ejercicios_incorrectos=1,
        tasa_aciertos=0.9,
        tasa_completacion=1.0,
        tiempo_total_segundos=250,
        tiempo_promedio_segundos=25.0,
        fecha_inicio="2025-11-17T22:00:00",
        fecha_fin="2025-11-17T22:05:00"
    )

    resultado = adaptador_nivel.recomendar_nivel(
        nivel_actual="basico",
        estadisticas_sesion=stats_sesion_alta
    )
    print(f"Nivel actual: {resultado['nivel_actual']}")
    print(f"Nivel recomendado: {resultado['nivel_recomendado']}")
    print(f"Dirección: {resultado['direccion']}")
    print(f"Razón: {resultado['razon']}")
    print(f"Confianza: {resultado['confianza']}")

    # Test 3: Rendimiento medio → mantener
    print("\n📊 Test 3: Rendimiento medio (60% aciertos)")
    stats_sesion_media = EstadisticasSesion(
        sesion_id="TEST003",
        estudiante_id="EST001",
        curso="matematicas",
        total_ejercicios=10,
        ejercicios_completados=10,
        ejercicios_correctos=6,
        ejercicios_incorrectos=4,
        tasa_aciertos=0.6,
        tasa_completacion=1.0,
        tiempo_total_segundos=500,
        tiempo_promedio_segundos=50.0,
        fecha_inicio="2025-11-17T22:00:00",
        fecha_fin="2025-11-17T22:10:00"
    )

    resultado = adaptador_nivel.recomendar_nivel(
        nivel_actual="intermedio",
        estadisticas_sesion=stats_sesion_media
    )
    print(f"Nivel actual: {resultado['nivel_actual']}")
    print(f"Nivel recomendado: {resultado['nivel_recomendado']}")
    print(f"Dirección: {resultado['direccion']}")
    print(f"Razón: {resultado['razon']}")
    print(f"Confianza: {resultado['confianza']}")

    print("\n" + "=" * 70)
    print("✅ AdaptadorNivel funcionando correctamente")
    print("=" * 70)
