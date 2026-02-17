"use client";

import { API_URL } from "@/lib/api";
import { getAdminPath } from "@/lib/admin-paths";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emporiobothanico.com.br";

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

      router.push(getAdminPath("/dashboard"));
    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Erro ao conectar ao servidor");
      setCarregando(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; overflow: hidden; background: #eef1f5; }
        .admin-login-card { width: 100%; max-width: 28rem; padding: 2rem; border-radius: 1rem; border: 1px solid #e2e8f0; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); background: #fff; }
        .admin-login-title { font-size: 1.5rem; font-weight: 800; color: #2563eb; margin-bottom: 0.25rem; }
        .admin-login-subtitle { font-size: 0.875rem; font-weight: 500; color: #64748b; }
        .admin-login-input { width: 100%; padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem; outline: none; transition: border-color 0.2s; }
        .admin-login-input:focus { border-color: #2563eb; }
        .admin-login-btn { width: 100%; padding: 1rem 1.5rem; background: #2563eb; color: #fff !important; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: background 0.2s; }
        .admin-login-btn:hover:not(:disabled) { background: #1d4ed8; }
        .admin-login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .admin-login-link { color: #2563eb; text-decoration: none; font-weight: 600; font-size: 0.875rem; }
        .admin-login-link:hover { text-decoration: underline; }
        .admin-login-error { background: #fef2f2; border: 1px solid #ef4444; color: #dc2626; padding: 0.75rem 1rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
      `}} />
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
            <img src={`${SITE_URL}/logo.png`} alt="Empório Bothânico" style={{ width: 64, height: 64, marginBottom: "1rem" }} />
            <h1 className="admin-login-title">Empório Bothânico</h1>
            <p className="admin-login-subtitle">Área Administrativa</p>
          </div>

          {erro && (
            <div className="admin-login-error">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="admin-login-input"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                autoComplete="current-password"
                onChange={(e) => setSenha(e.target.value)}
                required
                className="admin-login-input"
              />
            </div>

            <button type="submit" disabled={carregando} className="admin-login-btn">
              {carregando ? (
                <>
                  <svg style={{ animation: "spin 1s linear infinite" }} width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Entrar
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Link href="/" className="admin-login-link">
              ← Voltar para a loja
            </Link>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </>
  );
}
