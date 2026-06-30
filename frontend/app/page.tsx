import { HomeClient } from "@/components/HomeClient";
import { fetchCatalogoBackend, filtrarProdutosVisiveis } from "@/lib/catalogo";

export const revalidate = 60;

async function getCatalogoInicial() {
  try {
    const data = await fetchCatalogoBackend({
      timeoutMs: 30_000,
      retries: 3,
    });
    return {
      produtos: filtrarProdutosVisiveis(data.produtos),
      categorias: data.categorias,
    };
  } catch (err) {
    console.error("SSR home catálogo:", err);
    return { produtos: [], categorias: [] };
  }
}

export default async function Home() {
  const { produtos, categorias } = await getCatalogoInicial();
  return <HomeClient produtosIniciais={produtos} categoriasIniciais={categorias} />;
}
