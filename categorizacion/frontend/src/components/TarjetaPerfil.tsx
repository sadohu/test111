/**
 * Componente de Tarjeta de Perfil
 * Muestra el perfil clasificado del estudiante con recomendaciones
 */

'use client';

import React from 'react';
import type { PerfilEstudiante } from '@/models';
import { COLORES_RIESGO, NOMBRES_RIESGO, EMOJIS_INTERES } from '@/models';

interface TarjetaPerfilProps {
  perfil: PerfilEstudiante;
  mostrarRecomendaciones?: boolean;
}

export const TarjetaPerfil: React.FC<TarjetaPerfilProps> = ({
  perfil,
  mostrarRecomendaciones = true,
}) => {
  // Mapeo de niveles de riesgo a colores y estilos
  const coloresRiesgo = {
    bajo: 'bg-green-100 border-green-300 text-green-800',
    medio: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    alto: 'bg-red-100 border-red-300 text-red-800',
  };

  const iconosRiesgo = {
    bajo: '✅',
    medio: '⚠️',
    alto: '🚨',
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header del perfil */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{perfil.categoria_principal}</h2>
            <p className="text-blue-100">ID: {perfil.estudiante_id}</p>
          </div>
          <div className="text-5xl">
            {EMOJIS_INTERES[perfil.interes]}
          </div>
        </div>
      </div>

      {/* Nivel de Riesgo */}
      <div
        className={`border-2 rounded-lg p-4 ${coloresRiesgo[perfil.nivel_riesgo]}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{iconosRiesgo[perfil.nivel_riesgo]}</span>
          <div>
            <h3 className="font-bold text-lg">
              Nivel de Riesgo: {NOMBRES_RIESGO[perfil.nivel_riesgo]}
            </h3>
            <p className="text-sm">
              {perfil.nivel_riesgo === 'alto' &&
                'Requiere intervención inmediata y seguimiento constante'}
              {perfil.nivel_riesgo === 'medio' &&
                'Necesita monitoreo y apoyo en áreas específicas'}
              {perfil.nivel_riesgo === 'bajo' &&
                'Estudiante con buen desempeño general'}
            </p>
          </div>
        </div>
      </div>

      {/* Características del Perfil */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          📊 Características del Perfil
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estilo de Aprendizaje */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Estilo de Aprendizaje</p>
            <p className="font-semibold text-gray-800 capitalize">
              {perfil.estilo_aprendizaje}
            </p>
          </div>

          {/* Velocidad */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Velocidad de Procesamiento</p>
            <p className="font-semibold text-gray-800 capitalize">
              {perfil.velocidad}
            </p>
          </div>

          {/* Atención */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Nivel de Atención</p>
            <p className="font-semibold text-gray-800 capitalize">
              {perfil.atencion}
            </p>
          </div>

          {/* Área de Interés */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Área de Interés</p>
            <p className="font-semibold text-gray-800 capitalize">
              {perfil.interes}
            </p>
          </div>

          {/* Nivel de Matemáticas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Nivel en Matemáticas</p>
            <p className="font-semibold text-gray-800 capitalize">
              {perfil.nivel_matematicas}
            </p>
          </div>

          {/* Nivel de Lectura */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Nivel de Lectura</p>
            <p className="font-semibold text-gray-800 capitalize">
              {perfil.nivel_lectura}
            </p>
          </div>

          {/* Motivación */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Motivación</p>
            <p className="font-semibold text-gray-800 capitalize">
              {perfil.motivacion}
            </p>
          </div>

          {/* Manejo de Frustración */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Manejo de Frustración</p>
            <p className="font-semibold text-gray-800 capitalize">
              {perfil.frustracion}
            </p>
          </div>

          {/* Preferencia de Trabajo */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Preferencia de Trabajo</p>
            <p className="font-semibold text-gray-800 capitalize">
              {perfil.trabajo}
            </p>
          </div>

          {/* Horario de Energía */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Mejor Horario</p>
            <p className="font-semibold text-gray-800 capitalize">
              {perfil.energia}
            </p>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      {mostrarRecomendaciones && perfil.recomendaciones.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            💡 Recomendaciones Pedagógicas
          </h3>

          <div className="space-y-3">
            {perfil.recomendaciones.map((recomendacion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-700 flex-1">{recomendacion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadatos */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span>
            Fecha de creación:{' '}
            {new Date(perfil.fecha_creacion).toLocaleDateString('es-PE')}
          </span>
          <span>Confianza: {perfil.confianza_perfil}%</span>
        </div>
      </div>
    </div>
  );
};
