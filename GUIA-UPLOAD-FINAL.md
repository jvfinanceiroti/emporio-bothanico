# 🚀 GUIA FINAL DE UPLOAD - Hostinger

## ✅ Build Concluído com Sucesso!

A URL da API está configurada para: `https://api.emporiobothanico.com.br`

---

## 📦 Passo 1: Preparar Backend (API)

### 1.1 Arquivos do Backend
Zipar os seguintes arquivos da pasta `C:\Users\joaov\loja\backend\`:

```powershell
cd C:\Users\joaov\loja\backend
Compress-Archive -Path server.js,db.js,package.json,package-lock.json -DestinationPath backend-api.zip -Force
```

Arquivos incluídos:
- ✅ `server.js`
- ✅ `db.js`
- ✅ `package.json`
- ✅ `package-lock.json`

### 1.2 Upload no Hostinger - API

1. **Acessar:** hPanel → Websites
2. **Selecionar:** `api.emporiobothanico.com.br`
3. **File Manager** → Ir para pasta do subdomínio (provavelmente `public_html/api`)
4. **Upload:** `backend-api.zip`
5. **Extrair:** Clicar com direito → Extract

### 1.3 Configurar Node.js App (API)

No hPanel:
1. **Websites → Advanced → Node.js**
2. **Create Application**
   - Application root: `/public_html/api` (ou caminho do subdomínio)
   - Application startup file: `server.js`
   - Node.js version: **18.x** ou superior
   - Application mode: Production
3. **Environment variables** (IMPORTANTE!):
   ```
   DATABASE_URL = sua-connection-string-do-supabase
   JWT_SECRET = string-aleatoria-longa-segura
   PORT = 3001
   ```
4. **Salvar** e aguardar instalação das dependências

### 1.4 Testar API
- Acessar: `https://api.emporiobothanico.com.br/produtos`
- Deve retornar JSON com lista de produtos

---

## 📦 Passo 2: Preparar Frontend (Loja)

### 2.1 Zipar Arquivos do Frontend

```powershell
cd C:\Users\joaov\loja\frontend
Compress-Archive -Path .next,package.json,package-lock.json,public -DestinationPath frontend-loja.zip -Force
```

Arquivos incluídos:
- ✅ Pasta `.next/` (build completo)
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ Pasta `public/` (logo, imagens)

### 2.2 Upload no Hostinger - Frontend

1. **Acessar:** hPanel → Websites
2. **Selecionar:** `emporiobothanico.com.br` (domínio principal)
3. **File Manager** → Ir para `public_html/`
4. **Limpar pasta** (deletar index.html padrão se existir)
5. **Upload:** `frontend-loja.zip`
6. **Extrair:** Clicar com direito → Extract

### 2.3 Configurar Node.js App (Frontend)

No hPanel:
1. **Websites → Advanced → Node.js**
2. **Create Application**
   - Application root: `/public_html`
   - Application startup file: `node_modules/next/dist/bin/next`
   - Application arguments: `start`
   - Node.js version: **18.x** ou superior
   - Application mode: Production
3. **Environment variables** (opcional):
   ```
   NODE_ENV = production
   PORT = 3000
   ```
4. **Salvar** e aguardar instalação

---

## 🧪 Passo 3: Testar Tudo

### Teste 1: API (Backend)
```
✅ https://api.emporiobothanico.com.br/produtos
   → Deve retornar JSON com produtos
```

### Teste 2: Frontend (Loja)
```
✅ https://emporiobothanico.com.br
   → Página inicial com produtos
   → Produtos carregam da API
```

### Teste 3: Admin
```
✅ https://emporiobothanico.com.br/admin/login
   → Login: admin@emporio.com.br
   → Senha: admin123
```

---

## 🔧 Configurações Adicionais (Hostinger)

### SSL/HTTPS
- Hostinger ativa automaticamente
- Aguardar 5-10 minutos após primeiro acesso

### Domínio Principal
Se `www.emporiobothanico.com.br` não funciona:
1. hPanel → Domains
2. Redirect `www` para domínio principal

---

## ⚠️ Troubleshooting

### ❌ API retorna 404
**Solução:**
1. Verificar se `server.js` está na pasta correta
2. Ver logs no painel Node.js do Hostinger
3. Confirmar variáveis de ambiente configuradas

### ❌ Frontend não carrega
**Solução:**
1. Verificar logs do Node.js
2. Confirmar que `.next` foi extraído corretamente
3. Rodar `npm install` via SSH se necessário

### ❌ Produtos não aparecem
**Solução:**
1. Abrir DevTools (F12) → Console
2. Ver se há erro de CORS ou rede
3. Confirmar que API está respondendo em `/produtos`

### ❌ CORS Error
**Solução:** Adicionar no `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://emporiobothanico.com.br', 'https://www.emporiobothanico.com.br'],
  credentials: true
}));
```

---

## 📋 Checklist Final

- [ ] `backend-api.zip` criado
- [ ] `frontend-loja.zip` criado
- [ ] Backend uploaded em `api.emporiobothanico.com.br`
- [ ] Frontend uploaded em `emporiobothanico.com.br`
- [ ] Variáveis de ambiente configuradas no backend
- [ ] Node.js Apps criados e rodando
- [ ] API testada: retorna produtos
- [ ] Loja testada: página carrega
- [ ] Admin testado: login funciona
- [ ] SSL ativo (https)

---

## 🎉 Sucesso!

Quando todos os checkboxes estiverem marcados, sua loja estará 100% online e funcional!

**URLs Finais:**
- 🛍️ Loja: https://emporiobothanico.com.br
- 🔧 Admin: https://emporiobothanico.com.br/admin/login
- 🚀 API: https://api.emporiobothanico.com.br

**Credenciais Admin:**
- Email: admin@emporio.com.br
- Senha: admin123

**Boas vendas! 🎊**
