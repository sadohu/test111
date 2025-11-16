/**
 * Componente de Pregunta
 * Muestra una pregunta del formulario con sus opciones
 */

'use client';

import React from 'react';
import type { PreguntaFormulario } from '@/models';
import { TarjetaOpcion } from './TarjetaOpcion';

interface PreguntaProps {
  pregunta: PreguntaFormulario;
  respuestaSeleccionada?: string;
  onRespuesta: (preguntaId: string, respuestaId: string) => void;
  deshabilitada?: boolean;
}

export const Pregunta: React.FC<PreguntaProps> = ({
  pregunta,
  respuestaSeleccionada,
  onRespuesta,
  deshabilitada = false,
}) => {
  const handleSeleccionar = (respuestaId: string) => {
    onRespuesta(pregunta.id, respuestaId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Título de la pregunta */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {pregunta.pregunta}
        </h2>
        <p className="text-sm text-gray-500">Selecciona la opción que mejor te describa</p>
      </div>

      {/* Opciones */}
      <div className="space-y-3">
        {pregunta.opciones.map((opcion) => (
          <TarjetaOpcion
            key={opcion.id}
            opcion={opcion}
            seleccionada={respuestaSeleccionada === opcion.id}
            onSeleccionar={handleSeleccionar}
            deshabilitada={deshabilitada}
          />
        ))}
      </div>

      {/* Información adicional */}
      {respuestaSeleccionada && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Respuesta guardada. Puedes cambiarla si lo deseas.
          </p>
        </div>
      )}
    </div>
  );
};
