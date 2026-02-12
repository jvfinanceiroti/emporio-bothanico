# 📚 GUIA COMPLETO DE DEPLOY - EMPÓRIO BOTHANICO

Siga este guia passo a passo para colocar sua loja online!

---

## ✅ CHECKLIST PRÉ-DEPLOY

### 1. Instalar Git
- Baixe em: https://git-scm.com/download/win
- Instale com configurações padrão
- Reinicie o terminal após instalação

### 2. Criar contas (TODAS GRATUITAS)
- [ ] GitHub: https://github.com/signup
- [ ] Supabase: https://supabase.com (login com GitHub)
- [ ] Railway: https://railway.app (login com GitHub)  
- [ ] Vercel: https://vercel.com (login com GitHub)

---

## 🗄️ ETAPA 1: BANCO DE DADOS (Supabase)

### 1.1 - Criar Projeto
1. Acesse https://app.supabase.com
2. Clique em "New project"
3. Preencha:
   - **Organization**: Crie uma nova ou use existente
   - **Name**: `emporio-bothanico`
   - **Database Password**: Crie uma senha FORTE e ANOTE
   - **Region**: South America (São Paulo)
   - **Pricing Plan**: Free
4. Clique em "Create new project"
5. Aguarde 2-3 minutos

### 1.2 - Criar Tabelas
1. No menu lateral, clique em **SQL Editor**
2. Clique em "New query"
3. Abra o arquivo `C:\Users\joaov\loja\backend\schema.sql`
4. Copie TODO o conteúdo e cole no SQL Editor
5. Clique em "Run" (▶️)
6. Aguarde "Success. No rows returned"

### 1.3 - Pegar Credenciais
1. No menu lateral, vá em **Settings** → **Database**
2. Role até "Connection string"
3. Selecione o modo "Pooler"
4. Copie a string que aparece (algo como):
   ```
   postgresql://postgres.xyz:[SUA-SENHA]@abc.pooler.supabase.com:5432/postgres
   ```
5. ANOTE essas informações:
   ```
   DB_HOST: abc.pooler.supabase.com
   DB_USER: postgres
   DB_PASSWORD: [a senha que você criou]
   DB_NAME: postgres
   DB_PORT: 5432
   ```

---

## 🐙 ETAPA 2: CRIAR REPOSITÓRIO NO GITHUB

### 2.1 - Pelo Terminal (se Git instalado)
```powershell
cd C:\Users\joaov\loja
git init
git add .
git commit -m "Initial commit - Emporio Bothanico"
```

### 2.2 - Criar Repositório no GitHub
1. Acesse https://github.com/new
2. Preencha:
   - **Repository name**: `emporio-bothanico`
   - **Description**: "E-commerce de perfumaria premium"
   - **Visibility**: Private (ou Public se quiser)
3. Clique em "Create repository"

### 2.3 - Fazer Push
```powershell
git remote add origin https://github.com/SEU-USUARIO/emporio-bothanico.git
git branch -M main
git push -u origin main
```

---

## 🚂 ETAPA 3: DEPLOY DO BACKEND (Railway)

### 3.1 - Criar Projeto
1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Autorize o Railway no GitHub
5. Selecione o repositório `emporio-bothanico`

### 3.2 - Configurar Variáveis
1. Clique no serviço criado
2. Vá na aba "Variables"
3. Clique em "RAW Editor"
4. Cole (substituindo pelos seus valores):
   ```
   DB_HOST=abc.pooler.supabase.com
   DB_USER=postgres
   DB_PASSWORD=sua-senha-supabase
   DB_NAME=postgres
   DB_PORT=5432
   JWT_SECRET=chave-ultra-secreta-aleatoria-muito-longa-123456789
   PORT=3001
   ```
5. Clique em "Update Variables"

### 3.3 - Configurar Root Directory
1. Vá em "Settings"
2. Em "Root Directory" digite: `backend`
3. Clique em "Update"

### 3.4 - Pegar URL
1. Vá em "Settings" → "Networking"
2. Clique em "Generate Domain"
3. Copie a URL (ex: `https://emporio-bothanico-production.railway.app`)
4. ANOTE essa URL - você vai precisar!

---

## 🚀 ETAPA 4: DEPLOY DO FRONTEND (Vercel)

### 4.1 - Criar Projeto
1. Acesse https://vercel.com
2. Clique em "Add New..." → "Project"
3. Selecione o repositório `emporio-bothanico`
4. Clique em "Import"

### 4.2 - Configurar
1. Em **Framework Preset**: Selecione "Next.js"
2. Em **Root Directory**: Clique em "Edit" e selecione `frontend`
3. Em **Environment Variables**:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://sua-url.railway.app` (a URL do Railway)
4. Clique em "Deploy"
5. Aguarde 2-3 minutos

### 4.3 - Pegar URL
1. Após deploy, você verá uma URL como: `https://emporio-bothanico.vercel.app`
2. Clique em "Visit" para acessar sua loja!

---

## 🌐 ETAPA 5: CONFIGURAR DOMÍNIO PRÓPRIO

### 5.1 - Adicionar Domínio na Vercel
1. No painel da Vercel, clique no projeto
2. Vá em "Settings" → "Domains"
3. Digite seu domínio (ex: `emporiobothanico.com.br`)
4. Clique em "Add"

### 5.2 - Configurar DNS
A Vercel mostrará algo assim:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 5.3 - No seu Provedor de Domínio
1. Acesse o painel do Registro.br / GoDaddy / etc
2. Encontre "Gerenciar DNS" ou "DNS Records"
3. Adicione os registros mostrados pela Vercel:
   - **Registro A**: Aponte `@` para `76.76.21.21`
   - **Registro CNAME**: Aponte `www` para `cname.vercel-dns.com`
4. Salve as alterações

### 5.4 - Aguardar Propagação
- Pode levar de 15 minutos até 48 horas
- Geralmente funciona em 15-30 minutos
- Teste em: https://dnschecker.org

---

## ✅ VERIFICAÇÃO FINAL

### Backend funcionando?
Acesse: `https://sua-url.railway.app/produtos`
- Deve retornar `[]` ou lista de produtos

### Frontend funcionando?
Acesse: `https://emporiobothanico.com.br`
- Deve carregar a loja

### Admin funcionando?
Acesse: `https://emporiobothanico.com.br/admin/login`
- Email: `admin@emporio.com.br`
- Senha: `admin123`

---

## 🔧 PROBLEMAS COMUNS

### Backend não conecta no banco
- Verifique se as variáveis no Railway estão corretas
- Confirme que o schema.sql foi executado no Supabase

### Frontend não carrega produtos
- Verifique se NEXT_PUBLIC_API_URL está correto na Vercel
- Teste a URL do backend diretamente no navegador

### Domínio não funciona
- Aguarde até 48h para propagação DNS
- Verifique os registros em dnschecker.org

---

## 📞 PRECISA DE AJUDA?

Se encontrar problemas:
1. Verifique os logs no Railway (aba "Deployments")
2. Verifique os logs na Vercel (aba "Functions")
3. Abra uma issue no GitHub

---

🎉 **PARABÉNS!** Sua loja está no ar!

Compartilhe: https://emporiobothanico.com.br
