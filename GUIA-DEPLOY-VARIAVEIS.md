# ⚡ SOLUÇÃO RÁPIDA - Hostinger Node.js Apps

## 🎯 PROBLEMA IDENTIFICADO

Você fez upload dos arquivos, mas o **Hostinger precisa que você CRIE as aplicações Node.js**.

Simplesmente colocar os arquivos na pasta `public_html` **NÃO funciona** para Next.js!

---

## ✅ SOLUÇÃO EM 5 PASSOS

### PASSO 1: Acessar Menu Node.js

1. **hPanel** (painel do Hostinger)
2. Menu lateral esquerdo → **Avançado**
3. Clicar em **Node.js**

---

### PASSO 2: Criar Aplicação BACKEND (API)

1. Botão **"Criar aplicação"** (ou "Create Application")

2. **Preencher o formulário:**

   | Campo | Valor |
   |-------|-------|
   | **Domínio** | `api.emporiobothanico.com.br` |
   | **Application root** | `/domains/api.emporiobothanico.com.br/public_html` |
   | **Application startup file** | `server.js` |
   | **Node.js version** | Selecionar `20.x` |
   | **Application mode** | `PRODUCTION` |

3. **Adicionar Variáveis de Ambiente** (clicar em "Add variable"):

   **Variável 1:**
   - Nome: `DATABASE_URL`
   - Valor: `sua-connection-string-do-supabase`
   
   **Variável 2:**
   - Nome: `JWT_SECRET`
   - Valor: `minha-chave-super-secreta-123456`
   
   **Variável 3:**
   - Nome: `PORT`
   - Valor: `3001`

4. **Clicar em "Criar"**

5. **Aguardar 2-3 minutos** (Hostinger vai instalar dependências)

6. **Testar:** Acessar `https://api.emporiobothanico.com.br/produtos`
   - ✅ Deve retornar JSON com produtos
   - ❌ Se der erro, me avise

---

### PASSO 3: Criar Aplicação FRONTEND (Loja)

**⚠️ SÓ FAZER ISSO DEPOIS QUE O BACKEND FUNCIONAR!**

1. Botão **"Criar aplicação"** novamente

2. **Preencher o formulário:**

   | Campo | Valor |
   |-------|-------|
   | **Domínio** | `emporiobothanico.com.br` |
   | **Application root** | `/domains/emporiobothanico.com.br/public_html` |
   | **Application startup file** | `node_modules/next/dist/bin/next` |
   | **Application arguments** | `start` |
   | **Node.js version** | Selecionar `20.x` |
   | **Application mode** | `PRODUCTION` |

3. **Adicionar Variáveis de Ambiente:**

   **Variável 1:**
   - Nome: `NODE_ENV`
   - Valor: `production`
   
   **Variável 2:**
   - Nome: `NEXT_PUBLIC_API_URL`
   - Valor: `https://api.emporiobothanico.com.br`

4. **Clicar em "Criar"**

5. **Aguardar 2-3 minutos**

6. **Testar:** Acessar `https://emporiobothanico.com.br`
   - ✅ Deve mostrar a loja com produtos

---

### PASSO 4: Verificar Status

Após criar as 2 aplicações, você deve ver no painel Node.js:

```
✅ api.emporiobothanico.com.br - 🟢 Rodando
✅ emporiobothanico.com.br - 🟢 Rodando
```

Se aparecer 🔴 ou ⚠️, clicar em "Logs" para ver o erro.

---

### PASSO 5: Testar Tudo

1. **Backend:** `https://api.emporiobothanico.com.br/produtos`
   - Deve retornar lista JSON

2. **Frontend:** `https://emporiobothanico.com.br`
   - Deve mostrar loja

3. **Admin:** `https://emporiobothanico.com.br/admin/login`
   - Login: admin@emporio.com.br
   - Senha: admin123

---

## 🔍 IMPORTANTE - DIFERENÇA

### ❌ O QUE NÃO FUNCIONA:
- Apenas fazer upload dos arquivos
- Deixar arquivos em `public_html` sem criar aplicação Node.js
- Tentar usar WordPress/PHP hosting para rodar Next.js

### ✅ O QUE FUNCIONA:
- Upload dos arquivos **+** Criar aplicação Node.js
- Configurar corretamente o startup file
- Adicionar variáveis de ambiente

---

## 🆘 ERROS COMUNS

### "Cannot find module 'express'" ou "Cannot find module 'next'"

**Causa:** Dependências não instaladas

**Solução:**
1. Aguardar mais tempo (até 5 minutos)
2. Ou: Acessar SSH/Terminal
3. Entrar na pasta: `cd /domains/seu-dominio/public_html`
4. Rodar: `npm install`
5. Reiniciar aplicação

### "ENOENT: no such file or directory"

**Causa:** Arquivos não foram extraídos ou estão na pasta errada

**Solução:**
1. File Manager → Verificar se arquivos estão na pasta correta
2. Backend: `/domains/api.../public_html/server.js` deve existir
3. Frontend: `/domains/emporio.../public_html/.next/` deve existir

### "Port already in use"

**Causa:** Porta em conflito

**Solução:**
1. Reiniciar aplicação
2. Hostinger gerencia portas automaticamente

---

## 📋 CHECKLIST FINAL

- [ ] Arquivos backend uploaded em `/domains/api.../public_html`
- [ ] Arquivos frontend uploaded em `/domains/emporio.../public_html`
- [ ] Aplicação Node.js do backend CRIADA no menu Node.js
- [ ] Aplicação Node.js do frontend CRIADA no menu Node.js
- [ ] Variáveis de ambiente configuradas nas duas aplicações
- [ ] Status das aplicações: 🟢 Rodando
- [ ] Teste backend: `/produtos` retorna JSON
- [ ] Teste frontend: site carrega
- [ ] Teste admin: login funciona

---

## 🎯 RESUMO

**O erro 503 acontece porque:**
- Você fez upload dos arquivos ✅
- MAS não criou as aplicações Node.js ❌

**Para resolver:**
- Seguir PASSO 2 e PASSO 3 acima
- Criar as 2 aplicações no menu Node.js
- Aguardar instalação das dependências
- Testar

**Depois disso, o site vai funcionar!** 🚀

---

Me avise quando terminar cada passo!
