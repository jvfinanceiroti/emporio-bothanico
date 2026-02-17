const nodemailer = require("nodemailer");
const dns = require("dns");
const nm = nodemailer.default || nodemailer;

// Forçar IPv4: Render e muitos hosts em nuvem não têm rota IPv6.
// Gmail retorna IPv6 primeiro, causando ENETUNREACH. IPv4 evita isso.
dns.setDefaultResultOrder("ipv4first");

// Configuração do email (use suas credenciais SMTP)
const transporter = nm.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 15000,
  greetingTimeout: 10000,
});

// Testar conexão
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Erro ao conectar com servidor de email:", error.message);
  } else {
    console.log("✅ Servidor de email pronto!");
  }
});

module.exports = transporter;
