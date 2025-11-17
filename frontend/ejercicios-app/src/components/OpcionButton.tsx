/**
 * OpcionButton - Botón para seleccionar una opción de respuesta
 */

import { Check, X } from "lucide-react";
import { OpcionButtonProps } from "@/types/ejercicios";
import { extraerTextoOpcion } from "@/types/ejercicios";

export default function OpcionButton({
  letra,
  texto,
  selected,
  correct,
  incorrect,
  disabled,
  onClick,
}: OpcionButtonProps) {
  // Determinar clases CSS según el estado
  const getButtonClasses = () => {
    const baseClasses =
      "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-start gap-3";

    if (disabled) {
      if (correct) {
        return `${baseClasses} bg-success-50 border-success-500 text-success-900`;
      }
      if (incorrect) {
        return `${baseClasses} bg-error-50 border-error-500 text-error-900`;
      }
      if (selected) {
        return `${baseClasses} bg-gray-100 border-gray-300 text-gray-700`;
      }
      return `${baseClasses} bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed`;
    }

    if (selected) {
      return `${baseClasses} bg-primary-50 border-primary-500 text-primary-900 shadow-md`;
    }

    return `${baseClasses} bg-white border-gray-300 text-gray-900 hover:border-primary-400 hover:bg-primary-50 cursor-pointer`;
  };

  // Determinar clases para la letra
  const getLetraClasses = () => {
    const baseClasses =
      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm";

    if (disabled) {
      if (correct) {
        return `${baseClasses} bg-success-500 text-white`;
      }
      if (incorrect) {
        return `${baseClasses} bg-error-500 text-white`;
      }
      return `${baseClasses} bg-gray-300 text-gray-600`;
    }

    if (selected) {
      return `${baseClasses} bg-primary-500 text-white`;
    }

    return `${baseClasses} bg-gray-200 text-gray-700 group-hover:bg-primary-500 group-hover:text-white`;
  };

  // Icono de resultado (check o X)
  const renderIcono = () => {
    if (!disabled) return null;

    if (correct) {
      return <Check className="w-5 h-5 text-success-600" />;
    }

    if (incorrect) {
      return <X className="w-5 h-5 text-error-600" />;
    }

    return null;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getButtonClasses()} group`}
      type="button"
    >
      {/* Letra de la opción */}
      <span className={getLetraClasses()}>{letra}</span>

      {/* Texto de la opción */}
      <span className="flex-1 text-base leading-relaxed">{extraerTextoOpcion(texto)}</span>

      {/* Icono de resultado */}
      {renderIcono()}
    </button>
  );
}
