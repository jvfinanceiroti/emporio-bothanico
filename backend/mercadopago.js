// =============================================
// Integração Mercado Pago PIX
// =============================================

const mercadopago = require('mercadopago');

// Configurar Mercado Pago
function configurarMercadoPago() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.warn("⚠️ MERCADOPAGO_ACCESS_TOKEN não configurado. PIX funcionará em modo simulação.");
    return false;
  }

  mercadopago.configure({
    access_token: accessToken
  });

  console.log("✅ Mercado Pago configurado com sucesso!");
  return true;
}

// Gerar PIX com Mercado Pago
async function gerarPixMercadoPago(pedido) {
  try {
    const valorTotal = parseFloat(pedido.total) || 0;

    // Preparar nome do cliente
    const nomeCompleto = pedido.cliente_nome || "Cliente";
    const partesNome = nomeCompleto.trim().split(" ");
    const primeiroNome = partesNome[0];
    const sobrenome = partesNome.slice(1).join(" ") || "-";

    // Criar pagamento PIX
    const payment = await mercadopago.payment.create({
      transaction_amount: valorTotal,
      description: `Pedido #${pedido.id} - Empório Botânico`,
      payment_method_id: 'pix',
      payer: {
        email: pedido.cliente_email || "cliente@email.com",
        first_name: primeiroNome,
        last_name: sobrenome,
      },
      notification_url: `${process.env.API_URL || 'http://localhost:5000'}/webhook/mercadopago`,
      metadata: {
        pedido_id: pedido.id,
        cliente_nome: pedido.cliente_nome,
      }
    });

    console.log("✅ PIX Mercado Pago criado:", payment.body.id);

    // Extrair dados do PIX
    const pixData = payment.body.point_of_interaction.transaction_data;
    const expiraEm = new Date(payment.body.date_of_expiration);

    return {
      success: true,
      paymentId: payment.body.id,
      qrCode: `data:image/png;base64,${pixData.qr_code_base64}`,
      copiaCola: pixData.qr_code,
      expiraEm: expiraEm,
      valor: valorTotal
    };
  } catch (error) {
    console.error("❌ Erro ao criar PIX Mercado Pago:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Processar webhook do Mercado Pago
async function processarWebhookMercadoPago(data, pool) {
  try {
    const { type, data: webhookData } = data;

    console.log("🔔 Webhook Mercado Pago tipo:", type);

    // Mercado Pago envia notificação de pagamento
    if (type === "payment") {
      const paymentId = webhookData.id;

      console.log("💳 Buscando detalhes do pagamento:", paymentId);

      // Buscar detalhes do pagamento
      const payment = await mercadopago.payment.get(paymentId);
      
      console.log("📊 Status do pagamento:", payment.body.status);
      console.log("📦 Metadata:", payment.body.metadata);

      // Buscar pedido pelo payment_id
      const pedidoResult = await pool.query(
        "SELECT id, status FROM pedidos WHERE mercadopago_payment_id = $1",
        [paymentId]
      );

      if (pedidoResult.rows.length > 0) {
        const pedido = pedidoResult.rows[0];
        const pedidoId = pedido.id;

        // Mapear status do Mercado Pago para nosso sistema
        let novoStatus = pedido.status;
        
        switch (payment.body.status) {
          case "approved":
            novoStatus = "pago";
            console.log("✅ Pagamento aprovado!");
            break;
          case "rejected":
          case "cancelled":
            novoStatus = "recusado";
            console.log("❌ Pagamento recusado/cancelado");
            break;
          case "pending":
          case "in_process":
            novoStatus = "aguardando_pagamento";
            console.log("⏳ Pagamento pendente");
            break;
        }

        // Atualizar pedido apenas se o status mudou
        if (novoStatus !== pedido.status) {
          await pool.query(
            `UPDATE pedidos 
             SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2`,
            [novoStatus, pedidoId]
          );

          console.log(`✅ Pedido ${pedidoId} atualizado: ${pedido.status} → ${novoStatus}`);
        } else {
          console.log(`ℹ️ Status já está correto: ${novoStatus}`);
        }

        return { success: true, pedidoId, novoStatus };
      } else {
        console.warn("⚠️ Pedido não encontrado para payment_id:", paymentId);
        return { success: false, error: "Pedido não encontrado" };
      }
    }

    return { success: true, message: "Evento não processado" };
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  configurarMercadoPago,
  gerarPixMercadoPago,
  processarWebhookMercadoPago
};
