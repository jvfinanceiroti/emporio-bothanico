import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SUBDOMAIN = "painel.emporiobothanico.com.br";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Se acessar pelo subdomínio do painel, reescreve para /admin
  if (host.startsWith("painel.") || host === ADMIN_SUBDOMAIN) {
    const pathname = url.pathname;

    // / ou vazio -> /admin/login
    if (pathname === "/" || pathname === "") {
      url.pathname = "/admin/login";
      return NextResponse.rewrite(url);
    }

    // /login -> /admin/login
    if (pathname === "/login") {
      url.pathname = "/admin/login";
      return NextResponse.rewrite(url);
    }

    // Qualquer outro path: /dashboard -> /admin/dashboard
    if (!pathname.startsWith("/admin")) {
      url.pathname = `/admin${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
