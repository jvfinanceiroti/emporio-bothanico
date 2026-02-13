# 🚨 CORREÇÃO URGENTE - Erro 500 no Login Admin

## ❌ PROBLEMA IDENTIFICADO

A busca de pedidos está falhando porque o **frontend no Render está usando `http://localhost:5000`** ao invés da URL correta do backend.

## ✅ SOLUÇÃO (Fazer AGORA):

### 1️⃣ Adicionar variável no Render (serviço FRONTEND)

1. Acesse: https://dashboard.render.com
2. Clique no serviço do **FRONTEND** (emporio-bothanico ou emporiobothanico.com.br)
3. Vá em **Environment** (menu lateral esquerdo)
4. Clique em **Add Environment Variable**
5. Adicione:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://emporio-bothanico.onrender.com`
6. Clique em **Save Changes**

### 2️⃣ Executar SQL no Supabase (garantir colunas extras)

Execute o arquivo que acabei de criar:

```bash
cat C:\Users\joaov\loja\backend\FIX-PEDIDOS-BUSCA.sql
```

Cole todo o conteúdo no Supabase SQL Editor e execute.

### 3️⃣ Aguardar Redeploy Automático

O Render vai fazer redeploy automático do frontend após salvar a variável.
Aguarde ~2 minutos e teste novamente em: https://emporiobothanico.com.br/meus-pedidos

## 📋 VERIFICAÇÕES

✅ Backend local funciona (teste passou)
✅ SQL de busca está correto
❌ Frontend em produção não tem a variável `NEXT_PUBLIC_API_URL`

---

**Importante:** Variáveis que começam com `NEXT_PUBLIC_` precisam estar disponíveis no **momento do build** do Next.js, por isso é essencial adicionar no serviço do frontend no Render.
