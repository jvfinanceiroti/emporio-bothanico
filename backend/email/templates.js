// Template HTML responsivo para pedido aprovado
function templatePedidoAprovado(pedido, itens) {
  const formatarPreco = (preco) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const itensHtml = itens
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.nome}</strong>
        ${item.tamanho ? `<br><small style="color: #6b7280;">Tamanho: ${item.tamanho}</small>` : ""}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantidade}x
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatarPreco(item.preco)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        ${formatarPreco(item.preco * item.quantidade)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedido Aprovado - Empório Bothânico</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Container principal -->
        <table width="100%" style="max-width: 600px; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                ✅ Pedido Aprovado!
              </h1>
              <p style="margin: 10px 0 0 0; color: #d1fae5; font-size: 16px;">
                Seu pagamento foi confirmado com sucesso
              </p>
            </td>
          </tr>

          <!-- Informações do pedido -->
          <tr>
            <td style="padding: 30px 20px;">
              <div style="background-color: #f9fafb; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">
                  📦 Pedido #${pedido.id}
                </h2>
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                  <strong>Data:</strong> ${formatarData(pedido.created_at)}
                </p>
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                  <strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">Em Produção</span>
                </p>
              </div>

              <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                📋 Itens do Pedido
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Produto</th>
                    <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Qtd</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Preço</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itensHtml}
                </tbody>
              </table>

              <!-- Total -->
              <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: right; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">Total Pago</p>
                <p style="margin: 5px 0 0 0; font-size: 32px; font-weight: bold;">
                  ${formatarPreco(pedido.total)}
                </p>
              </div>

              <!-- Endereço de entrega -->
              ${
                pedido.endereco_completo
                  ? `
              <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px;">
                  🏠 Endereço de Entrega
                </h3>
                <p style="margin: 0; color: #6b7280; line-height: 1.6;">
                  ${pedido.endereco_completo}<br>
                  ${pedido.cidade} - ${pedido.estado}<br>
                  CEP: ${pedido.cep}
                </p>
              </div>
              `
                  : ""
              }

              <!-- Mensagem -->
              <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>🚀 Seu pedido está em produção!</strong><br>
                  Em breve enviaremos o código de rastreio para acompanhar a entrega.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Obrigado por comprar com a gente! 💚
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Empório Bothânico - CNPJ 04.280.033/0001-93<br>
                Telefone: 31 - 3831-0866
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Template HTML responsivo para pedido recusado
function templatePedidoRecusado(pedido, motivoRecusa) {
  const formatarPreco = (preco) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);
  };

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagamento Recusado - Empório Bothânico</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Container principal -->
        <table width="100%" style="max-width: 600px; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                ⚠️ Pagamento Recusado
              </h1>
              <p style="margin: 10px 0 0 0; color: #fecaca; font-size: 16px;">
                Não foi possível processar seu cartão de crédito
              </p>
            </td>
          </tr>

          <!-- Informações do pedido -->
          <tr>
            <td style="padding: 30px 20px;">
              
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 15px 0; color: #991b1b; font-size: 18px;">
                  📦 Pedido #${pedido.id}
                </h2>
                <p style="margin: 5px 0; color: #dc2626; font-size: 14px;">
                  <strong>Motivo:</strong> ${motivoRecusa || "Cartão recusado pela operadora"}
                </p>
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                  <strong>Valor:</strong> ${formatarPreco(pedido.total)}
                </p>
              </div>

              <!-- Solução alternativa -->
              <div style="background-color: #f0fdf4; border: 2px solid #10b981; padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
                <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 20px;">
                  💡 Tente Pagar com PIX!
                </h3>
                <p style="margin: 0 0 20px 0; color: #047857; font-size: 14px; line-height: 1.6;">
                  O pagamento via PIX é instantâneo, seguro e tem aprovação garantida!
                </p>
                <a href="${process.env.NEXT_PUBLIC_API_URL || "https://emporiobothanico.com.br"}/checkout?pedido=${pedido.id}" 
                   style="display: inline-block; background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  🔄 Pagar com PIX Agora
                </a>
              </div>

              <!-- Informações -->
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                <h4 style="margin: 0 0 15px 0; color: #111827; font-size: 16px;">
                  ❓ Por que meu cartão foi recusado?
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.8;">
                  <li>Saldo insuficiente</li>
                  <li>Limite de crédito excedido</li>
                  <li>Dados do cartão incorretos</li>
                  <li>Cartão bloqueado ou vencido</li>
                </ul>
                <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
                  <strong>💳 Quer tentar outro cartão?</strong> 
                  <a href="${process.env.NEXT_PUBLIC_API_URL || "https://emporiobothanico.com.br"}/checkout?pedido=${pedido.id}" style="color: #3b82f6;">
                    Clique aqui
                  </a>
                </p>
              </div>

              <!-- Suporte -->
              <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                  <strong>📞 Precisa de ajuda?</strong><br>
                  Entre em contato: 31 - 3831-0866
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Estamos aqui para ajudar! 💚
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Empório Bothânico - CNPJ 04.280.033/0001-93<br>
                Telefone: 31 - 3831-0866
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

module.exports = {
  templatePedidoAprovado,
  templatePedidoRecusado,
};
