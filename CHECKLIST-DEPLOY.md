# 🔍 CHECKLIST DE DIAGNÓSTICO - Erro 503

## ❌ PROBLEMA: Tudo dando erro 503

Erro 503 significa que o **servidor não consegue processar a requisição**. No Hostinger, isso acontece quando:
1. A aplicação Node.js não foi criada
2. A aplicação está parada/crashada
3. Os arquivos estão na pasta errada
4. Dependências não foram instaladas

---

## 🎯 PASSO A PASSO DE VERIFICAÇÃO

### ✅ ETAPA 1: Verificar Aplicações Node.js

1. **Acessar:** hPanel → Menu lateral → **Avançado** → **Node.js**

2. **Contar aplicações:** Deve ter **2 aplicações**

   **Aplicação 1 - Frontend:**
   - Nome: qualquer (ex: "Loja Frontend")
   - Domínio: `emporiobothanico.com.br`
   - Status: 🟢 (verde/rodando)

   **Aplicação 2 - Backend:**
   - Nome: qualquer (ex: "API Backend")
   - Domínio: `api.emporiobothanico.com.br`
   - Status: 🟢 (verde/rodando)

3. **Se NÃO vê as 2 aplicações:** Precisa criar (pular para SOLUÇÃO A)
4. **Se vê mas estão 🔴 paradas/erro:** Verificar logs (pular para SOLUÇÃO B)

---

### ✅ ETAPA 2: Verificar Estrutura de Arquivos

**Frontend - Verificar em File Manager:**

Caminho: `/domains/emporiobothanico.com.br/public_html`

Deve conter:
```
✅ .next/
✅ public/
✅ package.json
✅ package-lock.json
✅ next.config.js
✅ node_modules/ (criado automaticamente após npm install)
```

**Backend - Verificar em File Manager:**

Caminho: `/domains/api.emporiobothanico.com.br/public_html`

Deve conter:
```
✅ server.js
✅ db.js
✅ package.json
✅ package-lock.json
✅ node_modules/ (criado automaticamente)
```

**❌ Se falta algum arquivo:** Repetir upload e extração do ZIP

---

## 🔧 SOLUÇÃO A: Criar Aplicações Node.js

Se você **não vê as 2 aplicações** no menu Node.js, precisa criar:

### Criar Aplicação 1 - BACKEND (fazer primeiro!)

1. **Node.js** → **Criar Aplicação**
2. **Preencher:**
   - Domínio: `api.emporiobothanico.com.br`
   - Application root: `/domains/api.emporiobothanico.com.br/public_html`
   - Application startup file: `server.js`
   - Node.js version: `20.x`
   - Application mode: `PRODUCTION`

3. **Variáveis de ambiente:**
   ```
   DATABASE_URL = sua-connection-string-do-supabase
   JWT_SECRET = minha-chave-secreta-123456
   PORT = 3001
   ```

4. **Criar** → Aguardar 3 minutos

5. **Testar:** Acessar `https://api.emporiobothanico.com.br/produtos`
   - ✅ Deve retornar JSON com produtos

### Criar Aplicação 2 - FRONTEND (só depois do backend funcionar!)

1. **Node.js** → **Criar Aplicação**
2. **Preencher:**
   - Domínio: `emporiobothanico.com.br`
   - Application root: `/domains/emporiobothanico.com.br/public_html`
   - Application startup file: `node_modules/next/dist/bin/next`
   - Application arguments: `start`
   - Node.js version: `20.x`
   - Application mode: `PRODUCTION`

3. **Variáveis de ambiente:**
   ```
   NODE_ENV = production
   NEXT_PUBLIC_API_URL = https://api.emporiobothanico.com.br
   ```

4. **Criar** → Aguardar 3 minutos

5. **Testar:** Acessar `https://emporiobothanico.com.br`
   - ✅ Deve mostrar a loja

---

## 🔧 SOLUÇÃO B: Aplicações Existem mas Estão com Erro

Se as aplicações já existem mas aparecem 🔴 ou ⚠️:

### 1. Ver Logs

Para cada aplicação:
1. Clicar no nome da aplicação
2. Botão **"Logs"** ou **"Ver logs"**
3. Ler o último erro

### 2. Erros Comuns e Soluções

**Erro: `Cannot find module 'next'` ou `Cannot find module 'express'`**
- **Causa:** `npm install` não rodou
- **Solução:**
  1. File Manager → Entrar na pasta da aplicação
  2. Terminal ou SSH
  3. Rodar: `npm install`
  4. Reiniciar aplicação

**Erro: `ENOENT: no such file or directory, open '.next/BUILD_ID'`**
- **Causa:** Build incompleto ou pasta errada
- **Solução:**
  1. Deletar tudo na pasta `public_html`
  2. Re-upload do ZIP `frontend-hostinger.zip`
  3. Extrair novamente
  4. Reiniciar aplicação

**Erro: `Error: listen EADDRINUSE: address already in use`**
- **Causa:** Porta já em uso
- **Solução:**
  1. Reiniciar aplicação (Hostinger gerencia portas)
  2. Se persistir, deletar e recriar aplicação

**Erro: `permission denied`**
- **Causa:** Permissões incorretas
- **Solução:**
  1. File Manager → Selecionar pasta `public_html`
  2. Botão direito → Permissions
  3. Definir como `755`

**Erro: `database connection failed`**
- **Causa:** Variável `DATABASE_URL` incorreta
- **Solução:**
  1. Editar aplicação
  2. Verificar variável de ambiente
  3. Copiar connection string correta do Supabase
  4. Salvar e reiniciar

---

## 🔧 SOLUÇÃO C: Último Recurso - Rebuild Completo

Se nada funcionar, deletar tudo e recomeçar:

### 1. Limpar Tudo

**File Manager:**
- Deletar todo conteúdo de `/domains/emporiobothanico.com.br/public_html`
- Deletar todo conteúdo de `/domains/api.emporiobothanico.com.br/public_html`

**Node.js:**
- Deletar ambas aplicações Node.js (se existirem)

### 2. Reconstruir Backend

```powershell
cd C:\Users\joaov\loja\backend
Compress-Archive -Path server.js,db.js,package.json,package-lock.json -DestinationPath backend-novo.zip -Force
```

1. Upload `backend-novo.zip` em `/domains/api.../public_html`
2. Extrair
3. Criar aplicação Node.js (conforme SOLUÇÃO A)
4. Testar `/produtos`

### 3. Reconstruir Frontend

```powershell
cd C:\Users\joaov\loja\frontend
$env:NEXT_PUBLIC_API_URL="https://api.emporiobothanico.com.br"
npm run build
Compress-Archive -Path .next,public,package.json,package-lock.json,next.config.js -DestinationPath frontend-novo.zip -Force
```

1. Upload `frontend-novo.zip` em `/domains/emporiobothanico.com.br/public_html`
2. Extrair
3. Criar aplicação Node.js (conforme SOLUÇÃO A)
4. Testar site

---

## 📋 ORDEM DE TESTE

Sempre testar nesta ordem:

1. ✅ **Backend primeiro:**
   ```
   https://api.emporiobothanico.com.br/produtos
   → Deve retornar JSON
   ```

2. ✅ **Depois frontend:**
   ```
   https://emporiobothanico.com.br
   → Deve carregar loja
   ```

**Por quê?** Frontend depende do backend. Se backend não funciona, frontend vai dar erro de qualquer forma.

---

## 🆘 ME ENVIE ESSAS INFORMAÇÕES

Para eu te ajudar melhor, me mande:

1. **Screenshot do menu Node.js** mostrando as aplicações
2. **Status de cada aplicação** (rodando/parada/erro)
3. **Logs de cada aplicação** (copiar o texto do erro)
4. **Resultado do teste:** `https://api.emporiobothanico.com.br/produtos` (copiar resposta ou erro)

Com essas informações consigo identificar exatamente o problema! 🔍
