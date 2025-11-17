/**
 * EjercicioCard - Tarjeta que muestra un ejercicio completo
 */

import { EjercicioCardProps, extraerLetraOpcion } from "@/types/ejercicios";
import OpcionButton from "./OpcionButton";
import { BookOpen, Calculator } from "lucide-react";

export default function EjercicioCard({
  ejercicio,
  numero,
  total,
  onResponder,
  respuestaSeleccionada,
  mostrarResultado,
  disabled,
}: EjercicioCardProps) {
  const esMatematicas = "operacion_principal" in ejercicio;
  const respuestaCorrecta = ejercicio.respuesta_correcta;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {esMatematicas ? (
            <Calculator className="w-6 h-6 text-primary-600" />
          ) : (
            <BookOpen className="w-6 h-6 text-primary-600" />
          )}
          <h2 className="text-lg font-semibold text-gray-800">
            Ejercicio {numero} de {total}
          </h2>
        </div>

        {/* Badge de nivel */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            ejercicio.nivel === "facil"
              ? "bg-green-100 text-green-800"
              : ejercicio.nivel === "medio"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {ejercicio.nivel === "facil"
            ? "Fácil"
            : ejercicio.nivel === "medio"
            ? "Medio"
            : "Difícil"}
        </span>
      </div>

      {/* Título del ejercicio (si existe) */}
      {ejercicio.titulo && (
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {ejercicio.titulo}
        </h3>
      )}

      {/* Enunciado */}
      <div className="bg-gray-50 rounded-lg p-5 mb-6">
        <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
          {ejercicio.enunciado}
        </p>
      </div>

      {/* Opciones */}
      <div className="space-y-3">
        {ejercicio.opciones.map((opcion, index) => {
          const letra = extraerLetraOpcion(opcion);
          const selected = respuestaSeleccionada === letra;
          const correct = mostrarResultado && letra === respuestaCorrecta;
          const incorrect =
            mostrarResultado && selected && letra !== respuestaCorrecta;

          return (
            <OpcionButton
              key={letra}
              letra={letra}
              texto={opcion}
              selected={selected}
              correct={correct}
              incorrect={incorrect}
              disabled={disabled}
              onClick={() => !disabled && onResponder(letra)}
            />
          );
        })}
      </div>

      {/* Información adicional (matemáticas) */}
      {esMatematicas && ejercicio.contexto && (
        <div className="mt-4 text-sm text-gray-500">
          <span className="font-medium">Contexto:</span> {ejercicio.contexto}
        </div>
      )}
    </div>
  );
}
