'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { PerfilService, AuthService } from '@/services';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      setIsLoading(true);

      try {
        // Obtener estudiante_id del AuthService
        const estudianteId = AuthService.getEstudianteId();

        if (!estudianteId) {
          console.error('No se encontró el ID del estudiante');
          setIsLoading(false);
          return;
        }

        // Llamar al servicio para obtener perfil
        const resultado = await PerfilService.obtenerPerfil(estudianteId);

        if (resultado.success && resultado.perfil) {
          setPerfil(resultado.perfil);
        } else {
          console.error('Error al obtener perfil:', resultado.error);
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  const handleReconfigurar = () => {
    // Redirigir a cuestionario de categorización
    router.push('/categorizar');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-64" />
      </div>
    );
  }

  const categoriasInfo: Record<string, { nombre: string; color: string; descripcion: string }> = {
    explorador_creativo: {
      nombre: 'Explorador Creativo',
      color: 'accent',
      descripcion: 'Te encanta descubrir y crear cosas nuevas',
    },
    estudiante_aplicado: {
      nombre: 'Estudiante Aplicado',
      color: 'primary',
      descripcion: 'Eres organizado y constante en tus estudios',
    },
    pensador_logico: {
      nombre: 'Pensador Lógico',
      color: 'secondary',
      descripcion: 'Excelente razonamiento matemático y analítico',
    },
    lector_entusiasta: {
      nombre: 'Lector Entusiasta',
      color: 'info',
      descripcion: 'Disfrutas de la lectura y la comunicación',
    },
  };

  const categoriaInfo = categoriasInfo[perfil?.categoria_principal] || {
    nombre: perfil?.categoria_principal,
    color: 'primary',
    descripcion: '',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Información sobre tu perfil de aprendizaje
        </p>
      </div>

      {/* Success Alert */}
      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)}>
          Perfil actualizado correctamente
        </Alert>
      )}

      {/* Información principal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{perfil?.nombre}</CardTitle>
              <CardDescription>Grado: {perfil?.grado}</CardDescription>
            </div>
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Categoría de Aprendizaje
            </label>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={categoriaInfo.color as any} className="text-base">
                {categoriaInfo.nombre}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {categoriaInfo.descripcion}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Estilo de Aprendizaje
            </label>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="primary">
                {perfil?.estilo_aprendizaje === 'visual' && '👁️ Visual'}
                {perfil?.estilo_aprendizaje === 'auditivo' && '👂 Auditivo'}
                {perfil?.estilo_aprendizaje === 'kinestesico' && '✋ Kinestésico'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Nivel de Riesgo
            </label>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={
                  perfil?.nivel_riesgo === 'bajo'
                    ? 'success'
                    : perfil?.nivel_riesgo === 'medio'
                    ? 'warning'
                    : 'error'
                }
              >
                {perfil?.nivel_riesgo?.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleReconfigurar}>
            Reconfigurar Perfil
          </Button>
        </CardFooter>
      </Card>

      {/* Fortalezas */}
      <Card>
        <CardHeader>
          <CardTitle>Fortalezas</CardTitle>
          <CardDescription>Áreas en las que destacas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {perfil?.fortalezas.map((fortaleza: string, index: number) => (
              <Badge key={index} variant="success">
                ✓ {fortaleza}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Áreas de mejora */}
      <Card>
        <CardHeader>
          <CardTitle>Áreas de Mejora</CardTitle>
          <CardDescription>Oportunidades para crecer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {perfil?.areas_mejora.map((area: string, index: number) => (
              <Badge key={index} variant="warning">
                → {area}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivación */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border-primary/20">
        <CardContent className="py-8 text-center">
          <div className="text-5xl mb-4">
            {perfil?.motivacion === 'alta' && '🌟'}
            {perfil?.motivacion === 'media' && '⭐'}
            {perfil?.motivacion === 'baja' && '💫'}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Nivel de Motivación:{' '}
            {perfil?.motivacion?.charAt(0).toUpperCase() +
              perfil?.motivacion?.slice(1)}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tu perfil ha sido configurado para brindarte la mejor experiencia de
            aprendizaje
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
