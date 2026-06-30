"use client";

import { useEffect, useState } from "react";
import {
  type CatalogoOptions,
  type CatalogoResponse,
  type Produto,
  type Categoria,
  fetchCatalogoComCache,
  filtrarProdutosVisiveis,
  lerCacheCatalogo,
} from "@/lib/catalogo";

interface UseCatalogoResult {
  produtos: Produto[];
  categorias: Categoria[];
  carregando: boolean;
  erro: string | null;
  fromCache: boolean;
}

export function useCatalogo(
  options: CatalogoOptions = {},
  produtosIniciais: Produto[] = [],
  categoriasIniciais: Categoria[] = []
): UseCatalogoResult {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasIniciais);
  const [carregando, setCarregando] = useState(
    produtosIniciais.length === 0 && categoriasIniciais.length === 0
  );
  const [erro, setErro] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const categoria = options.categoria ?? null;
  const comEstoque = options.comEstoque ?? false;
  const includeCategorias = options.includeCategorias ?? true;
  const includeProdutos = options.includeProdutos ?? true;

  useEffect(() => {
    let cancelado = false;

    const opts: CatalogoOptions = {
      categoria,
      comEstoque,
      includeCategorias,
      includeProdutos,
    };

    if (produtosIniciais.length > 0 || categoriasIniciais.length > 0) {
      setCarregando(false);
      // Atualiza em background para dados frescos
      fetchCatalogoComCache(opts).then(({ data, fromCache: fc }) => {
        if (cancelado) return;
        if (includeProdutos) setProdutos(filtrarProdutosVisiveis(data.produtos));
        if (includeCategorias) setCategorias(data.categorias);
        setFromCache(fc);
      }).catch(() => {});
      return () => { cancelado = true; };
    }

    const cacheLocal = lerCacheCatalogo(opts);
    if (cacheLocal) {
      if (includeProdutos) setProdutos(filtrarProdutosVisiveis(cacheLocal.produtos));
      if (includeCategorias) setCategorias(cacheLocal.categorias);
      setCarregando(false);
      setFromCache(true);
    } else {
      setCarregando(true);
    }

    fetchCatalogoComCache(opts)
      .then(({ data, fromCache: fc }) => {
        if (cancelado) return;
        if (includeProdutos) setProdutos(filtrarProdutosVisiveis(data.produtos));
        if (includeCategorias) setCategorias(data.categorias);
        setFromCache(fc);
        setErro(data.produtos.length === 0 && data.categorias.length === 0 && !fc ? "Catálogo indisponível" : null);
      })
      .catch(() => {
        if (!cancelado && !cacheLocal) {
          setErro("Não foi possível carregar o catálogo");
        }
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => { cancelado = true; };
  }, [categoria, comEstoque, includeCategorias, includeProdutos, produtosIniciais.length, categoriasIniciais.length]);

  return { produtos, categorias, carregando, erro, fromCache };
}
