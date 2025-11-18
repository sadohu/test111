import { redirect } from 'next/navigation';

/**
 * Página raíz - Redirige a login o dashboard según autenticación
 */
export default function HomePage() {
  // TODO: Verificar autenticación con el token almacenado
  // Por ahora redirige a login
  redirect('/login');
}
