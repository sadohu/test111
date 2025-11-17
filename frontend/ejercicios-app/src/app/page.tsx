/**
 * Página principal - Sesión de ejercicios
 */

"use client";

import { useState, useEffect } from "react";
import { Trophy, Loader2, AlertCircle, Play } from "lucide-react";
import EjercicioCard from "@/components/EjercicioCard";
import ProgressBar from "@/components/ProgressBar";
import FeedbackPanel from "@/components/FeedbackPanel";
import { apiClient } from "@/lib/api-client";
import {
  Ejercicio,
  CursoEnum,
  RespuestaEstudiante,
  calcularEstadisticas,
  formatearTiempo,
} from "@/types/ejercicios";

export default function HomePage() {
  // Estado de la sesión
  const [estado, setEstado] = useState<"inicial" | "cargando" | "ejercicios" | "completado">("inicial");
  const [curso, setCurso] = useState<CursoEnum>(CursoEnum.MATEMATICAS);
  const [cantidad, setCantidad] = useState(5);
  const [estudianteId, setEstudianteId] = useState("");

  // Ejercicios y respuestas
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestaEstudiante[]>([]);

  // Estado del ejercicio actual
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string>("");
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [esCorrecta, setEsCorrecta] = useState(false);

  // Tiempo
  const [tiempoInicio, setTiempoInicio] = useState<number>(0);

  const ejercicioActual = ejercicios[indiceActual];
  const esUltimoEjercicio = indiceActual === ejercicios.length - 1;

  /**
   * Generar ejercicios
   */
  const generarEjercicios = async () => {
    setEstado("cargando");

    try {
      const response = await apiClient.generarEjercicios({
        estudiante_id: estudianteId || "DEMO001",
        curso,
        cantidad,
      });

      const ejerciciosGenerados =
        curso === CursoEnum.MATEMATICAS
          ? response.ejercicios_matematicas || []
          : response.ejercicios_verbales || [];

      setEjercicios(ejerciciosGenerados);
      setIndiceActual(0);
      setRespuestas([]);
      setEstado("ejercicios");
      setTiempoInicio(Date.now());
    } catch (error) {
      console.error("Error generando ejercicios:", error);
      alert(
        "Error al generar ejercicios. Asegúrate de que el backend esté corriendo en http://localhost:8001"
      );
      setEstado("inicial");
    }
  };

  /**
   * Manejar respuesta del estudiante
   */
  const manejarRespuesta = (opcion: string) => {
    if (respuestaSeleccionada) return; // Ya respondió

    setRespuestaSeleccionada(opcion);

    const tiempoFin = Date.now();
    const correcta = opcion === ejercicioActual.respuesta_correcta;
    setEsCorrecta(correcta);

    // Guardar respuesta
    const respuesta: RespuestaEstudiante = {
      ejercicio_id: ejercicioActual.id,
      opcion_seleccionada: opcion,
      tiempo_inicio: tiempoInicio,
      tiempo_fin: tiempoFin,
      es_correcta: correcta,
    };

    setRespuestas([...respuestas, respuesta]);

    // Mostrar feedback después de un breve delay
    setTimeout(() => {
      setMostrarFeedback(true);
    }, 500);
  };

  /**
   * Continuar al siguiente ejercicio
   */
  const continuarSiguiente = () => {
    setMostrarFeedback(false);
    setRespuestaSeleccionada("");

    if (esUltimoEjercicio) {
      setEstado("completado");
    } else {
      setIndiceActual(indiceActual + 1);
      setTiempoInicio(Date.now());
    }
  };

  /**
   * Reiniciar sesión
   */
  const reiniciar = () => {
    setEstado("inicial");
    setEjercicios([]);
    setIndiceActual(0);
    setRespuestas([]);
    setRespuestaSeleccionada("");
    setMostrarFeedback(false);
  };

  // Calcular estadísticas
  const correctos = respuestas.filter((r) => r.es_correcta).length;
  const completados = respuestas.length;

  // ============================================================================
  // RENDERS
  // ============================================================================

  if (estado === "inicial") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Ejercicios Personalizados
          </h1>

          <div className="space-y-4">
            {/* ID del estudiante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID del Estudiante (opcional)
              </label>
              <input
                type="text"
                value={estudianteId}
                onChange={(e) => setEstudianteId(e.target.value)}
                placeholder="DEMO001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Deja vacío para usar perfil por defecto
              </p>
            </div>

            {/* Curso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <select
                value={curso}
                onChange={(e) => setCurso(e.target.value as CursoEnum)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={CursoEnum.MATEMATICAS}>Matemáticas</option>
                <option value={CursoEnum.VERBAL}>Razonamiento Verbal</option>
              </select>
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de ejercicios
              </label>
              <select
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={3}>3 ejercicios</option>
                <option value={5}>5 ejercicios</option>
                <option value={10}>10 ejercicios</option>
              </select>
            </div>

            {/* Botón generar */}
            <button
              onClick={generarEjercicios}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Comenzar Ejercicios
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (estado === "cargando") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">
            Generando ejercicios personalizados...
          </p>
          <p className="text-sm text-gray-500">
            Esto puede tomar unos segundos
          </p>
        </div>
      </div>
    );
  }

  if (estado === "completado") {
    const sesion = {
      id: "SESSION_" + Date.now(),
      estudiante_id: estudianteId || "DEMO001",
      curso,
      ejercicios,
      respuestas,
      fecha_inicio: new Date().toISOString(),
      fecha_fin: new Date().toISOString(),
      completado: true,
    };

    const estadisticas = calcularEstadisticas(sesion);

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          {/* Icono de trofeo */}
          <div className="text-center mb-6">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Sesión Completada!
            </h1>
            <p className="text-gray-600">
              Has terminado todos los ejercicios
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-primary-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary-700">
                {estadisticas.ejercicios_correctos}
              </div>
              <div className="text-sm text-primary-600">Correctas</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-700">
                {Math.round(estadisticas.tasa_aciertos * 100)}%
              </div>
              <div className="text-sm text-gray-600">Tasa de aciertos</div>
            </div>

            <div className="bg-success-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-success-700">
                {formatearTiempo(estadisticas.tiempo_promedio_segundos)}
              </div>
              <div className="text-sm text-success-600">Tiempo promedio</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-700">
                {formatearTiempo(estadisticas.tiempo_total_segundos)}
              </div>
              <div className="text-sm text-gray-600">Tiempo total</div>
            </div>
          </div>

          {/* Botón reiniciar */}
          <button
            onClick={reiniciar}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Comenzar Nueva Sesión
          </button>
        </div>
      </div>
    );
  }

  // Estado: ejercicios
  if (!ejercicioActual) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-error-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700">
            No hay ejercicios para mostrar
          </p>
          <button
            onClick={reiniciar}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <ProgressBar
          actual={completados}
          total={ejercicios.length}
          correctos={correctos}
        />

        {/* Ejercicio actual */}
        <EjercicioCard
          ejercicio={ejercicioActual}
          numero={indiceActual + 1}
          total={ejercicios.length}
          onResponder={manejarRespuesta}
          respuestaSeleccionada={respuestaSeleccionada}
          mostrarResultado={!!respuestaSeleccionada}
          disabled={!!respuestaSeleccionada}
        />

        {/* Feedback panel */}
        <FeedbackPanel
          mostrar={mostrarFeedback}
          esCorrecta={esCorrecta}
          explicacion={ejercicioActual.explicacion}
          retroalimentacion={
            esCorrecta
              ? "¡Excelente trabajo! Tu razonamiento es correcto."
              : "No te preocupes, sigue intentando. Revisa la explicación."
          }
          onContinuar={continuarSiguiente}
        />
      </div>
    </div>
  );
}
