import { NextRequest, NextResponse } from "next/server";
import { fetchCatalogoBackend } from "@/lib/catalogo";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categoria = searchParams.get("categoria") || undefined;
  const comEstoque = searchParams.get("com_estoque") === "true";

  try {
    const { produtos } = await fetchCatalogoBackend({
      categoria,
      includeCategorias: false,
      includeProdutos: true,
      comEstoque,
      timeoutMs: 30_000,
      retries: 3,
    });

    return NextResponse.json(produtos, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("api/produtos error:", error);
    return NextResponse.json([], {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
