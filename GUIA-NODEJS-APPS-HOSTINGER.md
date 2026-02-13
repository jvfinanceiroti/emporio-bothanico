# 🎯 Guia Rápido - Configurar Node.js Apps no Hostinger

## ⚠️ IMPORTANTE
O subdomínio `api` está usando a mesma pasta do site principal (`/public_html/api`).
Precisamos separar usando **Node.js Apps** do Hostinger.

---

## 🔧 PASSO 1: Limpar a Bagunça

### 1.1 Acessar File Manager
1. hPanel → **Arquivos** → **Gerenciador de Arquivos**
2. Ir para `/public_html`

### 1.2 Deletar o que não precisa
Delete estas pastas/arquivos:
- ❌ Pasta `backend/` (se existir)
- ❌ Pasta `api/` (se existir)
- ❌ Qualquer arquivo `.js` solto (server.js, db.js)

### 1.3 Organizar o que sobrou
Você deve ter apenas:
- ✅ Pasta `.next/`
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ Pasta `public/`
- ❌ Delete `index.html` se tiver

---

## 🚀 PASSO 2: Criar Node.js App - BACKEND (API)

### 2.1 Acessar Menu Node.js
1. No menu lateral → **Avançado** → **Node.js**
2. Clique em **"Criar Aplicação"** ou **"Create Application"**

### 2.2 Configurações do Backend
Preencha assim:

| Campo | Valor |
|-------|-------|
| **Nome da aplicação** | `Backend API` |
| **Domínio** | `api.emporiobothanico.com.br` |
| **Application root** | `/domains/api.emporiobothanico.com.br/public_html` |
| **Application startup file** | `server.js` |
| **Node.js version** | `20.x` (ou 18.x) |
| **Application mode** | `PRODUCTION` |

### 2.3 Variáveis de Ambiente (IMPORTANTE!)
Clique em **"Adicionar variável"** e adicione:

**Variável 1:**
```
Nome: DATABASE_URL
Valor: postgresql://postgres.xxxxx:SuaSenha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```
(Cole sua connection string do Supabase)

**Variável 2:**
```
Nome: JWT_SECRET
Valor: minha-chave-secreta-super-forte-123456789abc
```
(Crie uma string aleatória longa)

**Variável 3:**
```
Nome: PORT
Valor: 3001
```

### 2.4 Salvar
Clique em **"Criar"** ou **"Create"**

Aguarde 2-3 minutos enquanto o Hostinger:
- Cria a pasta da aplicação
- Instala dependências (`npm install`)
- Inicia o servidor

---

## 🎨 PASSO 3: Upload dos Arquivos do Backend

### 3.1 Acessar Pasta da Aplicação
1. File Manager
2. Navegar até: `/domains/api.emporiobothanico.com.br/public_html`

### 3.2 Upload do Backend
1. **Upload** do arquivo `backend-api.zip`
2. **Extrair** o ZIP (botão direito → Extract)
3. Verificar que apareceu:
   - `server.js`
   - `db.js`
   - `package.json`
   - `package-lock.json`

### 3.3 Reiniciar Aplicação
1. Voltar para **Node.js** no menu
2. Encontrar a aplicação "Backend API"
3. Clicar em **"Reiniciar"** ou **"Restart"**

### 3.4 Testar
Acessar no navegador:
```
https://api.emporiobothanico.com.br/produtos
```

✅ **Deve retornar:** JSON com lista de produtos
❌ **Se der erro:** Verificar logs no painel Node.js

---

## 🎨 PASSO 4: Criar Node.js App - FRONTEND (Loja)

### 4.1 Criar Nova Aplicação
1. Menu **Node.js** → **"Criar Aplicação"**

### 4.2 Configurações do Frontend
| Campo | Valor |
|-------|-------|
| **Nome da aplicação** | `Frontend Loja` |
| **Domínio** | `emporiobothanico.com.br` |
| **Application root** | `/domains/emporiobothanico.com.br/public_html` |
| **Application startup file** | `node_modules/next/dist/bin/next` |
| **Application arguments** | `start` |
| **Node.js version** | `20.x` (ou 18.x) |
| **Application mode** | `PRODUCTION` |

### 4.3 Variável de Ambiente (Opcional)
```
Nome: NODE_ENV
Valor: production
```

### 4.4 Salvar
Clique em **"Criar"**

---

## 🎨 PASSO 5: Upload dos Arquivos do Frontend

### 5.1 Verificar Pasta
File Manager → `/domains/emporiobothanico.com.br/public_html`

### 5.2 Já Deve Ter os Arquivos
Se você já fez upload do `frontende.zip`, deve ter:
- ✅ Pasta `.next/`
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ Pasta `public/`

Se não tiver, faça upload do `frontend-loja.zip` e extraia.

### 5.3 Reiniciar Aplicação
1. Voltar para **Node.js** no menu
2. Encontrar "Frontend Loja"
3. Clicar em **"Reiniciar"**

### 5.4 Testar
Acessar no navegador:
```
https://emporiobothanico.com.br
```

✅ **Deve mostrar:** Página inicial da loja com produtos

---

## ✅ CHECKLIST FINAL

- [ ] Pasta `/public_html/api` deletada
- [ ] Node.js App "Backend API" criado
- [ ] Variáveis de ambiente configuradas no backend
- [ ] Arquivos backend uploaded em `/domains/api.../public_html`
- [ ] API testada: `https://api.emporiobothanico.com.br/produtos` retorna JSON
- [ ] Node.js App "Frontend Loja" criado
- [ ] Frontend testado: `https://emporiobothanico.com.br` abre loja
- [ ] Produtos aparecem na página inicial
- [ ] Login admin funciona

---

## 🔥 DICAS IMPORTANTES

### Se API não rodar:
1. Ver **Logs** no painel Node.js → Backend API
2. Verificar se variáveis de ambiente estão corretas
3. Confirmar que `server.js` está na pasta root da aplicação

### Se Frontend não rodar:
1. No File Manager, entrar na pasta do frontend
2. Abrir terminal SSH (se disponível) e rodar:
   ```bash
   npm install
   npm run build
   ```
3. Reiniciar aplicação Node.js

### Se produtos não carregam:
1. Abrir DevTools (F12) → Console
2. Ver erro de rede
3. Confirmar que API está funcionando
4. Verificar CORS no backend (adicionar origin do frontend)

---

## 🆘 Problemas Comuns

### "Application failed to start"
- Verificar se `server.js` ou `next` está no caminho correto
- Ver logs do Node.js para erro específico

### "Cannot find module"
- Rodar `npm install` na pasta da aplicação
- Reiniciar aplicação

### "CORS Error"
- Adicionar no `server.js`:
  ```javascript
  app.use(cors({
    origin: ['https://emporiobothanico.com.br'],
    credentials: true
  }));
  ```

---

**Siga esse guia passo a passo e me avise quando terminar cada etapa! 🚀**
