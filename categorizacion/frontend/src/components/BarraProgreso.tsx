/**
 * Componente de Barra de Progreso
 * Muestra el progreso del formulario
 */

'use client';

import React from 'react';

interface BarraProgresoProps {
  actual: number;
  total: number;
  className?: string;
}

export const BarraProgreso: React.FC<BarraProgresoProps> = ({
  actual,
  total,
  className = '',
}) => {
  const porcentaje = Math.round((actual / total) * 100);

  return (
    <div className={`w-full ${className}`}>
      {/* Texto del progreso */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Pregunta {actual} de {total}
        </span>
        <span className="text-sm font-medium text-blue-600">{porcentaje}%</span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      {/* Indicadores de pasos */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i < actual ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
