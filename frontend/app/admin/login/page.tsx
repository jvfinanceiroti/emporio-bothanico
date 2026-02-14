"use client";

import { API_URL } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "Erro ao fazer login");
        setCarregando(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Erro ao conectar ao servidor");
      setCarregando(false);
    }
  };

  return (
    <div className="admin-theme min-h-screen flex items-center justify-center p-4" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--border)] shadow-[var(--shadow-xl)]" style={{ background: "var(--surface)" }}>
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Empório Bothânico" className="h-16 w-16 mb-4" />
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--accent)" }}>Empório Bothânico</h1>
          <p className="text-sm font-medium mt-1" style={{ color: "var(--muted)" }}>Área Administrativa</p>
        </div>

        {erro && (
          <div className="mb-6 px-4 py-3 rounded-lg flex items-center gap-2 border" style={{ background: "var(--error-bg)", borderColor: "var(--error)", color: "var(--error)" }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              autoComplete="current-password"
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn-primary w-full py-4 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ background: carregando ? "var(--muted)" : "var(--accent)", borderColor: carregando ? "var(--muted)" : "var(--accent)" }}
          >
            {carregando ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : (
              "🔒 Entrar"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="store-link text-sm">
            ← Voltar para a loja
          </Link>
        </div>

      </div>
    </div>
  );
}
