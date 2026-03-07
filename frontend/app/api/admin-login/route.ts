import { NextRequest, NextResponse } from "next/server";

const PROD_API_URL = "https://emporio-bothanico.onrender.com";
const API_URL =
  process.env.NODE_ENV === "production"
    ? PROD_API_URL
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
// Instância free do Render pode demorar ~50s para acordar.
const LOGIN_TIMEOUT_MS = 70_000;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const senha = formData.get("senha")?.toString();

    if (!email || !senha) {
      return NextResponse.redirect(new URL("/admin/login?erro=Email+e+senha+obrigat%C3%B3rios", request.url), 303);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = encodeURIComponent(data.error || "Email ou senha incorretos");
      return NextResponse.redirect(new URL(`/admin/login?erro=${msg}`, request.url), 303);
    }

    const host = request.headers.get("host") || "";
    const isPainel = host.startsWith("painel.") || host.includes("painel.");
    const basePath = isPainel ? "" : "/admin";
    const redirectUrl = new URL(`${basePath || ""}/admin/auth/store-token`, request.url);
    redirectUrl.searchParams.set("t", data.token);
    if (data.usuario) {
      redirectUrl.searchParams.set("u", JSON.stringify(data.usuario));
    }

    // 303 See Other: redireciona com GET (307 preservaria POST e causaria 405 no store-token)
    return NextResponse.redirect(redirectUrl, 303);
  } catch (error) {
    console.error("admin-login error:", error);
    const isAbortError = error instanceof Error && error.name === "AbortError";
    const msg = isAbortError ? "Servidor+demorou+para+responder" : "Erro+ao+conectar";
    return NextResponse.redirect(new URL(`/admin/login?erro=${msg}`, request.url), 303);
  }
}
