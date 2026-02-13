# 🚀 DEPLOY RÁPIDO - Vercel + Railway

## ✅ PASSO A PASSO (15 minutos)

### 📋 PREPARAÇÃO (já feito!)

✅ Git configurado
✅ Arquivos preparados para Vercel
✅ Código funcionando em localhost

---

## 🎯 ETAPA 1: Fazer Commit e Push

Execute estes comandos (já estou fazendo para você):

```powershell
git add .
git commit -m "Deploy para Vercel - Loja completa"
git push origin main
```

---

## 🎯 ETAPA 2: Deploy do Frontend (Vercel)

### 1. Criar conta/Login no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"** (ou "Login" se já tem conta)
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios

### 2. Importar Projeto

1. No dashboard do Vercel, clique em **"Add New..."** → **"Project"**
2. Procure o repositório **"loja"** na lista
3. Clique em **"Import"**

### 3. Configurar Projeto

**Root Directory:**
- Clique em **"Edit"**
- Selecione pasta **"frontend"**
- Confirmar

**Framework Preset:**
- Deve detectar automaticamente: **Next.js**

**Build Settings:**
- Deixar padrão (já configurado no `vercel.json`)

**Environment Variables:**
Adicionar estas variáveis:

```
NEXT_PUBLIC_API_URL = https://api.emporiobothanico.com.br
NODE_ENV = production
```

### 4. Deploy

1. Clicar em **"Deploy"**
2. Aguardar 2-3 minutos
3. ✅ Vercel vai gerar uma URL tipo: `https://loja-seunome.vercel.app`

---

## 🎯 ETAPA 3: Deploy do Backend (Railway)

### 1. Criar conta no Railway

1. Acesse: https://railway.app
2. Clique em **"Login with GitHub"**
3. Autorize o Railway

### 2. Criar Novo Projeto

1. Dashboard → **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório **"loja"**
4. Quando perguntar o diretório, selecione **"backend"**

### 3. Configurar Variáveis de Ambiente

No painel do Railway:

1. Aba **"Variables"**
2. Adicionar:

```
DATABASE_URL = sua-connection-string-do-supabase
JWT_SECRET = minha-chave-secreta-123456
PORT = 3001
```

### 4. Deploy

1. Railway faz deploy automático
2. Após terminar, clique em **"Settings"** → **"Generate Domain"**
3. ✅ Railway vai gerar URL tipo: `https://backend-production-xxxx.up.railway.app`

---

## 🎯 ETAPA 4: Conectar Frontend ao Backend

### 1. Atualizar URL da API no Vercel

1. No dashboard do Vercel, entre no projeto
2. **"Settings"** → **"Environment Variables"**
3. **Editar** a variável `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL = https://backend-production-xxxx.up.railway.app
   ```
   (Cole a URL que o Railway gerou)
4. **Save**
5. **"Deployments"** → Redeploy (botão com 3 pontinhos → Redeploy)

### 2. Configurar CORS no Backend

Adicionar a URL do Vercel no backend:

```javascript
// No backend/server.js, na seção CORS:
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://loja-seunome.vercel.app'  // Adicionar sua URL Vercel
  ],
  credentials: true
}));
```

Commit e push:
```powershell
git add backend/server.js
git commit -m "Adicionar CORS para Vercel"
git push
```

Railway faz redeploy automático.

---

## 🎯 ETAPA 5: Conectar Seu Domínio (emporiobothanico.com.br)

### No Vercel:

1. Projeto → **"Settings"** → **"Domains"**
2. Adicionar: `emporiobothanico.com.br`
3. Vercel vai mostrar instruções de DNS

### No Hostinger (DNS):

1. hPanel → **"Domínios"** → `emporiobothanico.com.br`
2. **"DNS / Nameservers"** → **"DNS Records"**
3. Adicionar/Editar registro:
   - **Type:** A
   - **Name:** @ (ou deixar vazio)
   - **Value:** `76.76.21.21` (IP do Vercel)
4. Adicionar CNAME:
   - **Type:** CNAME
   - **Name:** www
   - **Value:** `cname.vercel-dns.com`
5. **Save**

### Aguardar propagação DNS (5-30 minutos)

Depois disso:
- ✅ `https://emporiobothanico.com.br` → Seu site!
- ✅ SSL automático (HTTPS)

---

## 🎯 ETAPA 6 (Opcional): Subdomínio para API

Se quiser usar `api.emporiobothanico.com.br`:

### No Railway:
1. **"Settings"** → **"Custom Domain"**
2. Adicionar: `api.emporiobothanico.com.br`
3. Railway mostra valor CNAME

### No Hostinger DNS:
1. Adicionar registro:
   - **Type:** CNAME
   - **Name:** api
   - **Value:** (valor que Railway mostrou)
2. **Save**

Aguardar propagação (5-30 min).

Depois atualizar `NEXT_PUBLIC_API_URL` no Vercel para:
```
NEXT_PUBLIC_API_URL = https://api.emporiobothanico.com.br
```

---

## 📋 CHECKLIST FINAL

- [ ] Código commitado e pushed para GitHub
- [ ] Frontend deployado no Vercel
- [ ] Backend deployado no Railway
- [ ] Variáveis de ambiente configuradas em ambos
- [ ] Frontend conectado ao backend (URL atualizada)
- [ ] CORS configurado no backend
- [ ] Domínio conectado ao Vercel
- [ ] DNS propagado (teste: https://emporiobothanico.com.br)
- [ ] Site funcionando com produtos
- [ ] Admin funcionando

---

## 🎉 RESULTADO FINAL

- 🛍️ **Loja:** https://emporiobothanico.com.br
- 🔧 **Admin:** https://emporiobothanico.com.br/admin/login
- 🚀 **API:** https://api.emporiobothanico.com.br
- ✅ **SSL:** Automático
- ✅ **Deploy:** Automático via Git push
- ✅ **Custo:** R$ 0,00 (grátis)

---

## 💡 VANTAGENS

✅ Deploy em 2 minutos após push
✅ SSL/HTTPS automático
✅ CDN global (site super rápido)
✅ Logs e monitoramento
✅ Rollback fácil
✅ 100% profissional
✅ Grátis para sempre (com limites generosos)

---

**Qualquer dúvida em alguma etapa, me chama! 🚀**
