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

export default function EjerciciosPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [ejercicios, setEjercicios] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [configuracion, setConfiguracion] = useState({
    curso: 'matematicas',
    cantidad: 5,
    nivel: 'intermedio',
  });

  const handleGenerar = async () => {
    setIsGenerating(true);
    setApiError(null);

    try {
      // TODO: Obtener estudiante_id del localStorage
      const estudianteId = localStorage.getItem('estudiante_id') || 'EST001';

      // TODO: Llamar al servicio de generación de ejercicios
      // const resultado = await EjerciciosService.generarEjercicios({
      //   estudiante_id: estudianteId,
      //   curso: configuracion.curso,
      //   cantidad: configuracion.cantidad,
      //   nivel: configuracion.nivel,
      // });

      // Simulación temporal
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Datos de ejemplo
      const ejerciciosEjemplo = [
        {
          id: 'EJ001',
          pregunta: '¿Cuánto es 15 + 23?',
          opciones: ['35', '38', '40', '42'],
          respuesta_correcta: '38',
        },
        {
          id: 'EJ002',
          pregunta: '¿Cuál es el resultado de 7 × 8?',
          opciones: ['54', '56', '58', '64'],
          respuesta_correcta: '56',
        },
      ];

      setEjercicios(ejerciciosEjemplo);
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
            <Badge variant="primary">
              {ejercicios.length} ejercicio{ejercicios.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {ejercicios.map((ejercicio, index) => (
            <Card key={ejercicio.id} variant="interactive">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Ejercicio {index + 1}</Badge>
                  <Badge variant="info">{configuracion.curso}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">{ejercicio.pregunta}</h3>

                <div className="space-y-2">
                  {ejercicio.opciones.map((opcion: string, i: number) => (
                    <button
                      key={i}
                      className="w-full p-3 text-left border-2 border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <span className="font-medium">
                        {String.fromCharCode(65 + i)}. {opcion}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm">
                  Pista
                </Button>
                <Button variant="primary" size="sm">
                  Verificar Respuesta
                </Button>
              </CardFooter>
            </Card>
          ))}
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
