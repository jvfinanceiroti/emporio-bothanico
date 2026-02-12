"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [quantidade, setQuantidade] = useState(0);

  useEffect(() => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    setQuantidade(carrinho.length);

    const interval = setInterval(() => {
      const carrinhoAtual = JSON.parse(
        localStorage.getItem("carrinho") || "[]"
      );
      setQuantidade(carrinhoAtual.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="pt-br">
      <body>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 20,
            borderBottom: "1px solid #eee",
          }}
        >
          <Link href="/">
            <h2 style={{ cursor: "pointer" }}>Minha Loja</h2>
          </Link>

          <Link href="/carrinho">
            <span style={{ cursor: "pointer" }}>
              🛒 Carrinho ({quantidade})
            </span>
          </Link>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
