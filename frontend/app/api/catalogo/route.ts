import { NextRequest, NextResponse } from "next/server";
import { fetchCatalogoBackend } from "@/lib/catalogo";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categoria = searchParams.get("categoria") || undefined;
  const includeRaw = (searchParams.get("include") || "categorias,produtos").toLowerCase();
  const comEstoque = searchParams.get("com_estoque") === "true";

  try {
    const data = await fetchCatalogoBackend({
      categoria,
      includeCategorias: includeRaw.includes("categorias"),
      includeProdutos: includeRaw.includes("produtos"),
      comEstoque,
      timeoutMs: 30_000,
      retries: 3,
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("api/catalogo error:", error);
    return NextResponse.json(
      { categorias: [], produtos: [], error: "Catálogo indisponível" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
