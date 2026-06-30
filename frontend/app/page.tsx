import { HomeClient } from "@/components/HomeClient";
import { fetchCatalogoBackend, filtrarProdutosVisiveis } from "@/lib/catalogo";

export const revalidate = 60;

async function getCatalogoInicial() {
  const data = await fetchCatalogoBackend({
    timeoutMs: 15_000,
    retries: 2,
  });
  return {
    produtos: filtrarProdutosVisiveis(data.produtos),
    categorias: data.categorias,
  };
}

export default async function Home() {
  const { produtos, categorias } = await getCatalogoInicial();
  return <HomeClient produtosIniciais={produtos} categoriasIniciais={categorias} />;
}
