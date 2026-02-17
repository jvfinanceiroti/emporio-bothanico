import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SUBDOMAIN = "painel.emporiobothanico.com.br";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // SEGURANÇA: /admin no domínio principal NÃO existe - redireciona para subdomínio (quem sabe) ou para a loja
  if (host === "emporiobothanico.com.br" || host === "www.emporiobothanico.com.br") {
    const pathname = url.pathname;
    if (pathname.startsWith("/admin")) {
      // Redireciona para painel (quem conhece o subdomínio acessa por lá)
      const restante = pathname === "/admin" || pathname === "/admin/" ? "" : pathname.slice(7).replace(/^\/+/, "");
      const novoPath = restante ? `/${restante}` : "/";
      return NextResponse.redirect(new URL(`https://${ADMIN_SUBDOMAIN}${novoPath}`), 307);
    }
  }

  // Se acessar pelo subdomínio do painel, reescreve para /admin
  if (host.startsWith("painel.") || host === ADMIN_SUBDOMAIN) {
    const pathname = url.pathname;

    // NUNCA reescrever /api, /_next, etc - passa direto
    if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
      return NextResponse.next();
    }

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
