const transporter = require("./config");
const { templatePedidoAprovado, templatePedidoRecusado } = require("./templates");

/**
 * Enviar email de pedido aprovado
 */
async function enviarEmailPedidoAprovado(pedido, itens, emailCliente) {
  try {
    const html = templatePedidoAprovado(pedido, itens);

    const mailOptions = {
      from: `"Empório Bothânico" <${process.env.SMTP_USER}>`,
      to: emailCliente,
      subject: `✅ Pedido #${pedido.id} Aprovado - Empório Bothânico`,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email de aprovação enviado para ${emailCliente}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Erro ao enviar email de aprovação:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Enviar email de pedido recusado
 */
async function enviarEmailPedidoRecusado(pedido, emailCliente, motivoRecusa) {
  try {
    const html = templatePedidoRecusado(pedido, motivoRecusa);

    const mailOptions = {
      from: `"Empório Bothânico" <${process.env.SMTP_USER}>`,
      to: emailCliente,
      subject: `⚠️ Pagamento Recusado - Pedido #${pedido.id}`,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email de recusa enviado para ${emailCliente}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Erro ao enviar email de recusa:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  enviarEmailPedidoAprovado,
  enviarEmailPedidoRecusado,
};
