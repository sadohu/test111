'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EstadisticasService, AuthService } from '@/services';

export default function ReportesPage() {
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      setIsLoading(true);

      try {
        // Obtener estudiante_id del AuthService
        const estudianteId = AuthService.getEstudianteId();

        if (!estudianteId) {
          console.error('No se encontró el ID del estudiante');
          setIsLoading(false);
          return;
        }

        // Llamar al servicio de estadísticas
        const resultado = await EstadisticasService.obtenerEstadisticasEstudiante(estudianteId);

        if (resultado.success && resultado.estadisticas) {
          // Adaptar los datos al formato esperado por el UI (si es necesario)
          setEstadisticas(resultado.estadisticas);
        } else {
          console.error('Error al obtener estadísticas:', resultado.error);
          // Mantener UI sin crashear con datos de ejemplo si falla
          setEstadisticas({
            total_respuestas: 0,
            respuestas_correctas: 0,
            porcentaje_acierto: 0,
          });
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-32" />
          ))}
        </div>
      </div>
    );
  }

  const porcentajeExito = estadisticas
    ? Math.round(
        (estadisticas.ejercicios_correctos / estadisticas.total_ejercicios) *
          100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Mis Reportes</h1>
        <p className="text-muted-foreground">
          Visualiza tu progreso y rendimiento académico
        </p>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {estadisticas?.total_ejercicios || 0}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Ejercicios Completados
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-success">
                {porcentajeExito}%
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Tasa de Éxito
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-warning">
                {estadisticas?.racha_actual || 0}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Racha Actual
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent">
                {estadisticas?.mejor_racha || 0}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Mejor Racha
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento por materia */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Materia</CardTitle>
          <CardDescription>
            Progreso y porcentaje de aciertos en cada área
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {estadisticas?.promedio_por_materia.map((materia: any) => {
            const porcentaje = Math.round(
              (materia.correctas / materia.total) * 100
            );
            let badgeVariant: 'success' | 'warning' | 'error' = 'success';
            if (porcentaje < 60) badgeVariant = 'error';
            else if (porcentaje < 80) badgeVariant = 'warning';

            return (
              <div key={materia.materia}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{materia.materia}</span>
                    <Badge variant={badgeVariant}>{porcentaje}%</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {materia.correctas}/{materia.total} correctas
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Tus últimas sesiones de práctica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estadisticas?.actividad_reciente.map((actividad: any, index: number) => {
              const porcentaje = Math.round(
                (actividad.correctas / actividad.ejercicios) * 100
              );
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold">{actividad.materia}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(actividad.fecha).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">{porcentaje}%</div>
                    <div className="text-sm text-muted-foreground">
                      {actividad.correctas}/{actividad.ejercicios} correctas
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Motivación */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-primary/20">
        <CardContent className="py-8 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold mb-2">¡Excelente trabajo!</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Llevas {estadisticas?.total_ejercicios || 0} ejercicios completados
            con un {porcentajeExito}% de éxito. ¡Sigue así!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
