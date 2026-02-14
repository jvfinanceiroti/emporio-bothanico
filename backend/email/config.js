const nodemailer = require("nodemailer");

// Configuração do email (use suas credenciais SMTP)
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER, // seu email
    pass: process.env.SMTP_PASS, // senha de app do Gmail
  },
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
