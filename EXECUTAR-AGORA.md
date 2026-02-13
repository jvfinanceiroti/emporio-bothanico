# 🚨 SOLUÇÃO ERRO 503 - Frontend Hostinger

## ❌ PROBLEMA IDENTIFICADO
O erro 503 ocorre porque o build anterior **NÃO tinha a configuração standalone** necessária para o Hostinger.

## ✅ SOLUÇÃO APLICADA

### 1. Criado `next.config.js` com output standalone
```javascript
output: 'standalone'
```

### 2. Novo Build Gerado
- ✅ Build standalone completo
- ✅ Variáveis de ambiente production carregadas
- ✅ 19 rotas compiladas com sucesso

### 3. Novo ZIP Criado
📦 **Arquivo:** `C:\Users\joaov\loja\frontend\frontend-hostinger.zip`

**Contém:**
- ✅ `.next/` (build standalone completo)
- ✅ `public/` (logo, imagens)
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `next.config.js`

---

## 🚀 PASSOS PARA CORRIGIR NO HOSTINGER

### PASSO 1: Limpar Pasta Atual
1. Acessar **File Manager** → `/domains/emporiobothanico.com.br/public_html`
2. **DELETAR TUDO** (exceto `.htaccess` se existir):
   - Pasta `.next/` antiga
   - `package.json`
   - `public/`
   - Qualquer outro arquivo

### PASSO 2: Upload do Novo Build
1. **Upload** do arquivo `frontend-hostinger.zip`
2. **Extrair** (botão direito → Extract)
3. Verificar que apareceu:
   ```
   ✅ .next/
   ✅ public/
   ✅ package.json
   ✅ package-lock.json
   ✅ next.config.js
   ```

### PASSO 3: Configurar Node.js Application

#### Se JÁ EXISTE a aplicação Node.js:
1. Menu **Node.js** → Encontrar aplicação do domínio principal
2. **EDITAR** a aplicação:
   - **Application startup file:** `node_modules/next/dist/bin/next`
   - **Application arguments:** `start`
   - **Node.js version:** `20.x` ou `18.x`
   - **Application mode:** `PRODUCTION`
3. **Variáveis de Ambiente:**
   ```
   NODE_ENV = production
   NEXT_PUBLIC_API_URL = https://api.emporiobothanico.com.br
   ```
4. **Salvar** → Aguardar reinstalação das dependências (2-5 minutos)
5. **Reiniciar** a aplicação

#### Se NÃO EXISTE aplicação Node.js:
1. Menu **Node.js** → **Criar Aplicação**
2. Configurar:
   - **Domínio:** `emporiobothanico.com.br`
   - **Application root:** `/domains/emporiobothanico.com.br/public_html`
   - **Application startup file:** `node_modules/next/dist/bin/next`
   - **Application arguments:** `start`
   - **Node.js version:** `20.x`
   - **Application mode:** `PRODUCTION`
3. **Variáveis de Ambiente:**
   ```
   NODE_ENV = production
   NEXT_PUBLIC_API_URL = https://api.emporiobothanico.com.br
   ```
4. **Criar** → Aguardar instalação (2-5 minutos)

### PASSO 4: Testar
1. Aguardar 2-3 minutos após restart/criação
2. Acessar: `https://emporiobothanico.com.br`
3. **✅ Deve mostrar:** Página inicial com produtos

---

## 🔍 COMO VERIFICAR SE FUNCIONOU

### ✅ Sinais de Sucesso:
- Página carrega em 2-3 segundos
- Produtos aparecem na tela
- Console do navegador (F12) sem erros
- Imagens carregam corretamente

### ❌ Se Ainda Der Erro:
1. **Ver Logs:** hPanel → Node.js → Aplicação → Botão "Logs"
2. **Erros Comuns:**

   **"Cannot find module 'next'"**
   - Solução: Rodar `npm install` na pasta via SSH ou File Manager terminal
   
   **"Port already in use"**
   - Solução: Hostinger gerencia portas automaticamente, apenas reiniciar app
   
   **"ENOENT: no such file or directory .next/BUILD_ID"**
   - Solução: Build standalone incompleto, repetir PASSO 2

---

## 📋 CHECKLIST FINAL

- [ ] Pasta `/public_html` limpa
- [ ] `frontend-hostinger.zip` uploaded
- [ ] ZIP extraído com sucesso
- [ ] Pasta `.next/` presente e completa
- [ ] Node.js Application configurado com `next start`
- [ ] Variáveis de ambiente adicionadas
- [ ] Aplicação reiniciada
- [ ] Site acessível em `https://emporiobothanico.com.br`
- [ ] Produtos carregando da API
- [ ] Sem erros no console (F12)

---

## 🎯 DIFERENÇA DO BUILD ANTERIOR

| Antes | Agora |
|-------|-------|
| ❌ Build padrão Next.js | ✅ Build standalone |
| ❌ Precisa de node_modules completo | ✅ Self-contained com dependências |
| ❌ 503 Service Unavailable | ✅ Funciona no Hostinger |
| ❌ Sem `next.config.js` | ✅ Com `output: 'standalone'` |

---

## 🆘 SUPORTE RÁPIDO

**Erro 503 continua?**
→ Ver logs do Node.js no hPanel

**Produtos não aparecem?**
→ Verificar se API está rodando: `https://api.emporiobothanico.com.br/produtos`

**Erro de CORS?**
→ Confirmar variável `NEXT_PUBLIC_API_URL` configurada

---

**Após seguir esses passos, o site estará 100% funcional! 🎉**
