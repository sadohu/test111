"""
RespuestasStorage - Servicio para almacenar y recuperar respuestas de estudiantes
NOTA: Usa JSON como storage temporal. Luego se cambiará a base de datos real.

Patrón: Service Layer + Repository Pattern
- Este servicio abstrae el storage
- Para cambiar a DB: solo modificar métodos internos, la API pública no cambia
"""

import json
import os
from pathlib import Path
from typing import List, Optional, Dict
from datetime import datetime

from ..models.respuesta import (
    SesionEjercicios,
    RespuestaEstudiante,
    EstadisticasSesion,
    EstadisticasEstudiante,
    EstadoSesion,
    CursoEnum
)


class RespuestasStorage:
    """
    Servicio de almacenamiento de respuestas y sesiones

    IMPORTANTE: Este servicio usa JSON temporalmente.
    Cuando tengamos BD, solo cambiamos la implementación interna.
    La API pública (métodos públicos) permanece igual.
    """

    def __init__(self, data_dir: Optional[Path] = None):
        """
        Inicializa el storage

        Args:
            data_dir: Directorio para almacenar datos (default: generador-ejercicios/data/)
        """
        if data_dir:
            self.data_dir = Path(data_dir)
        else:
            # Directorio del proyecto
            project_root = Path(__file__).parent.parent
            self.data_dir = project_root / "data"

        # Crear directorio si no existe
        self.data_dir.mkdir(parents=True, exist_ok=True)

        # Archivos de almacenamiento
        self.sesiones_file = self.data_dir / "sesiones.json"

        # Inicializar archivos si no existen
        self._init_storage()

    # ========================================================================
    # MÉTODOS PRIVADOS - Abstracción del storage
    # ========================================================================

    def _init_storage(self):
        """Inicializa los archivos de storage si no existen"""
        if not self.sesiones_file.exists():
            initial_data = {
                "sesiones": [],
                "metadata": {
                    "created_at": datetime.now().isoformat(),
                    "total_sesiones": 0,
                    "last_updated": datetime.now().isoformat()
                }
            }
            self._write_json(self.sesiones_file, initial_data)

    def _read_json(self, file_path: Path) -> Dict:
        """Lee datos de un archivo JSON"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"sesiones": [], "metadata": {}}
        except json.JSONDecodeError:
            print(f"⚠️ Error leyendo {file_path}, retornando datos vacíos")
            return {"sesiones": [], "metadata": {}}

    def _write_json(self, file_path: Path, data: Dict):
        """Escribe datos a un archivo JSON"""
        # Actualizar metadata
        data["metadata"]["last_updated"] = datetime.now().isoformat()

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    # ========================================================================
    # API PÚBLICA - Métodos que usan los controllers
    # Cuando cambiemos a BD, estos métodos se quedan igual
    # ========================================================================

    def crear_sesion(self, sesion: SesionEjercicios) -> SesionEjercicios:
        """
        Crea una nueva sesión de ejercicios

        Args:
            sesion: Objeto SesionEjercicios

        Returns:
            La sesión guardada
        """
        data = self._read_json(self.sesiones_file)

        # Convertir a dict
        sesion_dict = sesion.model_dump()

        # Agregar a lista
        data["sesiones"].append(sesion_dict)
        data["metadata"]["total_sesiones"] = len(data["sesiones"])

        # Guardar
        self._write_json(self.sesiones_file, data)

        print(f"✅ Sesión creada: {sesion.sesion_id}")
        return sesion

    def obtener_sesion(self, sesion_id: str) -> Optional[SesionEjercicios]:
        """
        Obtiene una sesión por ID

        Args:
            sesion_id: ID de la sesión

        Returns:
            SesionEjercicios o None si no existe
        """
        data = self._read_json(self.sesiones_file)

        for sesion_dict in data["sesiones"]:
            if sesion_dict["sesion_id"] == sesion_id:
                return SesionEjercicios(**sesion_dict)

        return None

    def registrar_respuesta(
        self,
        sesion_id: str,
        respuesta: RespuestaEstudiante
    ) -> Optional[SesionEjercicios]:
        """
        Registra una respuesta en una sesión

        Args:
            sesion_id: ID de la sesión
            respuesta: Respuesta del estudiante

        Returns:
            Sesión actualizada o None si no existe
        """
        data = self._read_json(self.sesiones_file)

        # Buscar sesión
        for i, sesion_dict in enumerate(data["sesiones"]):
            if sesion_dict["sesion_id"] == sesion_id:
                # Agregar respuesta
                sesion_dict["respuestas"].append(respuesta.model_dump())

                # Actualizar estado
                if sesion_dict["estado"] == EstadoSesion.INICIADA.value:
                    sesion_dict["estado"] = EstadoSesion.EN_PROGRESO.value

                # Guardar
                data["sesiones"][i] = sesion_dict
                self._write_json(self.sesiones_file, data)

                print(f"✅ Respuesta registrada en sesión {sesion_id}")
                return SesionEjercicios(**sesion_dict)

        print(f"❌ Sesión {sesion_id} no encontrada")
        return None

    def completar_sesion(
        self,
        sesion_id: str,
        fecha_fin: Optional[str] = None
    ) -> Optional[SesionEjercicios]:
        """
        Marca una sesión como completada

        Args:
            sesion_id: ID de la sesión
            fecha_fin: Timestamp de finalización

        Returns:
            Sesión actualizada o None si no existe
        """
        data = self._read_json(self.sesiones_file)

        for i, sesion_dict in enumerate(data["sesiones"]):
            if sesion_dict["sesion_id"] == sesion_id:
                # Actualizar estado y fecha
                sesion_dict["estado"] = EstadoSesion.COMPLETADA.value
                sesion_dict["fecha_fin"] = fecha_fin or datetime.now().isoformat()

                # Guardar
                data["sesiones"][i] = sesion_dict
                self._write_json(self.sesiones_file, data)

                print(f"✅ Sesión {sesion_id} completada")
                return SesionEjercicios(**sesion_dict)

        return None

    def listar_sesiones_estudiante(
        self,
        estudiante_id: str,
        limite: Optional[int] = None
    ) -> List[SesionEjercicios]:
        """
        Lista todas las sesiones de un estudiante

        Args:
            estudiante_id: ID del estudiante
            limite: Número máximo de sesiones a retornar

        Returns:
            Lista de sesiones (ordenadas por fecha, más reciente primero)
        """
        data = self._read_json(self.sesiones_file)

        # Filtrar por estudiante
        sesiones = [
            SesionEjercicios(**s)
            for s in data["sesiones"]
            if s["estudiante_id"] == estudiante_id
        ]

        # Ordenar por fecha (más reciente primero)
        sesiones.sort(key=lambda s: s.fecha_inicio, reverse=True)

        # Aplicar límite si se especifica
        if limite:
            sesiones = sesiones[:limite]

        return sesiones

    def calcular_estadisticas_sesion(
        self,
        sesion_id: str
    ) -> Optional[EstadisticasSesion]:
        """
        Calcula estadísticas de una sesión

        Args:
            sesion_id: ID de la sesión

        Returns:
            EstadisticasSesion o None si no existe
        """
        sesion = self.obtener_sesion(sesion_id)
        if not sesion:
            return None

        # Calcular métricas
        total = sesion.cantidad_ejercicios
        completados = len(sesion.respuestas)
        correctos = sum(1 for r in sesion.respuestas if r.es_correcta)
        incorrectos = completados - correctos

        tasa_aciertos = correctos / completados if completados > 0 else 0.0
        tasa_completacion = completados / total if total > 0 else 0.0

        # Tiempos
        tiempos = [r.tiempo_respuesta_segundos for r in sesion.respuestas]
        tiempo_total = sum(tiempos)
        tiempo_promedio = tiempo_total / len(tiempos) if tiempos else 0.0
        tiempo_min = min(tiempos) if tiempos else None
        tiempo_max = max(tiempos) if tiempos else None

        return EstadisticasSesion(
            sesion_id=sesion.sesion_id,
            estudiante_id=sesion.estudiante_id,
            curso=sesion.curso,
            total_ejercicios=total,
            ejercicios_completados=completados,
            ejercicios_correctos=correctos,
            ejercicios_incorrectos=incorrectos,
            tasa_aciertos=tasa_aciertos,
            tasa_completacion=tasa_completacion,
            tiempo_total_segundos=tiempo_total,
            tiempo_promedio_segundos=tiempo_promedio,
            tiempo_min_segundos=tiempo_min,
            tiempo_max_segundos=tiempo_max,
            fecha_inicio=sesion.fecha_inicio,
            fecha_fin=sesion.fecha_fin
        )

    def calcular_estadisticas_estudiante(
        self,
        estudiante_id: str
    ) -> EstadisticasEstudiante:
        """
        Calcula estadísticas agregadas de un estudiante

        Args:
            estudiante_id: ID del estudiante

        Returns:
            EstadisticasEstudiante
        """
        sesiones = self.listar_sesiones_estudiante(estudiante_id)

        if not sesiones:
            # Retornar estadísticas vacías
            return EstadisticasEstudiante(
                estudiante_id=estudiante_id,
                total_sesiones=0,
                total_ejercicios_completados=0,
                total_ejercicios_correctos=0,
                tasa_aciertos_promedio=0.0,
                tiempo_promedio_por_ejercicio=0.0
            )

        # Calcular totales
        total_sesiones = len(sesiones)
        total_ejercicios = sum(len(s.respuestas) for s in sesiones)
        total_correctos = sum(
            sum(1 for r in s.respuestas if r.es_correcta)
            for s in sesiones
        )

        tasa_aciertos_promedio = total_correctos / total_ejercicios if total_ejercicios > 0 else 0.0

        # Tiempo promedio
        todos_tiempos = [
            r.tiempo_respuesta_segundos
            for s in sesiones
            for r in s.respuestas
        ]
        tiempo_promedio = sum(todos_tiempos) / len(todos_tiempos) if todos_tiempos else 0.0

        # Por curso
        sesiones_mate = sum(1 for s in sesiones if s.curso == CursoEnum.MATEMATICAS)
        sesiones_verbal = sum(1 for s in sesiones if s.curso == CursoEnum.VERBAL)

        # Tasa por curso
        ejercicios_mate = [
            r for s in sesiones if s.curso == CursoEnum.MATEMATICAS
            for r in s.respuestas
        ]
        ejercicios_verbal = [
            r for s in sesiones if s.curso == CursoEnum.VERBAL
            for r in s.respuestas
        ]

        tasa_mate = (
            sum(1 for r in ejercicios_mate if r.es_correcta) / len(ejercicios_mate)
            if ejercicios_mate else None
        )
        tasa_verbal = (
            sum(1 for r in ejercicios_verbal if r.es_correcta) / len(ejercicios_verbal)
            if ejercicios_verbal else None
        )

        # Última sesión
        ultima_sesion = sesiones[0] if sesiones else None

        return EstadisticasEstudiante(
            estudiante_id=estudiante_id,
            total_sesiones=total_sesiones,
            total_ejercicios_completados=total_ejercicios,
            total_ejercicios_correctos=total_correctos,
            tasa_aciertos_promedio=tasa_aciertos_promedio,
            tiempo_promedio_por_ejercicio=tiempo_promedio,
            sesiones_matematicas=sesiones_mate,
            sesiones_verbal=sesiones_verbal,
            tasa_aciertos_matematicas=tasa_mate,
            tasa_aciertos_verbal=tasa_verbal,
            ultima_sesion_fecha=ultima_sesion.fecha_inicio if ultima_sesion else None,
            ultima_sesion_id=ultima_sesion.sesion_id if ultima_sesion else None
        )

    def contar_sesiones_totales(self) -> int:
        """Retorna el número total de sesiones almacenadas"""
        data = self._read_json(self.sesiones_file)
        return len(data.get("sesiones", []))

    def generar_id_sesion(self, estudiante_id: str) -> str:
        """
        Genera un ID único para una sesión

        Args:
            estudiante_id: ID del estudiante

        Returns:
            ID de sesión en formato: SES_YYYYMMDD_ESTUDIANTEID_NNN
        """
        fecha = datetime.now().strftime("%Y%m%d")
        sesiones_hoy = len([
            s for s in self._read_json(self.sesiones_file).get("sesiones", [])
            if s.get("sesion_id", "").startswith(f"SES_{fecha}_{estudiante_id}")
        ])
        numero = str(sesiones_hoy + 1).zfill(3)
        return f"SES_{fecha}_{estudiante_id}_{numero}"


# ============================================================================
# SINGLETON
# ============================================================================

respuestas_storage = RespuestasStorage()


if __name__ == "__main__":
    # Test del storage
    print("=" * 70)
    print("TEST: RespuestasStorage")
    print("=" * 70)

    # Crear sesión de prueba
    from ..models.respuesta import SesionEjercicios, RespuestaEstudiante, CursoEnum

    sesion_id = respuestas_storage.generar_id_sesion("TEST001")
    print(f"\n✓ ID generado: {sesion_id}")

    sesion = SesionEjercicios(
        sesion_id=sesion_id,
        estudiante_id="TEST001",
        curso=CursoEnum.MATEMATICAS,
        nivel_determinado="intermedio",
        cantidad_ejercicios=3,
        ejercicios_ids=["MAT_INT_001", "MAT_INT_002", "MAT_INT_003"]
    )

    # Guardar sesión
    respuestas_storage.crear_sesion(sesion)
    print(f"✓ Sesión creada")

    # Registrar respuestas
    resp1 = RespuestaEstudiante(
        ejercicio_id="MAT_INT_001",
        opcion_seleccionada="A",
        es_correcta=True,
        tiempo_respuesta_segundos=45
    )
    respuestas_storage.registrar_respuesta(sesion_id, resp1)
    print(f"✓ Respuesta 1 registrada")

    # Calcular estadísticas
    stats = respuestas_storage.calcular_estadisticas_sesion(sesion_id)
    if stats:
        print(f"\n✓ Estadísticas:")
        print(f"  - Completados: {stats.ejercicios_completados}/{stats.total_ejercicios}")
        print(f"  - Correctos: {stats.ejercicios_correctos}")
        print(f"  - Tasa aciertos: {stats.tasa_aciertos:.1%}")

    print("\n" + "=" * 70)
    print("✅ RespuestasStorage funcionando correctamente")
    print("=" * 70)
