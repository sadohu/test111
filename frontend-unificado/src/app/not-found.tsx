import Link from 'next/link';
import { Button } from '@/components/ui/Button';

/**
 * Página 404 - No encontrado
 * Se muestra cuando el usuario accede a una ruta que no existe
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        {/* Ilustración 404 */}
        <div className="text-center">
          <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2">Página no encontrada</h1>
          <p className="text-lg text-muted-foreground">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-3">
          <Link href="/ejercicios">
            <Button variant="primary" className="w-full">
              Ir al inicio
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Ir a login
            </Button>
          </Link>
        </div>

        {/* Sugerencias */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-border">
          <h3 className="font-semibold mb-2">Páginas útiles:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <Link href="/ejercicios" className="hover:text-primary">
                → Ejercicios
              </Link>
            </li>
            <li>
              <Link href="/reportes" className="hover:text-primary">
                → Reportes
              </Link>
            </li>
            <li>
              <Link href="/perfil" className="hover:text-primary">
                → Mi Perfil
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
