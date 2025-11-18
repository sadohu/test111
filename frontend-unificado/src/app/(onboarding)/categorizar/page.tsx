'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { PerfilService, AuthService } from '@/services';

// Tipos para las respuestas del formulario
type RespuestasFormulario = {
  P1?: string;
  P2?: string;
  P3?: string;
  P4?: string;
  P5?: string;
  P6?: string;
  P7?: string;
  P8?: string;
  P9?: string;
  P10?: string;
};

// Preguntas del cuestionario
const PREGUNTAS = [
  {
    id: 'P1',
    pregunta: '¿Cómo prefieres aprender nuevos conceptos?',
    opciones: [
      { valor: 'A', texto: 'Viendo videos o imágenes' },
      { valor: 'B', texto: 'Escuchando explicaciones' },
      { valor: 'C', texto: 'Haciendo actividades prácticas' },
    ],
  },
  {
    id: 'P2',
    pregunta: '¿Con qué frecuencia completas tus tareas escolares?',
    opciones: [
      { valor: 'A', texto: 'Siempre' },
      { valor: 'B', texto: 'Casi siempre' },
      { valor: 'C', texto: 'A veces' },
      { valor: 'D', texto: 'Raramente' },
    ],
  },
  {
    id: 'P3',
    pregunta: '¿Qué tan motivado/a te sientes en tus estudios?',
    opciones: [
      { valor: 'A', texto: 'Muy motivado/a' },
      { valor: 'B', texto: 'Moderadamente motivado/a' },
      { valor: 'C', texto: 'Poco motivado/a' },
      { valor: 'D', texto: 'Desmotivado/a' },
    ],
  },
  {
    id: 'P4',
    pregunta: '¿Qué área te interesa más?',
    opciones: [
      { valor: 'A', texto: 'Matemáticas y lógica' },
      { valor: 'B', texto: 'Lectura y escritura' },
      { valor: 'C', texto: 'Ciencias naturales' },
      { valor: 'D', texto: 'Arte y creatividad' },
    ],
  },
  {
    id: 'P5',
    pregunta: '¿Tienes dificultades para concentrarte en clase?',
    opciones: [
      { valor: 'A', texto: 'Nunca' },
      { valor: 'B', texto: 'A veces' },
      { valor: 'C', texto: 'Frecuentemente' },
      { valor: 'D', texto: 'Siempre' },
    ],
  },
  {
    id: 'P6',
    pregunta: '¿Cómo te sientes cuando enfrentas un problema difícil?',
    opciones: [
      { valor: 'A', texto: 'Emocionado/a por resolverlo' },
      { valor: 'B', texto: 'Confiado/a pero cauteloso/a' },
      { valor: 'C', texto: 'Ansioso/a o frustrado/a' },
      { valor: 'D', texto: 'Prefiero evitarlo' },
    ],
  },
  {
    id: 'P7',
    pregunta: '¿Con qué frecuencia pides ayuda cuando no entiendes algo?',
    opciones: [
      { valor: 'A', texto: 'Siempre' },
      { valor: 'B', texto: 'A menudo' },
      { valor: 'C', texto: 'A veces' },
      { valor: 'D', texto: 'Raramente' },
    ],
  },
  {
    id: 'P8',
    pregunta: '¿Qué tan organizado/a eres con tus materiales de estudio?',
    opciones: [
      { valor: 'A', texto: 'Muy organizado/a' },
      { valor: 'B', texto: 'Moderadamente organizado/a' },
      { valor: 'C', texto: 'Poco organizado/a' },
      { valor: 'D', texto: 'Desorganizado/a' },
    ],
  },
  {
    id: 'P9',
    pregunta: '¿Prefieres trabajar solo/a o en grupo?',
    opciones: [
      { valor: 'A', texto: 'Solo/a' },
      { valor: 'B', texto: 'En grupo pequeño' },
      { valor: 'C', texto: 'En grupo grande' },
      { valor: 'D', texto: 'No tengo preferencia' },
    ],
  },
  {
    id: 'P10',
    pregunta: '¿Qué tan importante es para ti obtener buenas calificaciones?',
    opciones: [
      { valor: 'A', texto: 'Muy importante' },
      { valor: 'B', texto: 'Importante' },
      { valor: 'C', texto: 'Poco importante' },
      { valor: 'D', texto: 'No es importante' },
    ],
  },
];

const GRADOS = [
  { valor: '1-2', texto: '1° - 2° grado' },
  { valor: '3-4', texto: '3° - 4° grado' },
  { valor: '5-6', texto: '5° - 6° grado' },
];

export default function CategorizarPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(0); // 0 = grado, 1-10 = preguntas
  const [grado, setGrado] = useState<string>('');
  const [respuestas, setRespuestas] = useState<RespuestasFormulario>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSeleccionarGrado = (valorGrado: string) => {
    setGrado(valorGrado);
    setPaso(1);
  };

  const handleSeleccionarRespuesta = (preguntaId: string, valor: string) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: valor,
    });
  };

  const handleSiguiente = () => {
    if (paso < PREGUNTAS.length) {
      setPaso(paso + 1);
    }
  };

  const handleAnterior = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    }
  };

  const handleEnviar = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      // Obtener estudiante_id del AuthService
      const estudianteId = AuthService.getEstudianteId();

      if (!estudianteId) {
        throw new Error('No se encontró el ID del estudiante. Por favor, inicia sesión nuevamente.');
      }

      // Llamar al servicio de clasificación
      const resultado = await PerfilService.clasificarPerfil({
        estudiante_id: estudianteId,
        grado,
        nombre: '', // El backend puede obtener esto del estudiante
        apellido: '',
        respuestas,
      });

      if (!resultado.success) {
        throw new Error(resultado.error || 'Error al clasificar perfil');
      }

      // Marcar perfil como completado
      AuthService.marcarPerfilCompletado();

      // Redirigir al dashboard de ejercicios
      router.push('/ejercicios');
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Error al procesar el cuestionario. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const progreso = paso === 0 ? 0 : (paso / PREGUNTAS.length) * 100;
  const preguntaActual = paso > 0 ? PREGUNTAS[paso - 1] : null;
  const respuestaActual = preguntaActual
    ? respuestas[preguntaActual.id as keyof RespuestasFormulario]
    : null;

  return (
    <div className="space-y-6">
      {/* Barra de progreso */}
      {paso > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Pregunta {paso} de {PREGUNTAS.length}
            </span>
            <Badge variant="primary">{Math.round(progreso)}%</Badge>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
      )}

      {/* Selección de grado */}
      {paso === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>¡Bienvenido/a!</CardTitle>
            <CardDescription>
              Primero, selecciona tu grado escolar para personalizar tu
              experiencia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {GRADOS.map((g) => (
              <button
                key={g.valor}
                onClick={() => handleSeleccionarGrado(g.valor)}
                className="w-full p-4 text-left border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="font-semibold">{g.texto}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Preguntas del cuestionario */}
      {paso > 0 && preguntaActual && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{preguntaActual.pregunta}</CardTitle>
            <CardDescription>Selecciona la opción que mejor te describa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {preguntaActual.opciones.map((opcion) => (
              <button
                key={opcion.valor}
                onClick={() =>
                  handleSeleccionarRespuesta(preguntaActual.id, opcion.valor)
                }
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  respuestaActual === opcion.valor
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      respuestaActual === opcion.valor
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}
                  >
                    {respuestaActual === opcion.valor && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="font-medium">{opcion.texto}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Error message */}
      {apiError && (
        <Alert variant="error" onClose={() => setApiError(null)}>
          {apiError}
        </Alert>
      )}

      {/* Navegación */}
      {paso > 0 && (
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleAnterior}
            disabled={paso === 1}
          >
            ← Anterior
          </Button>

          {paso < PREGUNTAS.length ? (
            <Button
              variant="primary"
              onClick={handleSiguiente}
              disabled={!respuestaActual}
            >
              Siguiente →
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleEnviar}
              disabled={!respuestaActual}
              isLoading={isLoading}
            >
              Finalizar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
