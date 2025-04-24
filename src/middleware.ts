import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { publicRoutes } from "./const/publicRoutes.const";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Si la ruta es pública, permitir acceso
  if (publicRoutes.includes(pathname)) {
    // Si hay token y está en una ruta pública, redirigir al home
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Si no hay token y la ruta no es pública, redirigir al login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Guardamos la URL original para redirigir después del login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with extensions (static files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
