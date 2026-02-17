import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos - Perfumes, Aromas e Produtos de Banho",
  description: "Explore nossa coleção de perfumes, aromas de ambiente, sabonetes artesanais, difusores, velas e produtos de banho. Empório Bothânico - Itabira MG. Entrega para todo Brasil.",
  openGraph: {
    title: "Produtos | Empório Bothânico",
    description: "Fragrâncias exclusivas e produtos de banho. Sabonetes, difusores, velas aromáticas.",
  },
};

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
