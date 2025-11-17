"""
Servicio de almacenamiento en JSON
Guarda los perfiles clasificados en archivos JSON locales
"""

import json
import os
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class JSONStorageService:
    """
    Servicio para guardar y recuperar perfiles desde archivos JSON
    """

    def __init__(self, data_dir: str = "data"):
        """
        Inicializa el servicio de almacenamiento

        Args:
            data_dir: Directorio donde se guardarán los archivos JSON
        """
        # Obtener el directorio del proyecto (backend/)
        project_root = Path(__file__).parent.parent.parent
        self.data_dir = project_root / data_dir
        self.perfiles_file = self.data_dir / "perfiles.json"

        # Crear directorio si no existe
        self._initialize_storage()

    def _initialize_storage(self):
        """Inicializa el directorio de almacenamiento"""
        try:
            self.data_dir.mkdir(parents=True, exist_ok=True)

            # Crear archivo de perfiles si no existe
            if not self.perfiles_file.exists():
                self._write_json(self.perfiles_file, {
                    "metadata": {
                        "created_at": datetime.now().isoformat(),
                        "version": "1.0.0",
                        "total_perfiles": 0
                    },
                    "perfiles": []
                })
                logger.info(f"✅ Archivo de perfiles creado en: {self.perfiles_file}")
            else:
                logger.info(f"✅ Archivo de perfiles encontrado en: {self.perfiles_file}")

        except Exception as e:
            logger.error(f"❌ Error al inicializar almacenamiento: {e}")
            raise

    def _read_json(self, file_path: Path) -> Dict[str, Any]:
        """Lee un archivo JSON"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"❌ Error al leer {file_path}: {e}")
            return {"metadata": {}, "perfiles": []}

    def _write_json(self, file_path: Path, data: Dict[str, Any]):
        """Escribe datos en un archivo JSON"""
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"❌ Error al escribir {file_path}: {e}")
            raise

    def guardar_perfil(self, perfil_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Guarda un perfil en el archivo JSON

        Args:
            perfil_data: Datos del perfil a guardar

        Returns:
            Dict con el resultado de la operación
        """
        try:
            # Leer datos actuales
            data = self._read_json(self.perfiles_file)

            # Agregar timestamp
            perfil_data["fecha_guardado"] = datetime.now().isoformat()

            # Agregar perfil a la lista
            data["perfiles"].append(perfil_data)

            # Actualizar metadata
            data["metadata"]["total_perfiles"] = len(data["perfiles"])
            data["metadata"]["last_updated"] = datetime.now().isoformat()

            # Guardar
            self._write_json(self.perfiles_file, data)

            logger.info(f"✅ Perfil guardado: {perfil_data.get('estudiante_id', 'unknown')}")

            return {
                "success": True,
                "message": "Perfil guardado exitosamente",
                "file": str(self.perfiles_file),
                "total_perfiles": data["metadata"]["total_perfiles"]
            }

        except Exception as e:
            logger.error(f"❌ Error al guardar perfil: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def obtener_perfil(self, estudiante_id: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene el perfil más reciente de un estudiante

        Args:
            estudiante_id: ID del estudiante

        Returns:
            Dict con los datos del perfil o None
        """
        try:
            data = self._read_json(self.perfiles_file)

            # Buscar perfiles del estudiante (el más reciente primero)
            perfiles_estudiante = [
                p for p in reversed(data["perfiles"])
                if p.get("estudiante_id") == estudiante_id
            ]

            if perfiles_estudiante:
                return perfiles_estudiante[0]

            return None

        except Exception as e:
            logger.error(f"❌ Error al obtener perfil: {e}")
            return None

    def listar_perfiles(
        self,
        grado: Optional[str] = None,
        nivel_riesgo: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Lista perfiles con filtros opcionales

        Args:
            grado: Filtrar por grado (opcional)
            nivel_riesgo: Filtrar por nivel de riesgo (opcional)
            limit: Límite de resultados

        Returns:
            Lista de perfiles
        """
        try:
            data = self._read_json(self.perfiles_file)
            perfiles = data["perfiles"]

            # Aplicar filtros
            if grado:
                perfiles = [p for p in perfiles if p.get("grado") == grado]

            if nivel_riesgo:
                perfiles = [p for p in perfiles if p.get("nivel_riesgo") == nivel_riesgo]

            # Ordenar por fecha (más recientes primero)
            perfiles = sorted(
                perfiles,
                key=lambda x: x.get("fecha_guardado", ""),
                reverse=True
            )

            # Limitar resultados
            return perfiles[:limit]

        except Exception as e:
            logger.error(f"❌ Error al listar perfiles: {e}")
            return []

    def obtener_estadisticas(self) -> Dict[str, Any]:
        """
        Obtiene estadísticas de los perfiles almacenados

        Returns:
            Dict con estadísticas
        """
        try:
            data = self._read_json(self.perfiles_file)
            perfiles = data["perfiles"]

            # Contar por categoría
            categorias = {}
            for perfil in perfiles:
                cat = perfil.get("categoria_principal", "Sin categoría")
                categorias[cat] = categorias.get(cat, 0) + 1

            # Contar por nivel de riesgo
            riesgos = {}
            for perfil in perfiles:
                riesgo = perfil.get("nivel_riesgo", "Sin clasificar")
                riesgos[riesgo] = riesgos.get(riesgo, 0) + 1

            # Contar por grado
            grados = {}
            for perfil in perfiles:
                grado = perfil.get("grado", "Sin grado")
                grados[grado] = grados.get(grado, 0) + 1

            return {
                "total_perfiles": len(perfiles),
                "por_categoria": categorias,
                "por_nivel_riesgo": riesgos,
                "por_grado": grados,
                "metadata": data["metadata"]
            }

        except Exception as e:
            logger.error(f"❌ Error al obtener estadísticas: {e}")
            return {}

    def limpiar_perfiles(self) -> Dict[str, Any]:
        """
        Limpia todos los perfiles (usar con precaución)

        Returns:
            Dict con el resultado de la operación
        """
        try:
            self._write_json(self.perfiles_file, {
                "metadata": {
                    "created_at": datetime.now().isoformat(),
                    "version": "1.0.0",
                    "total_perfiles": 0
                },
                "perfiles": []
            })

            logger.warning("⚠️  Todos los perfiles han sido eliminados")

            return {
                "success": True,
                "message": "Perfiles limpiados exitosamente"
            }

        except Exception as e:
            logger.error(f"❌ Error al limpiar perfiles: {e}")
            return {
                "success": False,
                "error": str(e)
            }


# ============================================================================
# INSTANCIA GLOBAL DEL SERVICIO
# ============================================================================

json_storage = JSONStorageService()
