# 📧 Configuração de Email - Empório Bothânico

## ✅ Sistema Implementado

O sistema agora envia emails automaticamente em dois cenários:

1. **Pedido Aprovado** → Email bonito com detalhes da compra e status "Em Produção"
2. **Pedido Recusado** → Email sugerindo pagamento via PIX

---

## 🔧 Configuração no Render (Backend)

Você precisa adicionar estas variáveis de ambiente no Render:

### Opção 1: Gmail (Mais Fácil)

1. Entre em: https://dashboard.render.com
2. Clique no seu serviço backend
3. Vá em **Environment**
4. Adicione estas variáveis:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app-do-gmail
```

#### Como gerar senha de app do Gmail:

1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione "Email" e "Outro (nome personalizado)"
3. Digite "Empório Bothânico"
4. Copie a senha gerada (16 caracteres)
5. Cole em `SMTP_PASS`

---

### Opção 2: Outlook/Hotmail

```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=seu-email@outlook.com
SMTP_PASS=sua-senha
```

---

### Opção 3: Serviço Profissional (SendGrid - Recomendado para Produção)

SendGrid oferece 100 emails grátis por dia:

1. Crie conta em: https://sendgrid.com
2. Vá em Settings → API Keys
3. Crie uma API Key
4. Configure:

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.sua-api-key-aqui
```

---

## 🎨 Templates de Email

Os emails são responsivos e bonitos:

### ✅ Email de Aprovação
- Header verde com ✅
- Detalhes do pedido
- Lista de produtos comprados
- Total pago destacado
- Endereço de entrega
- Mensagem: "Seu pedido está em produção!"

### ❌ Email de Recusa
- Header vermelho com ⚠️
- Motivo da recusa
- Botão grande "Pagar com PIX"
- Lista de motivos comuns
- Link para tentar outro cartão

---

## 🧪 Testar Emails

Após configurar as variáveis:

1. Faça um pedido de teste
2. Tente pagar com cartão (aprovado ou recusado)
3. Verifique o email do cliente

**Cartões de teste Mercado Pago:**
- **Aprovar:** 5031 7557 3453 0604 / Nome: APRO
- **Recusar:** 5031 4332 1540 6351 / Nome: OTHE

---

## 📋 Checklist de Configuração

- [ ] Variáveis SMTP configuradas no Render
- [ ] Senha de app do Gmail criada (se usar Gmail)
- [ ] Deploy feito no Render
- [ ] Teste de email de aprovação
- [ ] Teste de email de recusa
- [ ] Emails chegando na caixa de entrada (não spam)

---

## ⚠️ Problemas Comuns

### Email não chega
- Verifique se as credenciais SMTP estão corretas
- Confira se a senha de app do Gmail está certa
- Veja os logs do Render para erros

### Email vai para spam
- Configure SPF e DKIM do seu domínio
- Ou use SendGrid (evita spam automaticamente)

### Erro "Invalid login"
- Gmail: use senha de app, não senha normal
- Outlook: habilite "aplicativos menos seguros"

---

## 🎯 Próximos Passos

1. Configure SMTP no Render
2. Teste os emails
3. (Opcional) Configure domínio próprio
4. (Opcional) Migre para SendGrid em produção

---

Feito! 🚀
