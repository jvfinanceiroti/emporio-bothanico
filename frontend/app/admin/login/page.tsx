const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emporiobothanico.com.br";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const params = await searchParams;
  const erro = params.erro ? decodeURIComponent(params.erro) : "";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; overflow: hidden; background: #eef1f5; }
        .admin-login-card { width: 100%; max-width: 28rem; padding: 2rem; border-radius: 1rem; border: 1px solid #e2e8f0; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); background: #fff; }
        .admin-login-title { font-size: 1.5rem; font-weight: 800; color: #2563eb; margin-bottom: 0.25rem; }
        .admin-login-subtitle { font-size: 0.875rem; font-weight: 500; color: #64748b; }
        .admin-login-input { width: 100%; padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; font-size: 1rem; outline: none; box-sizing: border-box; }
        .admin-login-input:focus { border-color: #2563eb; }
        .admin-login-btn { width: 100%; padding: 1rem 1.5rem; background: #2563eb; color: #fff !important; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 700; cursor: pointer; }
        .admin-login-btn:hover { background: #1d4ed8; }
        .admin-login-link { color: #2563eb; text-decoration: none; font-weight: 600; font-size: 0.875rem; }
        .admin-login-link:hover { text-decoration: underline; }
        .admin-login-error { background: #fef2f2; border: 1px solid #ef4444; color: #dc2626; padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; }
      `}} />
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
            <img src="/logo.png?v=20260630t" alt="Empório Bothânico" style={{ width: 80, height: 80, marginBottom: "1rem", objectFit: "contain" }} />
            <h1 className="admin-login-title">Empório Bothânico</h1>
            <p className="admin-login-subtitle">Área Administrativa</p>
          </div>

          {erro && (
            <div className="admin-login-error">
              {erro}
            </div>
          )}

          <form action="/api/admin-login" method="POST" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="admin-login-input"
              />
            </div>

            <div>
              <label htmlFor="senha" style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="••••••••"
                required
                className="admin-login-input"
              />
            </div>

            <button type="submit" className="admin-login-btn">
              Entrar
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <a href={SITE_URL} className="admin-login-link">
              ← Voltar para a loja
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
