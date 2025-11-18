'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

/**
 * Error boundary global
 * Captura errores no manejados y muestra una interfaz amigable
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error para debugging
    console.error('Error capturado por boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        {/* Icono de error */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 mb-4">
            <svg
              className="w-10 h-10 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">¡Oops! Algo salió mal</h1>
          <p className="text-muted-foreground">
            Ha ocurrido un error inesperado. No te preocupes, puedes intentarlo
            de nuevo.
          </p>
        </div>

        {/* Detalles del error (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <Alert variant="error">
            <strong>Error de desarrollo:</strong>
            <pre className="mt-2 text-xs overflow-auto max-h-40">
              {error.message}
            </pre>
            {error.digest && (
              <p className="mt-2 text-xs">Digest: {error.digest}</p>
            )}
          </Alert>
        )}

        {/* Acciones */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={reset} className="w-full">
            Intentar de nuevo
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/ejercicios')}
            className="w-full"
          >
            Ir al inicio
          </Button>
        </div>

        {/* Información de ayuda */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Si el problema persiste, por favor contacta con soporte técnico
          </p>
        </div>
      </div>
    </div>
  );
}
