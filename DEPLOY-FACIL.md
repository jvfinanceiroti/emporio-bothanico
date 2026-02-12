# 🚀 DEPLOY SUPER FÁCIL - RENDER.COM
## Em 5 passos sua loja está no ar!

---

## ✅ PRÉ-REQUISITOS

1. **Instalar Git** (se ainda não tem):
   - Baixe: https://git-scm.com/download/win
   - Instale com configurações padrão
   - **Reinicie o PowerShell**

2. **Criar conta no GitHub** (se ainda não tem):
   - Acesse: https://github.com/signup
   - Crie sua conta gratuitamente

---

## 📦 PASSO 1: PREPARAR O CÓDIGO

Abra o PowerShell na pasta do projeto e execute:

```powershell
cd C:\Users\joaov\loja

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Criar commit
git commit -m "Deploy Emporio Bothanico"
```

---

## 🐙 PASSO 2: SUBIR PARA O GITHUB

### 2.1 - Criar repositório no GitHub
1. Acesse: https://github.com/new
2. Preencha:
   - **Nome**: `emporio-bothanico`
   - **Visibilidade**: Private (ou Public)
3. Clique em **"Create repository"**
4. **NÃO marque** nenhuma opção (README, .gitignore, etc)

### 2.2 - Fazer push do código
Copie os comandos que aparecem na página e execute no PowerShell:

```powershell
git remote add origin https://github.com/SEU-USUARIO/emporio-bothanico.git
git branch -M main
git push -u origin main
```

Se pedir usuário e senha:
- **Usuário**: seu username do GitHub
- **Senha**: crie um token em https://github.com/settings/tokens/new
  - Marque: `repo` (acesso completo)
  - Copie o token gerado e use como senha

---

## 🎯 PASSO 3: CRIAR CONTA NO RENDER

1. Acesse: https://render.com/
2. Clique em **"Get Started"**
3. Faça login com **GitHub** (botão azul)
4. Autorize o Render a acessar seus repositórios

---

## 🚀 PASSO 4: FAZER O DEPLOY (O MAIS IMPORTANTE!)

### 4.1 - Criar novo Blueprint
1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Blueprint"**
3. Conecte o repositório `emporio-bothanico`
4. O Render vai detectar o arquivo `render.yaml`
5. Clique em **"Apply"**

### 4.2 - Aguardar o deploy
- O Render vai criar **automaticamente**:
  - ✅ Banco de dados PostgreSQL
  - ✅ Backend (API)
  - ✅ Frontend (Site)
  
- Tempo estimado: **5-8 minutos**
- Você pode acompanhar os logs em tempo real

### 4.3 - Pegar as URLs
Após finalizar, você verá 2 serviços:
- **emporio-backend**: URL tipo `https://emporio-backend-xxxx.onrender.com`
- **emporio-frontend**: URL tipo `https://emporio-frontend-yyyy.onrender.com`

**SALVE essas URLs!**

---

## 🌐 PASSO 5: CONFIGURAR SEU DOMÍNIO

### 5.1 - Adicionar domínio no Render
1. Clique no serviço **emporio-frontend**
2. Vá em **"Settings"** (menu lateral)
3. Role até **"Custom Domain"**
4. Clique em **"Add Custom Domain"**
5. Digite seu domínio: `emporiobothanico.com.br`
6. Clique em **"Add"**

### 5.2 - Configurar DNS no seu provedor

O Render mostrará algo assim:
```
CNAME Record
Name: emporiobothanico.com.br
Value: emporio-frontend-yyyy.onrender.com
```

**No painel do seu provedor de domínio** (Registro.br, GoDaddy, Hostinger, etc):

1. Encontre **"Gerenciar DNS"** ou **"DNS Records"**
2. Adicione um registro **CNAME**:
   - **Nome/Host**: `@` (ou deixe vazio)
   - **Tipo**: CNAME
   - **Valor/Aponta para**: Cole a URL que o Render forneceu
   - **TTL**: 3600 (ou automático)
3. Se for `www.emporiobothanico.com.br`, adicione outro CNAME:
   - **Nome/Host**: `www`
   - **Tipo**: CNAME
   - **Valor**: mesma URL do Render
4. **Salve as alterações**

### 5.3 - Aguardar propagação
- Pode levar de **15 minutos até 48 horas**
- Geralmente funciona em **30 minutos**
- Teste em: https://dnschecker.org

---

## ✅ VERIFICAÇÃO FINAL

### Testar o Backend
Acesse: `https://emporio-backend-xxxx.onrender.com/produtos`
- **Deve retornar**: `[]` ou lista de produtos

### Testar o Frontend
Acesse: `https://emporio-frontend-yyyy.onrender.com`
- **Deve mostrar**: Sua loja funcionando!

### Testar o Admin
Acesse: `https://emporiobothanico.com.br/admin/login`
- **Email**: `admin@emporio.com.br`
- **Senha**: `admin123`

---

## 🔥 DICAS IMPORTANTES

### ⚠️ IMPORTANTE: Primeiro acesso pode ser lento
- O Render coloca serviços gratuitos em "modo hibernação" após 15min sem uso
- O **primeiro acesso** pode levar 30-60 segundos para "acordar"
- Depois disso fica rápido normalmente

### 🔄 Como fazer atualizações?
Sempre que você fizer alterações no código:
```powershell
cd C:\Users\joaov\loja
git add .
git commit -m "Descrição da mudança"
git push
```
O Render faz **deploy automático** em 2-3 minutos!

### 📊 Ver logs em tempo real
1. No dashboard do Render
2. Clique no serviço (backend ou frontend)
3. Vá em **"Logs"**
4. Veja tudo que está acontecendo!

### 🆘 Serviço não inicia?
1. Verifique os **Logs** no Render
2. Procure por mensagens de erro em vermelho
3. Se necessário, apague e recrie o Blueprint

---

## 🎉 PRONTO! SUA LOJA ESTÁ NO AR!

**URLs para compartilhar:**
- Loja: `https://emporiobothanico.com.br`
- Admin: `https://emporiobothanico.com.br/admin/login`

**Credenciais Admin:**
- Email: `admin@emporio.com.br`
- Senha: `admin123`

⚠️ **LEMBRE-SE**: Altere a senha após primeiro acesso!

---

## 📞 PROBLEMAS COMUNS

### "Service failed to start"
- Verifique os logs no Render
- Geralmente é problema de variável de ambiente
- O render.yaml já configura tudo automaticamente

### "Database connection failed"
- Aguarde 1-2 minutos - banco pode estar inicializando
- Verifique se o banco de dados foi criado no Blueprint

### "Domain not working"
- Aguarde até 48h para propagação DNS
- Use https://dnschecker.org para verificar
- Confirme que o CNAME está correto no provedor

### "Site muito lento"
- Primeiro acesso após hibernação é lento (30-60s)
- Considere upgrade para plano pago ($7/mês) para evitar hibernação

---

## 💰 CUSTOS

**Plano Gratuito (atual):**
- ✅ Banco PostgreSQL: 500MB grátis
- ✅ Backend: 750h/mês grátis
- ✅ Frontend: 750h/mês grátis
- ⚠️ Hiberna após 15min de inatividade
- ⚠️ Primeiro acesso pode ser lento

**Plano Pago (opcional):**
- 💰 $7/mês por serviço
- ✅ Nunca hiberna
- ✅ Performance melhor
- ✅ Builds mais rápidos

---

## 🚀 PRÓXIMOS PASSOS

Depois que tudo estiver funcionando, você pode:
- ✅ Adicionar produtos na área admin
- ✅ Personalizar cores e textos
- ✅ Adicionar mais funcionalidades
- ✅ Integrar pagamento (PIX, cartão)
- ✅ Adicionar rastreamento (Google Analytics)

---

**🎊 PARABÉNS! SUA LOJA ESTÁ PROFISSIONALMENTE HOSPEDADA!**

Qualquer dúvida, consulte a documentação do Render: https://render.com/docs
