import type { Metadata } from "next";
import { API_URL } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emporiobothanico.com.br";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/produtos/${id}`, {
      next: { revalidate: 60 },
    });
    const p = await res.json();
    if (!p?.nome) return { title: "Produto" };

    const preco = p.preco ? `R$ ${Number(p.preco).toFixed(2).replace(".", ",")}` : "";
    const desc = p.descricao || `Compre ${p.nome} no Empório Bothânico. Perfumes e aromas - Itabira MG.`;
    const img = p.imagem_url || `${SITE_URL}/logo.png`;

    return {
      title: `${p.nome} ${preco ? `- ${preco}` : ""}`,
      description: desc.slice(0, 160),
      openGraph: {
        title: `${p.nome} | Empório Bothânico`,
        description: desc.slice(0, 160),
        images: [{ url: img, alt: p.nome }],
      },
    };
  } catch {
    return { title: "Produto" };
  }
}

export default function ProdutoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
