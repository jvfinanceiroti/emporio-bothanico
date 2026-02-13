# 🎯 GUIA RÁPIDO: Configurar Supabase em 5 Minutos

## Passo 1: Criar Conta e Projeto

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"** (verde)
3. Faça login com:
   - GitHub (recomendado) OU
   - Email/senha

4. Clique em **"New Project"**

5. Preencha:
   - **Name**: `emporio-bothanico` (ou o nome que preferir)
   - **Database Password**: Crie uma senha FORTE e **ANOTE ESSA SENHA!**
   - **Region**: `South America (São Paulo)` ou `East US (N. Virginia)`
   - **Pricing Plan**: Free (0$/mês)

6. Clique em **"Create new project"**

7. ⏳ **AGUARDE 2-3 MINUTOS** enquanto o Supabase cria seu banco de dados

---

## Passo 2: Executar o Script SQL

1. No menu lateral esquerdo, clique em **"SQL Editor"** (ícone `</>`)

2. Clique no botão **"+ New query"** (canto superior direito)

3. **Abra o arquivo**: `C:\Users\joaov\loja\supabase-setup.sql`

4. **Copie TODO o conteúdo** do arquivo (Ctrl+A, Ctrl+C)

5. **Cole no editor SQL** do Supabase (Ctrl+V)

6. Clique em **"RUN"** (botão verde no canto inferior direito)

7. ✅ **Aguarde 2-5 segundos** até aparecer:
   ```
   Success. No rows returned
   ```

8. 🎉 **Pronto!** Suas tabelas foram criadas com sucesso!

---

## Passo 3: Copiar a Connection String

1. No menu lateral, clique em **"Project Settings"** (ícone de engrenagem ⚙️)

2. No submenu, clique em **"Database"**

3. Role a página até a seção **"Connection string"**

4. Selecione a aba **"URI"** (não use Pooler!)

5. Você verá algo assim:
   ```
   postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```

6. **SUBSTITUA** `[YOUR-PASSWORD]` pela senha que você criou no Passo 1

7. **Copie a string completa** (exemplo final):
   ```
   postgresql://postgres.abcd1234:MinhaSenh@123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```

8. ⚠️ **GUARDE ESSA STRING COM SEGURANÇA!** Você vai precisar dela no backend.

---

## Passo 4: Verificar se Funcionou

1. No menu lateral, clique em **"Table Editor"** (ícone de tabela 📋)

2. Você deve ver **4 tabelas**:
   - ✅ `produtos` (6 produtos de exemplo)
   - ✅ `usuarios` (1 admin)
   - ✅ `pedidos` (vazio)
   - ✅ `pedido_itens` (vazio)

3. Clique em `usuarios` → você deve ver:
   - Email: `admin@emporio.com.br`
   - Role: `admin`

4. Clique em `produtos` → você deve ver 6 produtos de exemplo

---

## Passo 5: Configurar o Backend

### OPÇÃO A: Usar no localhost (testar local)

1. Abra o arquivo: `C:\Users\joaov\loja\backend\.env`

2. **Substitua** a linha do `DATABASE_URL` por:
   ```env
   DATABASE_URL=sua-connection-string-aqui
   JWT_SECRET=seu-secret-aleatorio-aqui-trocar-por-string-longa
   PORT=3001
   ```

3. Exemplo completo:
   ```env
   DATABASE_URL=postgresql://postgres.abcd1234:MinhaSenh@123@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   JWT_SECRET=minha-chave-secreta-super-forte-123456789
   PORT=3001
   ```

4. Reinicie o backend:
   ```powershell
   cd C:\Users\joaov\loja\backend
   node server.js
   ```

5. Teste acessando: http://localhost:3001/produtos
   - Deve retornar os 6 produtos em JSON

### OPÇÃO B: Usar no Hostinger (produção)

1. No painel do Hostinger, vá até seu projeto Node.js

2. Procure por **"Environment Variables"** ou **"Variáveis de Ambiente"**

3. Adicione 2 variáveis:

   **Variável 1:**
   - Name: `DATABASE_URL`
   - Value: `sua-connection-string-completa-aqui`

   **Variável 2:**
   - Name: `JWT_SECRET`
   - Value: `uma-string-aleatoria-longa-e-segura`

4. Salve e reinicie a aplicação

---

## ✅ Checklist Final

- [ ] Projeto criado no Supabase
- [ ] Script SQL executado com sucesso
- [ ] 4 tabelas criadas (produtos, usuarios, pedidos, pedido_itens)
- [ ] Connection String copiada
- [ ] Backend configurado com DATABASE_URL
- [ ] Backend rodando sem erros
- [ ] Endpoint /produtos retorna dados

---

## 🆘 Problemas Comuns

### ❌ "password authentication failed"
- **Causa**: Senha errada na connection string
- **Solução**: Volte no Passo 3 e corrija a senha

### ❌ "relation 'produtos' does not exist"
- **Causa**: Script SQL não foi executado
- **Solução**: Volte no Passo 2 e execute o script

### ❌ "could not connect to server"
- **Causa**: Connection string errada
- **Solução**: Verifique se copiou a string URI completa (não Pooler)

### ❌ "SSL connection required"
- **Causa**: Falta configuração SSL
- **Solução**: Adicione `?sslmode=require` no final da connection string

---

## 📞 Precisa de Ajuda?

Me chame quando chegar em qualquer um desses pontos:
1. ✅ Script executado com sucesso
2. ✅ Connection string copiada
3. ❌ Erro ao conectar backend

**Seu banco de dados já está pronto para uso! 🚀**

---

## 🔐 CREDENCIAIS DO ADMIN

**Para acessar o painel admin após configurar:**
- URL: `https://seudominio.com/admin/login`
- Email: `admin@emporio.com.br`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Troque essa senha depois do primeiro login!

---

## 📊 Próximos Passos

Depois de configurar o Supabase:

1. ✅ Testar backend localmente com novo banco
2. ✅ Fazer upload do backend no Hostinger com variáveis configuradas
3. ✅ Fazer upload do frontend no Hostinger
4. ✅ Testar a loja online completa
5. ✅ Criar alguns produtos reais
6. ✅ Trocar senha do admin
