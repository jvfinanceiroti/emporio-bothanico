# 🚨 ERRO: Token de acesso não fornecido - SOLUÇÃO DEFINITIVA

## ❌ Problema Observado

No console do navegador aparece:
```
Erro ao buscar pedidos: Error: Token de acesso não fornecido
Status da resposta: 401
```

## 🔍 Causa Real

O frontend em **produção** está usando `http://localhost:5000` ao invés de `https://emporio-bothanico.onrender.com`.

**Por quê?** Você adicionou a variável `NEXT_PUBLIC_API_URL` no Render, mas o Next.js **compila essas variáveis durante o build**. O build antigo ainda tem `localhost` hardcoded.

---

## ✅ SOLUÇÃO (Execute AGORA)

### 1️⃣ Confirmar Variável no Render (Frontend)

1. Acesse: https://dashboard.render.com
2. Selecione o serviço do **FRONTEND** 
3. Vá em **Environment**
4. Confirme que existe:
   ```
   NEXT_PUBLIC_API_URL = https://emporio-bothanico.onrender.com
   ```

### 2️⃣ FORÇAR REBUILD COMPLETO (CRÍTICO!)

**No serviço do FRONTEND no Render:**

1. Clique em **Manual Deploy**
2. Selecione **"Clear build cache & deploy"** ← IMPORTANTE!
3. Aguarde 3-5 minutos

**Por que "Clear build cache"?**
- Remove o código compilado antigo
- Força recompilação com a nova variável
- Sem isso, o Next.js usa cache e mantém `localhost`

### 3️⃣ Verificar no Navegador

Após o deploy:

1. Abra: https://emporiobothanico.com.br/meus-pedidos
2. Pressione `Ctrl + Shift + R` (hard refresh para limpar cache do navegador)
3. Abra DevTools (F12) → Aba **Network**
4. Digite um email e clique em "Buscar"
5. Verifique a URL da requisição:
   - ✅ Deve ser: `https://emporio-bothanico.onrender.com/pedidos/buscar`
   - ❌ Se for: `http://localhost:5000/pedidos/buscar` → build não atualizou

---

## 🧪 Teste Rápido da API (Opcional)

Para confirmar que o backend está funcionando:

```powershell
# No PowerShell
Invoke-RestMethod -Uri "https://emporio-bothanico.onrender.com/pedidos/buscar?tipo=email&valor=kleb@gmail.com"
```

Deve retornar JSON com os pedidos.

---

## 📋 Checklist de Verificação

- [ ] Variável `NEXT_PUBLIC_API_URL` existe no Render (serviço frontend)
- [ ] Deploy com "Clear build cache" foi executado
- [ ] Aguardei 3-5 minutos para o build completar
- [ ] Fiz hard refresh no navegador (`Ctrl + Shift + R`)
- [ ] Verifiquei no Network que a URL não é mais `localhost`

---

## 🔧 Se Ainda Não Funcionar

Teste localmente para garantir que o código está correto:

```powershell
cd C:\Users\joaov\loja\frontend
$env:NEXT_PUBLIC_API_URL="https://emporio-bothanico.onrender.com"
npm run build
npm run start
```

Acesse: http://localhost:3000/meus-pedidos e teste.

---

**Status:** ⏳ Aguardando rebuild do frontend no Render
**Ação necessária:** Clear build cache & deploy
