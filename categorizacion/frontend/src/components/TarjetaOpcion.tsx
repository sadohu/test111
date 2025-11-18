/**
 * Componente de Tarjeta de Opción
 * Muestra una opción de respuesta del formulario
 */

'use client';

import React from 'react';
import type { OpcionFormulario } from '@/models';

interface TarjetaOpcionProps {
  opcion: OpcionFormulario;
  seleccionada: boolean;
  onSeleccionar: (id: string) => void;
  deshabilitada?: boolean;
}

export const TarjetaOpcion: React.FC<TarjetaOpcionProps> = ({
  opcion,
  seleccionada,
  onSeleccionar,
  deshabilitada = false,
}) => {
  return (
    <button
      onClick={() => !deshabilitada && onSeleccionar(opcion.id)}
      disabled={deshabilitada}
      className={`
        w-full p-4 rounded-lg border-2 text-left transition-all duration-200
        ${
          seleccionada
            ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
        }
        ${deshabilitada ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      <div className="flex items-center gap-3">
        {/* Emoji */}
        <div className="text-3xl flex-shrink-0">{opcion.emoji}</div>

        {/* Contenido */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* ID de la opción */}
            <span
              className={`
              inline-block w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
              ${
                seleccionada
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }
            `}
            >
              {opcion.id}
            </span>
          </div>

          {/* Texto de la opción */}
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            {opcion.texto}
          </p>
        </div>

        {/* Checkmark cuando está seleccionada */}
        {seleccionada && (
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
};
