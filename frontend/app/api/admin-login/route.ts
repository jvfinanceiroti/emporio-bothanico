import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const senha = formData.get("senha")?.toString();

    if (!email || !senha) {
      return NextResponse.redirect(new URL("/admin/login?erro=Email+e+senha+obrigat%C3%B3rios", request.url));
    }

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = encodeURIComponent(data.error || "Email ou senha incorretos");
      return NextResponse.redirect(new URL(`/admin/login?erro=${msg}`, request.url));
    }

    const host = request.headers.get("host") || "";
    const isPainel = host.startsWith("painel.") || host.includes("painel.");
    const basePath = isPainel ? "" : "/admin";
    const redirectUrl = new URL(`${basePath || ""}/admin/auth/store-token`, request.url);
    redirectUrl.searchParams.set("t", data.token);
    if (data.usuario) {
      redirectUrl.searchParams.set("u", JSON.stringify(data.usuario));
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("admin-login error:", error);
    return NextResponse.redirect(new URL("/admin/login?erro=Erro+ao+conectar", request.url));
  }
}
