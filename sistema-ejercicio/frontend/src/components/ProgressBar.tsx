/**
 * ProgressBar - Barra de progreso de ejercicios
 */

import { ProgressBarProps } from "@/types/ejercicios";
import { CheckCircle2, Circle } from "lucide-react";

export default function ProgressBar({ actual, total, correctos }: ProgressBarProps) {
  const porcentaje = (actual / total) * 100;
  const tasaAciertos = actual > 0 ? (correctos / actual) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Progreso</span>
          <span className="text-xs text-gray-500">
            {actual} de {total}
          </span>
        </div>

        {actual > 0 && (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-500" />
            <span className="text-sm font-medium text-success-700">
              {correctos} correctas ({Math.round(tasaAciertos)}%)
            </span>
          </div>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${porcentaje}%` }}
        >
          {/* Animación de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>

      {/* Indicadores de ejercicios */}
      <div className="flex gap-1 mt-3">
        {Array.from({ length: total }).map((_, index) => {
          const completado = index < actual;
          const esCorrecto = index < correctos;

          return (
            <div
              key={index}
              className="flex-1 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: completado
                  ? esCorrecto
                    ? "#22c55e" // success-500
                    : "#ef4444" // error-500
                  : "#e5e7eb", // gray-200
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
