/**
 * Componente principal del Formulario de Categorización
 * Maneja el flujo completo del formulario y la clasificación
 */

'use client';

import React, { useState, useEffect } from 'react';
import type { Grado, RespuestasFormulario, PreguntaFormulario, PerfilEstudiante } from '@/models';
import { formularioService, perfilService } from '@/services';
import { BarraProgreso } from './BarraProgreso';
import { Pregunta } from './Pregunta';
import { TarjetaPerfil } from './TarjetaPerfil';

interface FormularioCategorizacionProps {
  grado: Grado;
  estudianteId: string;
  onComplete?: (perfil: PerfilEstudiante) => void;
}

export const FormularioCategorizacion: React.FC<FormularioCategorizacionProps> = ({
  grado,
  estudianteId,
  onComplete,
}) => {
  // Estados
  const [preguntas, setPreguntas] = useState<PreguntaFormulario[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestasFormulario>({});
  const [perfil, setPerfil] = useState<PerfilEstudiante | null>(null);

  // Estados de carga/error
  const [cargando, setCargando] = useState(true);
  const [clasificando, setClasificando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar preguntas al montar el componente
  useEffect(() => {
    cargarPreguntas();
  }, [grado]);

  /**
   * Carga las preguntas del formulario según el grado
   */
  const cargarPreguntas = async () => {
    try {
      setCargando(true);
      setError(null);

      const preguntasData = await formularioService.obtenerPreguntas(grado);
      setPreguntas(preguntasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el formulario');
      console.error('Error al cargar preguntas:', err);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Maneja la respuesta a una pregunta
   */
  const handleRespuesta = (preguntaId: string, respuestaId: string) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: respuestaId,
    }));
  };

  /**
   * Avanza a la siguiente pregunta
   */
  const siguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual((prev) => prev + 1);
    }
  };

  /**
   * Retrocede a la pregunta anterior
   */
  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual((prev) => prev - 1);
    }
  };

  /**
   * Clasifica el perfil enviando las respuestas a la API
   */
  const clasificarPerfil = async () => {
    try {
      setClasificando(true);
      setError(null);

      console.log('📤 Clasificando perfil con respuestas:', respuestas);

      const response = await perfilService.clasificarPerfilSimple(
        respuestas,
        grado,
        estudianteId
      );

      if (response.success && response.data) {
        setPerfil(response.data);
        onComplete?.(response.data);
      } else {
        setError(response.error || 'Error al clasificar el perfil');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error al clasificar perfil:', err);
    } finally {
      setClasificando(false);
    }
  };

  /**
   * Verifica si la pregunta actual ha sido respondida
   */
  const preguntaRespondida = () => {
    const preguntaId = preguntas[preguntaActual]?.id;
    return !!respuestas[preguntaId];
  };

  /**
   * Verifica si todas las preguntas han sido respondidas
   */
  const formularioCompleto = () => {
    return preguntas.every((p) => !!respuestas[p.id]);
  };

  /**
   * Reinicia el formulario
   */
  const reiniciar = () => {
    setRespuestas({});
    setPreguntaActual(0);
    setPerfil(null);
    setError(null);
  };

  // Renderizado condicional: Cargando
  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  // Renderizado condicional: Error
  if (error && preguntas.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-300 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-bold mb-2">❌ Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={cargarPreguntas}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Renderizado condicional: Perfil clasificado
  if (perfil) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🎉 Perfil Clasificado Exitosamente
            </h1>
            <p className="text-gray-600">
              Aquí está el perfil completo del estudiante
            </p>
          </div>

          <TarjetaPerfil perfil={perfil} />

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={reiniciar}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔄 Realizar otro formulario
            </button>

            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🖨️ Imprimir Perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizado principal: Formulario
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Formulario de Categorización de Perfiles
          </h1>
          <p className="text-gray-600">Grado: {grado}</p>
        </div>

        {/* Barra de Progreso */}
        <BarraProgreso
          actual={preguntaActual + 1}
          total={preguntas.length}
          className="mb-8"
        />

        {/* Pregunta Actual */}
        {preguntas[preguntaActual] && (
          <Pregunta
            pregunta={preguntas[preguntaActual]}
            respuestaSeleccionada={respuestas[preguntas[preguntaActual].id]}
            onRespuesta={handleRespuesta}
            deshabilitada={clasificando}
          />
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-300 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Botones de Navegación */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={preguntaAnterior}
            disabled={preguntaActual === 0}
            className={`
              px-6 py-3 rounded-lg font-medium transition-colors
              ${
                preguntaActual === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }
            `}
          >
            ← Anterior
          </button>

          {preguntaActual < preguntas.length - 1 ? (
            <button
              onClick={siguientePregunta}
              disabled={!preguntaRespondida()}
              className={`
                px-6 py-3 rounded-lg font-medium transition-colors
                ${
                  !preguntaRespondida()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={clasificarPerfil}
              disabled={!formularioCompleto() || clasificando}
              className={`
                px-8 py-3 rounded-lg font-bold transition-colors
                ${
                  !formularioCompleto() || clasificando
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }
              `}
            >
              {clasificando ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Clasificando...
                </span>
              ) : (
                '✅ Finalizar y Clasificar'
              )}
            </button>
          )}
        </div>

        {/* Información de progreso */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {!formularioCompleto() && (
            <p>
              Responde todas las preguntas para ver tu perfil completo
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
