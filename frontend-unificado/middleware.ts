import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de autenticación
 *
 * Protege las rutas que requieren autenticación y redirige según el estado del usuario:
 * - Si no está autenticado y accede a rutas protegidas → redirige a /login
 * - Si está autenticado y accede a /login o /registro → redirige a /ejercicios
 * - Si está autenticado pero no tiene perfil → redirige a /categorizar
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener token de autenticación de las cookies
  const authToken = request.cookies.get('auth_token')?.value;

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/registro', '/recuperar-password'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Rutas protegidas que requieren autenticación
  const protectedPaths = ['/ejercicios', '/reportes', '/perfil', '/categorizar'];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Si no hay token y está intentando acceder a una ruta protegida
  if (!authToken && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Si hay token y está intentando acceder a rutas de autenticación
  if (authToken && isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/ejercicios';
    return NextResponse.redirect(url);
  }

  // TODO: Verificar si el usuario tiene perfil clasificado
  // Si no tiene perfil, redirigir a /categorizar
  // const hasPerfil = request.cookies.get('has_perfil')?.value === 'true';
  // if (authToken && !hasPerfil && !pathname.startsWith('/categorizar')) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/categorizar';
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

// Configurar las rutas donde se ejecutará el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
