/**
 * FeedbackPanel - Panel de retroalimentación después de responder
 */

import { CheckCircle2, XCircle, ArrowRight, Lightbulb } from "lucide-react";
import { FeedbackPanelProps } from "@/types/ejercicios";

export default function FeedbackPanel({
  mostrar,
  esCorrecta,
  explicacion,
  retroalimentacion,
  onContinuar,
}: FeedbackPanelProps) {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div
          className={`p-6 ${
            esCorrecta
              ? "bg-gradient-to-r from-success-50 to-success-100"
              : "bg-gradient-to-r from-error-50 to-error-100"
          }`}
        >
          <div className="flex items-center gap-4">
            {esCorrecta ? (
              <CheckCircle2 className="w-12 h-12 text-success-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-12 h-12 text-error-600 flex-shrink-0" />
            )}

            <div>
              <h2
                className={`text-2xl font-bold ${
                  esCorrecta ? "text-success-900" : "text-error-900"
                }`}
              >
                {esCorrecta ? "¡Correcto!" : "Incorrecto"}
              </h2>
              <p
                className={`text-base ${
                  esCorrecta ? "text-success-700" : "text-error-700"
                }`}
              >
                {retroalimentacion}
              </p>
            </div>
          </div>
        </div>

        {/* Explicación */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Explicación
              </h3>
              <p className="text-gray-700 leading-relaxed">{explicacion}</p>
            </div>
          </div>
        </div>

        {/* Footer - Botón Continuar */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onContinuar}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Continuar
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
