/**
 * Loading state global
 * Se muestra automáticamente cuando Next.js está cargando una nueva página
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {/* Spinner animado */}
        <div className="inline-flex items-center justify-center">
          <svg
            className="animate-spin h-12 w-12 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Cargando...</h2>
          <p className="text-sm text-muted-foreground">
            Por favor espera un momento
          </p>
        </div>

        {/* Barra de progreso indeterminada */}
        <div className="w-64 mx-auto">
          <div className="progress-bar">
            <div
              className="progress-bar-fill animate-pulse"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
