# 🛍️ Empório Bothanico - E-commerce Premium

Loja online moderna de perfumaria e produtos de banho, desenvolvida com Next.js, Node.js e PostgreSQL.

## 🚀 Deploy Profissional

### Pré-requisitos
- Conta no GitHub
- Conta no Supabase (banco de dados)
- Conta no Railway (backend)
- Conta no Vercel (frontend)

---

## 📦 PASSO 1: Configurar Banco de Dados (Supabase)

1. Acesse https://supabase.com e faça login
2. Clique em "New Project"
3. Configure:
   - Nome: `emporio-bothanico`
   - Senha do banco: (crie uma senha forte)
   - Região: `South America (São Paulo)`
4. Aguarde o banco ser criado (2-3 minutos)
5. No menu lateral, vá em **SQL Editor**
6. Cole o conteúdo do arquivo `backend/schema.sql`
7. Clique em "Run" para criar as tabelas
8. No menu lateral, vá em **Settings > Database**
9. Copie a **Connection String** (modo Pooler)

---

## 🔧 PASSO 2: Deploy do Backend (Railway)

1. Acesse https://railway.app e faça login
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Conecte seu GitHub e selecione o repositório
4. Clique em "Add variables" e configure:
   ```
   DB_HOST=seu-projeto.supabase.co
   DB_USER=postgres
   DB_PASSWORD=sua-senha-supabase
   DB_NAME=postgres
   DB_PORT=5432
   JWT_SECRET=chave-secreta-aleatoria-muito-longa
   ```
5. Em "Settings" → "Networking", copie a **Public URL**
6. Salve essa URL (ex: `https://seu-backend.railway.app`)

---

## 🎨 PASSO 3: Deploy do Frontend (Vercel)

1. Acesse https://vercel.com e faça login
2. Clique em "Add New" → "Project"
3. Importe o repositório do GitHub
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Environment Variables**:
     ```
     NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
     ```
5. Clique em "Deploy"
6. Aguarde o deploy finalizar

---

## 🌐 PASSO 4: Configurar Domínio Personalizado

1. No painel da Vercel, clique no projeto
2. Vá em "Settings" → "Domains"
3. Adicione seu domínio (ex: `emporiobothanico.com.br`)
4. A Vercel mostrará os registros DNS necessários
5. No seu provedor de domínio (Registro.br, GoDaddy, etc):
   - Tipo: `A` → Valor: `76.76.21.21`
   - Tipo: `CNAME` → Nome: `www` → Valor: `cname.vercel-dns.com`
6. Aguarde propagação DNS (até 48h, geralmente 15min)

---

## 🔐 Credenciais de Acesso Admin

- **Email**: admin@emporio.com.br
- **Senha**: admin123

⚠️ **IMPORTANTE**: Altere essa senha após primeiro login!

---

## 📝 Stack Tecnológico

- **Frontend**: Next.js 16, React, TypeScript
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL (Supabase)
- **Deploy**: Vercel + Railway
- **Autenticação**: JWT + bcrypt

---

## 🛠️ Desenvolvimento Local

### Backend
```bash
cd backend
npm install
# Configure .env com dados locais
npm start
```

### Frontend
```bash
cd frontend
npm install
# Configure .env.local
npm run dev
```

---

## 📧 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

---

Desenvolvido com ❤️ usando Verdent AI
