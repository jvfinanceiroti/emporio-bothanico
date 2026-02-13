# 🔍 DIAGNÓSTICO - Busca de Pedidos Falhando

## Problema
A busca de pedidos está falhando mesmo com `NEXT_PUBLIC_API_URL` configurada no Render.

## Causa Raiz
Variáveis de ambiente `NEXT_PUBLIC_*` no Next.js são **compiladas durante o build**, não em runtime.

## ✅ SOLUÇÃO COMPLETA

### 1️⃣ Verificar Variável no Render (Frontend)

1. Acesse: https://dashboard.render.com
2. Selecione o serviço do **FRONTEND** (emporiobothanico.com.br)
3. Vá em **Environment**
4. Confirme que existe:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://emporio-bothanico.onrender.com`

### 2️⃣ Forçar Rebuild Completo

**OPÇÃO A - Clear Build Cache (RECOMENDADO):**
1. No serviço do frontend no Render
2. Clique em **Manual Deploy**
3. Selecione **Clear build cache & deploy**
4. Aguarde ~3-5 minutos

**OPÇÃO B - Adicionar Variável de Build:**
1. No serviço do frontend
2. Em **Environment**, adicione também:
   - Key: `NODE_ENV`
   - Value: `production`
3. Salve e aguarde redeploy automático

### 3️⃣ Verificar se Funcionou

Após o deploy:
1. Abra o console do navegador (F12)
2. Acesse: https://emporiobothanico.com.br/meus-pedidos
3. Digite um email de teste
4. Clique em "Buscar"
5. Na aba **Network**, verifique se a requisição vai para:
   - ✅ `https://emporio-bothanico.onrender.com/pedidos/buscar`
   - ❌ `http://localhost:5000/pedidos/buscar`

### 4️⃣ Se Ainda Não Funcionar

Execute localmente para testar:

```powershell
cd C:\Users\joaov\loja\frontend
$env:NEXT_PUBLIC_API_URL="https://emporio-bothanico.onrender.com"
npm run build
npm run start
```

Abra: http://localhost:3000/meus-pedidos e teste a busca.

---

## Teste Rápido da API

Para confirmar que o backend está funcionando:

```powershell
curl "https://emporio-bothanico.onrender.com/pedidos/buscar?tipo=email&valor=kleb@gmail.com"
```

Deve retornar JSON com os pedidos.

---

**Importante:** Next.js exige rebuild completo quando variáveis `NEXT_PUBLIC_*` são alteradas!
