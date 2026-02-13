// =============================================
// Integração Mercado Pago PIX
// =============================================

const { MercadoPagoConfig, Payment } = require('mercadopago');

let clientMP = null;
let paymentClient = null;

// Configurar Mercado Pago
function configurarMercadoPago() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.warn("⚠️ MERCADOPAGO_ACCESS_TOKEN não configurado. PIX funcionará em modo simulação.");
    return false;
  }

  try {
    // Nova forma de configurar (SDK v2.x)
    clientMP = new MercadoPagoConfig({ 
      accessToken: accessToken,
      options: { timeout: 5000 }
    });
    
    paymentClient = new Payment(clientMP);

    console.log("✅ Mercado Pago configurado com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao configurar Mercado Pago:", error);
    return false;
  }
}

// Gerar PIX com Mercado Pago
async function gerarPixMercadoPago(pedido) {
  try {
    if (!paymentClient) {
      throw new Error("Mercado Pago não está configurado");
    }

    const valorTotal = parseFloat(pedido.total) || 0;

    // Preparar nome do cliente
    const nomeCompleto = pedido.cliente_nome || "Cliente";
    const partesNome = nomeCompleto.trim().split(" ");
    const primeiroNome = partesNome[0];
    const sobrenome = partesNome.slice(1).join(" ") || "-";

    // Criar pagamento PIX
    const payment = await paymentClient.create({
      body: {
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
      }
    });

    console.log("✅ PIX Mercado Pago criado:", payment.id);

    // Extrair dados do PIX
    const pixData = payment.point_of_interaction.transaction_data;
    const expiraEm = new Date(payment.date_of_expiration);

    return {
      success: true,
      paymentId: payment.id,
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
    if (!paymentClient) {
      console.warn("⚠️ Mercado Pago não configurado, ignorando webhook");
      return { success: false, error: "MP não configurado" };
    }

    const { type, data: webhookData } = data;

    console.log("🔔 Webhook Mercado Pago tipo:", type);

    // Mercado Pago envia notificação de pagamento
    if (type === "payment") {
      const paymentId = webhookData.id;

      console.log("💳 Buscando detalhes do pagamento:", paymentId);

      // Buscar detalhes do pagamento
      const payment = await paymentClient.get({ id: paymentId });
      
      console.log("📊 Status do pagamento:", payment.status);
      console.log("📦 Metadata:", payment.metadata);

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
        
        switch (payment.status) {
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

// Processar Pagamento com Cartão de Crédito
async function processarPagamentoCartao(dadosCartao, pedido) {
  try {
    if (!paymentClient) {
      throw new Error("Mercado Pago não está configurado");
    }

    const valorTotal = parseFloat(pedido.total) || 0;

    // Preparar nome do cliente
    const nomeCompleto = pedido.cliente_nome || "Cliente";
    const partesNome = nomeCompleto.trim().split(" ");
    const primeiroNome = partesNome[0];
    const sobrenome = partesNome.slice(1).join(" ") || "-";

    // Remover formatação do CPF
    const cpfLimpo = dadosCartao.documento.replace(/\D/g, "");

    // Criar pagamento com cartão
    const payment = await paymentClient.create({
      body: {
        transaction_amount: valorTotal,
        token: dadosCartao.token,
        description: `Pedido #${pedido.id} - Empório Botânico`,
        installments: dadosCartao.installments,
        payment_method_id: dadosCartao.payment_method_id,
        issuer_id: dadosCartao.issuer_id,
        payer: {
          email: pedido.cliente_email || "cliente@email.com",
          identification: {
            type: "CPF",
            number: cpfLimpo
          },
          first_name: primeiroNome,
          last_name: sobrenome,
        },
        notification_url: `${process.env.API_URL || 'http://localhost:5000'}/webhook/mercadopago`,
        metadata: {
          pedido_id: pedido.id,
          cliente_nome: pedido.cliente_nome,
        }
      }
    });

    console.log("✅ Pagamento com Cartão criado:", payment.id);
    console.log("📊 Status:", payment.status);

    return {
      success: true,
      paymentId: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail,
      approved: payment.status === "approved"
    };
  } catch (error) {
    console.error("❌ Erro ao processar cartão:", error);
    
    // Extrair mensagem de erro mais específica
    let mensagemErro = "Erro ao processar pagamento com cartão";
    
    if (error.response?.data) {
      const apiError = error.response.data;
      if (apiError.message) mensagemErro = apiError.message;
      if (apiError.cause) {
        console.error("Causa:", apiError.cause);
        if (apiError.cause[0]?.description) {
          mensagemErro = apiError.cause[0].description;
        }
      }
    } else if (error.message) {
      mensagemErro = error.message;
    }

    return {
      success: false,
      error: mensagemErro
    };
  }
}

module.exports = {
  configurarMercadoPago,
  gerarPixMercadoPago,
  processarPagamentoCartao,
  processarWebhookMercadoPago
};
