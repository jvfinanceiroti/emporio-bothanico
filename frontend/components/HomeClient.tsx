"use client";

import { useEffect, useState } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCatalogo } from "@/hooks/useCatalogo";
import { getProdutoImagemPadrao, type Produto, type Categoria } from "@/lib/catalogo";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeBestSellers } from "@/components/home/HomeBestSellers";
import { HomeCategories } from "@/components/home/HomeCategories";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { HomeInstagram } from "@/components/home/HomeInstagram";

export function HomeClient({
  produtosIniciais = [],
  categoriasIniciais = [],
}: {
  produtosIniciais?: Produto[];
  categoriasIniciais?: Categoria[];
}) {
  const { produtos, categorias, carregando } = useCatalogo(
    {},
    produtosIniciais,
    categoriasIniciais
  );
  const [carrinho, setCarrinho] = useState<Produto[]>([]);
  const [ultimoAdicionadoId, setUltimoAdicionadoId] = useState<number | null>(null);

  useEffect(() => {
    const salvo = localStorage.getItem("carrinho");
    if (salvo) setCarrinho(JSON.parse(salvo));
  }, []);

  const adicionarAoCarrinho = (produto: Produto, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const novo = [...carrinho] as (Produto & { quantidade?: number })[];
    const idx = novo.findIndex((i) => i.id === produto.id);
    if (idx >= 0) novo[idx].quantidade = (novo[idx].quantidade || 1) + 1;
    else novo.push({ ...produto, quantidade: 1 });
    setCarrinho(novo as Produto[]);
    localStorage.setItem("carrinho", JSON.stringify(novo));
    window.dispatchEvent(new Event("carrinho-changed"));
    setUltimoAdicionadoId(produto.id);
    setTimeout(() => setUltimoAdicionadoId(null), 1800);
  };

  const categoriasExibir = categorias.length > 0 ? categorias : categoriasIniciais;

  return (
    <div className="home-luxury min-h-screen">
      <StoreHeader />
      <HomeHero />

      <HomeBestSellers
        produtos={produtos}
        carregando={carregando}
        getProdutoImagem={getProdutoImagemPadrao}
        onAddToCart={adicionarAoCarrinho}
        ultimoAdicionadoId={ultimoAdicionadoId}
      />

      {categoriasExibir.length > 0 && <HomeCategories categorias={categoriasExibir} />}

      <HomeTestimonials />
      <HomeInstagram />

      <div className="bg-[var(--lux-deep)]">
        <SiteFooter />
      </div>
    </div>
  );
}
