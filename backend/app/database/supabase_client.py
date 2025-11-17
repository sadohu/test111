"""
Cliente de Supabase para el Backend
Gestiona la conexión y operaciones CRUD con Supabase
"""

from typing import Optional, List, Dict, Any
from supabase import create_client, Client
import logging

from app.config import settings
from app.models.perfil import PerfilDB, EstudianteDB, PerfilEstudianteResponse

logger = logging.getLogger(__name__)


class SupabaseService:
    """
    Servicio para gestionar operaciones con Supabase
    """

    def __init__(self):
        """Inicializa el cliente de Supabase"""
        self.client: Optional[Client] = None
        self._initialize_client()

    def _initialize_client(self):
        """Inicializa la conexión con Supabase"""
        try:
            if not settings.supabase_url or not settings.supabase_key:
                logger.warning("⚠️  Supabase no configurado. Las operaciones de BD no estarán disponibles.")
                return

            self.client = create_client(
                settings.supabase_url,
                settings.supabase_key
            )
            logger.info("✅ Cliente de Supabase inicializado correctamente")

        except Exception as e:
            logger.error(f"❌ Error al inicializar Supabase: {e}")
            self.client = None

    def is_available(self) -> bool:
        """Verifica si Supabase está disponible"""
        return self.client is not None

    # ========================================================================
    # OPERACIONES CON PERFILES
    # ========================================================================

    async def guardar_perfil(self, perfil: PerfilEstudianteResponse, notas: Optional[str] = None) -> Dict[str, Any]:
        """
        Guarda un perfil en Supabase

        Args:
            perfil: Perfil del estudiante a guardar
            notas: Notas adicionales opcionales

        Returns:
            Dict con el resultado de la operación

        Raises:
            Exception: Si Supabase no está disponible o hay error
        """
        if not self.is_available():
            raise Exception("Supabase no está configurado")

        try:
            # Preparar datos para inserción
            perfil_data = {
                "estudiante_id": perfil.estudiante_id,
                "grado": perfil.grado,
                "nivel_riesgo": perfil.nivel_riesgo,
                "categoria_principal": perfil.categoria_principal,
                "perfil_data": perfil.model_dump(),
                "activo": True
            }

            if notas:
                perfil_data["notas"] = notas

            # Insertar en la tabla 'perfiles'
            result = self.client.table("perfiles").insert(perfil_data).execute()

            logger.info(f"✅ Perfil guardado para estudiante: {perfil.estudiante_id}")
            return {
                "success": True,
                "data": result.data,
                "message": "Perfil guardado exitosamente"
            }

        except Exception as e:
            logger.error(f"❌ Error al guardar perfil: {e}")
            raise Exception(f"Error al guardar perfil en Supabase: {str(e)}")

    async def obtener_perfil(self, estudiante_id: str) -> Optional[PerfilEstudianteResponse]:
        """
        Obtiene el perfil más reciente de un estudiante

        Args:
            estudiante_id: ID del estudiante

        Returns:
            PerfilEstudianteResponse o None si no existe
        """
        if not self.is_available():
            raise Exception("Supabase no está configurado")

        try:
            result = self.client.table("perfiles") \
                .select("*") \
                .eq("estudiante_id", estudiante_id) \
                .eq("activo", True) \
                .order("fecha_creacion", desc=True) \
                .limit(1) \
                .execute()

            if not result.data:
                return None

            perfil_data = result.data[0]["perfil_data"]
            return PerfilEstudianteResponse(**perfil_data)

        except Exception as e:
            logger.error(f"❌ Error al obtener perfil: {e}")
            raise Exception(f"Error al obtener perfil de Supabase: {str(e)}")

    async def listar_perfiles(
        self,
        grado: Optional[str] = None,
        nivel_riesgo: Optional[str] = None,
        limit: int = 50
    ) -> List[PerfilEstudianteResponse]:
        """
        Lista perfiles con filtros opcionales

        Args:
            grado: Filtrar por grado (opcional)
            nivel_riesgo: Filtrar por nivel de riesgo (opcional)
            limit: Límite de resultados

        Returns:
            Lista de perfiles
        """
        if not self.is_available():
            raise Exception("Supabase no está configurado")

        try:
            query = self.client.table("perfiles").select("*").eq("activo", True)

            if grado:
                query = query.eq("grado", grado)

            if nivel_riesgo:
                query = query.eq("nivel_riesgo", nivel_riesgo)

            result = query.order("fecha_creacion", desc=True).limit(limit).execute()

            perfiles = [
                PerfilEstudianteResponse(**item["perfil_data"])
                for item in result.data
            ]

            return perfiles

        except Exception as e:
            logger.error(f"❌ Error al listar perfiles: {e}")
            raise Exception(f"Error al listar perfiles de Supabase: {str(e)}")

    async def actualizar_perfil(
        self,
        estudiante_id: str,
        perfil: PerfilEstudianteResponse
    ) -> Dict[str, Any]:
        """
        Actualiza el perfil de un estudiante

        Args:
            estudiante_id: ID del estudiante
            perfil: Nuevos datos del perfil

        Returns:
            Dict con el resultado de la operación
        """
        if not self.is_available():
            raise Exception("Supabase no está configurado")

        try:
            perfil_data = {
                "perfil_data": perfil.model_dump(),
                "nivel_riesgo": perfil.nivel_riesgo,
                "categoria_principal": perfil.categoria_principal,
                "fecha_actualizacion": "now()"
            }

            result = self.client.table("perfiles") \
                .update(perfil_data) \
                .eq("estudiante_id", estudiante_id) \
                .eq("activo", True) \
                .execute()

            logger.info(f"✅ Perfil actualizado para estudiante: {estudiante_id}")
            return {
                "success": True,
                "data": result.data,
                "message": "Perfil actualizado exitosamente"
            }

        except Exception as e:
            logger.error(f"❌ Error al actualizar perfil: {e}")
            raise Exception(f"Error al actualizar perfil en Supabase: {str(e)}")

    async def eliminar_perfil(self, estudiante_id: str) -> Dict[str, Any]:
        """
        Elimina (soft delete) un perfil

        Args:
            estudiante_id: ID del estudiante

        Returns:
            Dict con el resultado de la operación
        """
        if not self.is_available():
            raise Exception("Supabase no está configurado")

        try:
            result = self.client.table("perfiles") \
                .update({"activo": False}) \
                .eq("estudiante_id", estudiante_id) \
                .execute()

            logger.info(f"✅ Perfil eliminado para estudiante: {estudiante_id}")
            return {
                "success": True,
                "message": "Perfil eliminado exitosamente"
            }

        except Exception as e:
            logger.error(f"❌ Error al eliminar perfil: {e}")
            raise Exception(f"Error al eliminar perfil de Supabase: {str(e)}")

    # ========================================================================
    # OPERACIONES CON ESTUDIANTES
    # ========================================================================

    async def crear_estudiante(self, estudiante: EstudianteDB) -> Dict[str, Any]:
        """
        Crea un nuevo estudiante en la base de datos

        Args:
            estudiante: Datos del estudiante

        Returns:
            Dict con el resultado de la operación
        """
        if not self.is_available():
            raise Exception("Supabase no está configurado")

        try:
            result = self.client.table("estudiantes") \
                .insert(estudiante.model_dump(exclude={"id"})) \
                .execute()

            logger.info(f"✅ Estudiante creado: {estudiante.estudiante_id}")
            return {
                "success": True,
                "data": result.data,
                "message": "Estudiante creado exitosamente"
            }

        except Exception as e:
            logger.error(f"❌ Error al crear estudiante: {e}")
            raise Exception(f"Error al crear estudiante en Supabase: {str(e)}")

    async def obtener_estudiante(self, estudiante_id: str) -> Optional[EstudianteDB]:
        """
        Obtiene los datos de un estudiante

        Args:
            estudiante_id: ID del estudiante

        Returns:
            EstudianteDB o None si no existe
        """
        if not self.is_available():
            raise Exception("Supabase no está configurado")

        try:
            result = self.client.table("estudiantes") \
                .select("*") \
                .eq("estudiante_id", estudiante_id) \
                .eq("activo", True) \
                .limit(1) \
                .execute()

            if not result.data:
                return None

            return EstudianteDB(**result.data[0])

        except Exception as e:
            logger.error(f"❌ Error al obtener estudiante: {e}")
            raise Exception(f"Error al obtener estudiante de Supabase: {str(e)}")


# ============================================================================
# INSTANCIA GLOBAL DEL SERVICIO
# ============================================================================

supabase_service = SupabaseService()
