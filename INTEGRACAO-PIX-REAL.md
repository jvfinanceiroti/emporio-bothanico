# 🚀 Guia de Integração com Pagamento PIX Real

## 📋 Visão Geral

Atualmente o sistema está funcionando com:
- ✅ Geração de QR Code PIX
- ✅ Polling (verificação a cada 3 segundos)
- ✅ Timer de expiração (1 hora)
- ✅ Webhook endpoint pronto (`/webhook/pagamento`)

## 🔔 Como Funciona a Identificação Automática

### Fluxo Atual (Simulação):
1. Cliente seleciona PIX no checkout
2. Sistema gera QR Code estático
3. **Polling verifica status a cada 3 segundos**
4. Botão "Simular Pagamento" (DEV) marca como pago
5. Redirecionamento automático para /sucesso

### Fluxo Ideal (Produção):
1. Cliente seleciona PIX no checkout
2. Sistema chama API de pagamento (Mercado Pago, PagSeguro, etc.)
3. API gera QR Code dinâmico com ID único
4. **Cliente paga via app do banco**
5. **API de pagamento envia webhook** para seu servidor
6. Sistema atualiza status do pedido automaticamente
7. Polling detecta mudança de status
8. Redirecionamento automático para /sucesso ✅

---

## 🏦 Opções de Provedores PIX

### 1️⃣ **Mercado Pago** (Recomendado)
- ✅ Gratuito para começar
- ✅ Webhook automático
- ✅ QR Code dinâmico
- ✅ API simples
- 📦 Taxa: 3,99% por transação

**Documentação:**
- https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-with-pix
- https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks

### 2️⃣ **PagSeguro**
- ✅ Integração fácil
- ✅ Webhook automático
- 📦 Taxa: 3,99% por transação

**Documentação:**
- https://dev.pagseguro.uol.com.br/reference/pix-criar-cobranca
- https://dev.pagseguro.uol.com.br/reference/notificacoes-de-transacao

### 3️⃣ **Asaas** (Para empresas)
- ✅ Completo
- ✅ Dashboard profissional
- 📦 Taxa: 1,49% por PIX

**Documentação:**
- https://docs.asaas.com/reference/criar-nova-cobranca
- https://docs.asaas.com/docs/webhooks

---

## 🔧 Integração com Mercado Pago (Exemplo)

### Passo 1: Criar conta e obter credenciais
1. Acesse: https://www.mercadopago.com.br/developers
2. Crie uma aplicação
3. Copie suas credenciais:
   - `ACCESS_TOKEN` (produção)
   - `PUBLIC_KEY`

### Passo 2: Instalar SDK
```bash
npm install mercadopago
```

### Passo 3: Modificar backend (server.js)

```javascript
const mercadopago = require('mercadopago');

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Gerar PIX com Mercado Pago
app.post("/pagamento/pix/gerar", async (req, res) => {
  try {
    const { pedido_id, token } = req.body;

    // Buscar pedido
    const pedidoResult = await pool.query(
      "SELECT * FROM pedidos WHERE id = $1 AND access_token = $2",
      [pedido_id, token]
    );

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    const pedido = pedidoResult.rows[0];
    const valorTotal = parseFloat(pedido.total) || 0;

    // Criar pagamento PIX no Mercado Pago
    const payment = await mercadopago.payment.create({
      transaction_amount: valorTotal,
      description: `Pedido #${pedido.id} - Empório Bothânico`,
      payment_method_id: 'pix',
      payer: {
        email: pedido.cliente_email,
        first_name: pedido.cliente_nome.split(' ')[0],
        last_name: pedido.cliente_nome.split(' ').slice(1).join(' ') || '-',
      },
      notification_url: `${process.env.API_URL}/webhook/mercadopago` // Seu webhook
    });

    // Dados do PIX
    const pixData = payment.body.point_of_interaction.transaction_data;
    const qrCodeBase64 = pixData.qr_code_base64;
    const copiaCola = pixData.qr_code;
    const expiraEm = new Date(payment.body.date_of_expiration);

    // Salvar ID do pagamento no banco
    await pool.query(
      `UPDATE pedidos 
       SET pix_codigo = $1, pix_expira_em = $2, mercadopago_payment_id = $3
       WHERE id = $4`,
      [copiaCola, expiraEm, payment.body.id, pedido.id]
    );

    res.json({
      qrCode: `data:image/png;base64,${qrCodeBase64}`,
      copiaCola: copiaCola,
      valor: valorTotal,
      expiraEm: expiraEm.toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro ao gerar PIX Mercado Pago:", error);
    res.status(500).json({ error: "Erro ao gerar PIX" });
  }
});

// Webhook do Mercado Pago
app.post("/webhook/mercadopago", async (req, res) => {
  try {
    console.log("🔔 Webhook Mercado Pago:", req.body);

    const { type, data } = req.body;

    // Mercado Pago envia notificação de pagamento
    if (type === "payment") {
      const paymentId = data.id;

      // Buscar detalhes do pagamento
      const payment = await mercadopago.payment.get(paymentId);
      
      console.log("💳 Status do pagamento:", payment.body.status);

      // Buscar pedido pelo payment_id
      const pedidoResult = await pool.query(
        "SELECT id FROM pedidos WHERE mercadopago_payment_id = $1",
        [paymentId]
      );

      if (pedidoResult.rows.length > 0) {
        const pedidoId = pedidoResult.rows[0].id;

        // Mapear status
        let novoStatus = "aguardando_pagamento";
        if (payment.body.status === "approved") {
          novoStatus = "pago";
        } else if (payment.body.status === "rejected" || payment.body.status === "cancelled") {
          novoStatus = "recusado";
        }

        // Atualizar pedido
        await pool.query(
          `UPDATE pedidos 
           SET status = $1, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $2`,
          [novoStatus, pedidoId]
        );

        console.log(`✅ Pedido ${pedidoId} atualizado para: ${novoStatus}`);
      }
    }

    // IMPORTANTE: Sempre retornar 200 OK
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    res.status(200).json({ error: error.message });
  }
});
```

### Passo 4: Adicionar coluna no banco
```sql
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS mercadopago_payment_id VARCHAR(100);
CREATE INDEX IF NOT EXISTS idx_pedidos_mp_payment ON pedidos(mercadopago_payment_id);
```

### Passo 5: Configurar variáveis de ambiente (Render)
```
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui
API_URL=https://emporio-bothanico.onrender.com
```

### Passo 6: Configurar webhook no Mercado Pago
1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Vá em "Webhooks"
3. Adicione: `https://emporio-bothanico.onrender.com/webhook/mercadopago`
4. Selecione eventos: `payment`

---

## ✅ Fluxo Final com Webhook

```
Cliente → Checkout → Gera PIX (Mercado Pago API)
                           ↓
                     QR Code dinâmico
                           ↓
Cliente paga → Banco processa → Mercado Pago recebe
                                        ↓
                              Mercado Pago envia Webhook
                                        ↓
                            Seu Backend recebe notificação
                                        ↓
                              Atualiza status → "pago"
                                        ↓
                            Polling detecta mudança
                                        ↓
                        Redirecionamento automático! ✅
```

---

## 🧪 Testando Webhook Localmente

### Usando ngrok (túnel HTTP):
```bash
# Instalar ngrok
npm install -g ngrok

# Criar túnel
ngrok http 5000

# Usar URL fornecida como webhook:
# https://abc123.ngrok.io/webhook/mercadopago
```

---

## 📝 Checklist de Produção

- [ ] Criar conta no provedor (Mercado Pago/PagSeguro)
- [ ] Obter credenciais de produção
- [ ] Instalar SDK (`npm install mercadopago`)
- [ ] Adicionar coluna `mercadopago_payment_id` no banco
- [ ] Modificar endpoint `/pagamento/pix/gerar`
- [ ] Configurar webhook no painel do provedor
- [ ] Adicionar `MERCADOPAGO_ACCESS_TOKEN` no Render
- [ ] Testar em ambiente de desenvolvimento
- [ ] Testar em produção com PIX real
- [ ] Monitorar logs do webhook

---

## 🎯 Status Atual vs. Produção

| Recurso | Status Atual | Com API Real |
|---------|-------------|-------------|
| QR Code | ✅ Estático | ✅ Dinâmico |
| Timer | ✅ 1 hora | ✅ Configurável |
| Polling | ✅ 3s | ✅ 3s |
| Webhook | ⚠️ Simulado | ✅ Automático |
| Identificação | 🧪 Botão DEV | ✅ Automática |
| Segurança | ⚠️ Básica | ✅ Validação de assinatura |

---

## 💡 Dica Final

**Para começar rápido:**
1. Use o sistema atual com botão "Simular Pagamento" (DEV)
2. Quando estiver pronto, integre com Mercado Pago
3. O polling já está configurado e vai funcionar automaticamente!

**Precisa de ajuda com a integração?**
Posso implementar o código completo do Mercado Pago para você! 🚀
