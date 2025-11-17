"""
Adaptador para leer perfiles desde backend/data/perfiles.json
Conecta el sistema de generación de ejercicios con los perfiles clasificados
"""

import json
from pathlib import Path
from typing import Dict, Optional, List
import logging

logger = logging.getLogger(__name__)


class PerfilAdapter:
    """
    Adaptador para leer perfiles almacenados por el backend
    """

    def __init__(self, perfiles_path: Optional[str] = None):
        """
        Inicializa el adaptador

        Args:
            perfiles_path: Path personalizado al archivo de perfiles
                          Si es None, usa la ruta por defecto
        """
        if perfiles_path:
            self.perfiles_path = Path(perfiles_path)
        else:
            # Path relativo desde generador-ejercicios/ a backend/data/
            project_root = Path(__file__).parent.parent.parent
            self.perfiles_path = project_root / "backend" / "data" / "perfiles.json"

        logger.info(f"PerfilAdapter configurado para leer: {self.perfiles_path}")

    def obtener_perfil(self, estudiante_id: str) -> Optional[Dict]:
        """
        Obtiene el perfil más reciente de un estudiante

        Args:
            estudiante_id: ID del estudiante (ej: "EST001")

        Returns:
            Dict con el perfil completo o None si no existe

        Example:
            >>> adapter = PerfilAdapter()
            >>> perfil = adapter.obtener_perfil("EST001")
            >>> perfil['nivel_matematicas']
            'intermedio'
        """
        try:
            if not self.perfiles_path.exists():
                logger.warning(f"Archivo de perfiles no encontrado: {self.perfiles_path}")
                return None

            # Leer archivo JSON
            with open(self.perfiles_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Buscar perfiles del estudiante (el más reciente primero)
            perfiles_estudiante = [
                p for p in reversed(data.get('perfiles', []))
                if p.get('estudiante_id') == estudiante_id
            ]

            if perfiles_estudiante:
                logger.info(f"✅ Perfil encontrado para {estudiante_id}")
                return perfiles_estudiante[0]
            else:
                logger.warning(f"⚠️  No se encontró perfil para {estudiante_id}")
                return None

        except json.JSONDecodeError as e:
            logger.error(f"❌ Error al parsear JSON: {e}")
            return None
        except Exception as e:
            logger.error(f"❌ Error al leer perfil: {e}")
            return None

    def obtener_perfil_default(self, grado: str = "3-4") -> Dict:
        """
        Retorna perfil por defecto si el estudiante no tiene uno

        Args:
            grado: Grado del estudiante ("1-2", "3-4", "5-6")

        Returns:
            Dict con perfil por defecto
        """
        logger.info("⚙️  Usando perfil por defecto")

        return {
            'estudiante_id': 'DEFAULT',
            'grado': grado,
            'estilo_aprendizaje': 'visual',
            'velocidad': 'moderado',
            'atencion': 'media',
            'interes': 'general',
            'nivel_matematicas': 'intermedio',
            'nivel_lectura': 'desarrollado',
            'motivacion': 'media',
            'frustracion': 'intermedio',
            'trabajo': 'colaborativo',
            'energia': 'flexible',
            'nivel_riesgo': 'medio',
            'categoria_principal': 'Estudiante Promedio',
            'confianza_perfil': 40  # Baja confianza en perfil default
        }

    def obtener_o_default(self, estudiante_id: str, grado: str = "3-4") -> Dict:
        """
        Obtiene perfil del estudiante o retorna default si no existe

        Args:
            estudiante_id: ID del estudiante
            grado: Grado por defecto si no se encuentra perfil

        Returns:
            Perfil del estudiante o perfil default
        """
        perfil = self.obtener_perfil(estudiante_id)

        if perfil:
            return perfil
        else:
            logger.info(f"Usando perfil default para {estudiante_id}")
            return self.obtener_perfil_default(grado)

    def listar_estudiantes(self) -> List[Dict]:
        """
        Lista todos los estudiantes con perfiles

        Returns:
            Lista de dicts con info básica de estudiantes
        """
        try:
            if not self.perfiles_path.exists():
                return []

            with open(self.perfiles_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            perfiles = data.get('perfiles', [])

            # Deduplicar por estudiante_id (mantener más reciente)
            estudiantes_unicos = {}
            for perfil in reversed(perfiles):
                est_id = perfil.get('estudiante_id')
                if est_id and est_id not in estudiantes_unicos:
                    estudiantes_unicos[est_id] = {
                        'estudiante_id': est_id,
                        'grado': perfil.get('grado'),
                        'nivel_riesgo': perfil.get('nivel_riesgo'),
                        'categoria_principal': perfil.get('categoria_principal')
                    }

            return list(estudiantes_unicos.values())

        except Exception as e:
            logger.error(f"Error al listar estudiantes: {e}")
            return []

    def obtener_estadisticas_perfiles(self) -> Dict:
        """
        Obtiene estadísticas básicas de los perfiles almacenados

        Returns:
            Dict con estadísticas
        """
        try:
            if not self.perfiles_path.exists():
                return {"total": 0}

            with open(self.perfiles_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            perfiles = data.get('perfiles', [])

            # Contar por nivel matemáticas
            niveles_mate = {}
            for p in perfiles:
                nivel = p.get('nivel_matematicas', 'unknown')
                niveles_mate[nivel] = niveles_mate.get(nivel, 0) + 1

            # Contar por nivel lectura
            niveles_lect = {}
            for p in perfiles:
                nivel = p.get('nivel_lectura', 'unknown')
                niveles_lect[nivel] = niveles_lect.get(nivel, 0) + 1

            return {
                'total': len(perfiles),
                'niveles_matematicas': niveles_mate,
                'niveles_lectura': niveles_lect
            }

        except Exception as e:
            logger.error(f"Error al obtener estadísticas: {e}")
            return {"total": 0}


# Singleton
perfil_adapter = PerfilAdapter()
