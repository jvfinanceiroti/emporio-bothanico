# Checklist - Site funcionando

## 1. Vercel (Frontend)

No painel da Vercel → seu projeto → **Settings** → **Environment Variables**:

- [ ] **NEXT_PUBLIC_API_URL** = `https://emporio-bothanico.onrender.com`
  - Ambiente: **Production** (e Preview se quiser)
  - ⚠️ Variáveis NEXT_PUBLIC_* exigem um **novo deploy** para entrarem em vigor

Depois de alterar, faça: **Deployments** → **Redeploy** no último deploy.

---

## 2. Render (Backend)

- [x] **FRONTEND_URL** = `https://www.emporiobothanico.com.br`
- [x] **CORS_ORIGIN** = `https://emporio-bothanico.vercel.app` (opcional)
- [x] Demais variáveis (DATABASE_URL, JWT_SECRET, etc.)

Após adicionar/alterar variáveis, é preciso um **novo deploy** no Render (em geral automático ao salvar).

---

## 3. Conferir mudanças

1. **Limpar cache do navegador** – Ctrl+Shift+R ou testar em aba anônima
2. Aguardar o deploy da Vercel terminar (1–2 minutos)
3. Acessar: https://www.emporiobothanico.com.br

---

## Se ainda não funcionar

- Abra o **Console** do navegador (F12 → aba Console) e veja erros de rede
- Verifique em **Network** (aba Network) se as requisições para o Render retornam 200 ou erro
- Se houver erro de CORS, a FRONTEND_URL no Render está incorreta ou o backend precisa ser redeployado
