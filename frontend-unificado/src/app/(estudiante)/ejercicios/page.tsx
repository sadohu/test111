'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { EjerciciosService, AuthService } from '@/services';

// Tipos para el estado de ejercicios
interface EstadoEjercicio {
  respuestaSeleccionada: string | null;
  esCorrecta: boolean | null;
  mostrarExplicacion: boolean;
  tiempoInicio: number;
}

export default function EjerciciosPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [configuracion, setConfiguracion] = useState({
    curso: 'matematicas',
    cantidad: 5,
    nivel: 'intermedio',
  });

  // Estado de respuestas por ejercicio
  const [estadosEjercicios, setEstadosEjercicios] = useState<Record<string, EstadoEjercicio>>({});
  const [puntuacion, setPuntuacion] = useState({ correctas: 0, total: 0 });

  const handleGenerar = async () => {
    setIsGenerating(true);
    setApiError(null);

    try {
      // Obtener estudiante_id del AuthService
      const estudianteId = AuthService.getEstudianteId();

      if (!estudianteId) {
        throw new Error('No se encontró el ID del estudiante. Por favor, inicia sesión nuevamente.');
      }

      // Llamar al servicio de generación de ejercicios
      const resultado = await EjerciciosService.generarEjercicios({
        estudiante_id: estudianteId,
        curso: configuracion.curso,
        cantidad: configuracion.cantidad,
        nivel: configuracion.nivel,
      });

      if (!resultado.success || !resultado.ejercicios) {
        throw new Error(resultado.error || 'Error al generar ejercicios');
      }

      setEjercicios(resultado.ejercicios);

      // Inicializar estado para cada ejercicio
      const nuevosEstados: Record<string, EstadoEjercicio> = {};
      resultado.ejercicios.forEach((ej) => {
        nuevosEstados[ej.id] = {
          respuestaSeleccionada: null,
          esCorrecta: null,
          mostrarExplicacion: false,
          tiempoInicio: Date.now(),
        };
      });
      setEstadosEjercicios(nuevosEstados);
      setPuntuacion({ correctas: 0, total: 0 });
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Error al generar ejercicios. Inténtalo de nuevo.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Seleccionar una respuesta
  const handleSeleccionarRespuesta = (ejercicioId: string, opcionIndex: number) => {
    const opcionLetra = String.fromCharCode(65 + opcionIndex); // A, B, C, D...

    setEstadosEjercicios((prev) => ({
      ...prev,
      [ejercicioId]: {
        ...prev[ejercicioId],
        respuestaSeleccionada: opcionLetra,
      },
    }));
  };

  // Verificar y guardar respuesta
  const handleVerificarRespuesta = async (ejercicio: any) => {
    const estado = estadosEjercicios[ejercicio.id];

    if (!estado?.respuestaSeleccionada) {
      return;
    }

    try {
      const estudianteId = AuthService.getEstudianteId();
      if (!estudianteId) {
        throw new Error('No se encontró el ID del estudiante');
      }

      // Calcular tiempo de respuesta
      const tiempoRespuestaMs = Date.now() - estado.tiempoInicio;

      // Guardar respuesta en el backend
      const resultado = await EjerciciosService.guardarRespuesta({
        estudiante_id: estudianteId,
        ejercicio_id: ejercicio.id,
        curso: configuracion.curso,
        respuesta_seleccionada: estado.respuestaSeleccionada,
        tiempo_respuesta_ms: tiempoRespuestaMs,
      });

      if (!resultado.success) {
        throw new Error(resultado.error || 'Error al guardar respuesta');
      }

      const esCorrecta = resultado.es_correcta || false;

      // Actualizar estado del ejercicio
      setEstadosEjercicios((prev) => ({
        ...prev,
        [ejercicio.id]: {
          ...prev[ejercicio.id],
          esCorrecta,
          mostrarExplicacion: true,
        },
      }));

      // Actualizar puntuación
      setPuntuacion((prev) => ({
        correctas: prev.correctas + (esCorrecta ? 1 : 0),
        total: prev.total + 1,
      }));
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Error al verificar respuesta. Inténtalo de nuevo.'
      );
    }
  };

  // Mostrar/ocultar pista
  const handleMostrarPista = (ejercicioId: string) => {
    setEstadosEjercicios((prev) => ({
      ...prev,
      [ejercicioId]: {
        ...prev[ejercicioId],
        mostrarExplicacion: !prev[ejercicioId].mostrarExplicacion,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Ejercicios Personalizados</h1>
        <p className="text-muted-foreground">
          Genera ejercicios adaptados a tu perfil de aprendizaje
        </p>
      </div>

      {/* Configuración de generación */}
      <Card>
        <CardHeader>
          <CardTitle>Configurar Ejercicios</CardTitle>
          <CardDescription>
            Selecciona el tipo y cantidad de ejercicios que deseas practicar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Materia</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { valor: 'matematicas', texto: 'Matemáticas', icon: '🔢' },
                { valor: 'lectura', texto: 'Lectura', icon: '📖' },
                { valor: 'ciencias', texto: 'Ciencias', icon: '🔬' },
                { valor: 'ingles', texto: 'Inglés', icon: '🗣️' },
              ].map((curso) => (
                <button
                  key={curso.valor}
                  onClick={() =>
                    setConfiguracion({ ...configuracion, curso: curso.valor })
                  }
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    configuracion.curso === curso.valor
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{curso.icon}</div>
                  <div className="text-sm font-medium">{curso.texto}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cantidad de ejercicios: {configuracion.cantidad}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={configuracion.cantidad}
              onChange={(e) =>
                setConfiguracion({
                  ...configuracion,
                  cantidad: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>3</span>
              <span>10</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nivel de dificultad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { valor: 'basico', texto: 'Básico', color: 'success' },
                { valor: 'intermedio', texto: 'Intermedio', color: 'warning' },
                { valor: 'avanzado', texto: 'Avanzado', color: 'error' },
              ].map((nivel) => (
                <button
                  key={nivel.valor}
                  onClick={() =>
                    setConfiguracion({ ...configuracion, nivel: nivel.valor })
                  }
                  className={`p-3 rounded-lg border-2 transition-all ${
                    configuracion.nivel === nivel.valor
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-sm font-medium">{nivel.texto}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="primary"
            onClick={handleGenerar}
            isLoading={isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generando ejercicios...' : 'Generar Ejercicios'}
          </Button>
        </CardFooter>
      </Card>

      {/* Error message */}
      {apiError && (
        <Alert variant="error" onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      {/* Lista de ejercicios generados */}
      {ejercicios.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Tus Ejercicios</h2>
            <div className="flex items-center gap-2">
              {puntuacion.total > 0 && (
                <Badge variant="success">
                  {puntuacion.correctas} / {puntuacion.total} correctas
                </Badge>
              )}
              <Badge variant="primary">
                {ejercicios.length} ejercicio{ejercicios.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>

          {ejercicios.map((ejercicio, index) => {
            const estado = estadosEjercicios[ejercicio.id];
            const yaRespondido = estado?.esCorrecta !== null;

            return (
              <Card key={ejercicio.id} variant="default">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Ejercicio {index + 1}</Badge>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{configuracion.curso}</Badge>
                      {yaRespondido && (
                        <Badge variant={estado.esCorrecta ? 'success' : 'error'}>
                          {estado.esCorrecta ? '✓ Correcto' : '✗ Incorrecto'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">{ejercicio.pregunta}</h3>

                  <div className="space-y-2">
                    {ejercicio.opciones.map((opcion: string, i: number) => {
                      const opcionLetra = String.fromCharCode(65 + i);
                      const estaSeleccionada = estado?.respuestaSeleccionada === opcionLetra;
                      const esRespuestaCorrecta = ejercicio.respuesta_correcta === opcionLetra;

                      // Determinar estilo del botón
                      let buttonClass = 'w-full p-4 text-left border-2 rounded-lg transition-all ';

                      if (yaRespondido) {
                        // Después de responder: mostrar correcto/incorrecto
                        if (esRespuestaCorrecta) {
                          buttonClass += 'border-success bg-success/10 text-success';
                        } else if (estaSeleccionada && !estado.esCorrecta) {
                          buttonClass += 'border-error bg-error/10 text-error';
                        } else {
                          buttonClass += 'border-muted bg-muted/20 text-muted-foreground';
                        }
                      } else {
                        // Antes de responder: selección normal
                        if (estaSeleccionada) {
                          buttonClass += 'border-primary bg-primary/10';
                        } else {
                          buttonClass += 'border-border hover:border-primary/50 hover:bg-primary/5';
                        }
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => !yaRespondido && handleSeleccionarRespuesta(ejercicio.id, i)}
                          disabled={yaRespondido}
                          className={buttonClass}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {opcionLetra}. {opcion}
                            </span>
                            {yaRespondido && esRespuestaCorrecta && (
                              <svg
                                className="w-5 h-5 text-success"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {yaRespondido && estaSeleccionada && !estado.esCorrecta && (
                              <svg
                                className="w-5 h-5 text-error"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explicación/Feedback */}
                  {estado?.mostrarExplicacion && ejercicio.explicacion && (
                    <Alert variant={estado.esCorrecta ? 'success' : 'info'}>
                      <strong>{estado.esCorrecta ? '¡Excelente!' : 'No te preocupes:'}</strong>
                      <p className="mt-2">{ejercicio.explicacion}</p>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  {ejercicio.pista && !yaRespondido && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMostrarPista(ejercicio.id)}
                    >
                      {estado?.mostrarExplicacion ? 'Ocultar' : 'Ver'} Pista
                    </Button>
                  )}
                  {!yaRespondido && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVerificarRespuesta(ejercicio)}
                      disabled={!estado?.respuestaSeleccionada}
                    >
                      Verificar Respuesta
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}

          {/* Resumen final */}
          {puntuacion.total === ejercicios.length && puntuacion.total > 0 && (
            <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-primary/20">
              <CardContent className="py-8 text-center">
                <div className="text-5xl mb-4">
                  {puntuacion.correctas === ejercicios.length ? '🏆' : '💪'}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {puntuacion.correctas === ejercicios.length
                    ? '¡Perfecto! Todas correctas'
                    : `¡Bien hecho! ${puntuacion.correctas} de ${ejercicios.length} correctas`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Porcentaje de acierto:{' '}
                  {Math.round((puntuacion.correctas / ejercicios.length) * 100)}%
                </p>
                <Button variant="primary" onClick={handleGenerar}>
                  Generar Nuevos Ejercicios
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty state */}
      {ejercicios.length === 0 && !isGenerating && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">
              No hay ejercicios generados
            </h3>
            <p className="text-muted-foreground mb-6">
              Configura los parámetros y genera ejercicios personalizados para
              ti
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
