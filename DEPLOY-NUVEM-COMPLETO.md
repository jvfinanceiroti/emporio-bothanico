# 🚀 GUIA DE DEPLOY DEFINITIVO NA NUVEM

## ✅ O QUE JÁ FOI FEITO

1. ✅ **Código corrigido e commitado**
   - Nome do usuário no header admin
   - Sistema de permissões funcionando
   - Busca de pedidos corrigida (SSR fix)
   - Últimos commits: b2a2efa, 1c5fbfb, d0f29ee

2. ✅ **Bancos de dados configurados**
   - Supabase: PostgreSQL em nuvem (ativo)
   - Render: Usando Supabase como database

3. ✅ **Variáveis de ambiente configuradas**
   - Backend: `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`
   - Frontend: `NEXT_PUBLIC_API_URL`

---

## 🎯 O QUE VOCÊ PRECISA FAZER AGORA (5 MIN)

### **1. Deploy do BACKEND (2 minutos)**

1. Acesse: https://dashboard.render.com
2. Na lista de serviços, encontre: **emporio-bothanico** (backend)
3. Clique no serviço
4. No topo da página, clique: **Manual Deploy** (botão azul)
5. Selecione: **Deploy latest commit**
6. Aguarde até aparecer: 🟢 **Live** (aprox. 2 minutos)

**Como saber se é o backend?**
- URL termina com `.onrender.com` sem ser `emporiobothanico.com.br`
- Mostra "API Loja rodando 🚀" quando acessado

---

### **2. Deploy do FRONTEND (3-5 minutos)**

1. Ainda em: https://dashboard.render.com
2. Na lista de serviços, encontre: **emporiobothanico.com.br** (frontend)
3. Clique no serviço
4. **IMPORTANTE**: Verifique as variáveis de ambiente:
   - Clique em **Environment**
   - Confirme que existe: `NEXT_PUBLIC_API_URL = https://emporio-bothanico.onrender.com`
   - Se não existir, adicione e clique **Save Changes**
5. Clique: **Manual Deploy** → **Deploy latest commit**
6. Aguarde até aparecer: 🟢 **Live** (aprox. 3-5 minutos)

**Como saber se é o frontend?**
- Domínio customizado: `emporiobothanico.com.br`
- É o site visível para o público

---

## 🧪 COMO TESTAR DEPOIS DO DEPLOY

### **Teste 1: Header com nome do usuário**

1. Acesse: https://emporiobothanico.com.br/admin/login
2. Faça login com: `admin@emporio.com.br` / sua senha
3. Você deve ver no header:
   ```
   Painel Admin
   👑 Olá, Naiara
   ```

**Se não aparecer:**
- Pressione `Ctrl + Shift + R` (limpar cache)
- Faça login novamente
- Se ainda não aparecer, abra Console (F12) e procure erros

---

### **Teste 2: Busca de pedidos**

1. Acesse: https://emporiobothanico.com.br/meus-pedidos
2. Digite um email de teste (ex: `kleb@gmail.com`)
3. Clique: **🔍 Buscar Pedidos**
4. Deve retornar pedidos ou "Nenhum pedido encontrado"

**Se der erro "Token não fornecido":**
- O deploy não foi concluído
- Aguarde mais 2 minutos
- Pressione `Ctrl + Shift + R`

---

### **Teste 3: Sistema de permissões**

1. No painel admin, crie um funcionário:
   - Dashboard → **Gerenciar Funcionários**
   - Crie com apenas: ✅ **pode_visualizar_pedidos**
2. Faça logout
3. Faça login com as credenciais do funcionário
4. Você deve ver:
   - ✅ Menu: **Pedidos** (visível)
   - ❌ Menu: **Produtos**, **Usuários** (ocultos)

---

## 🛠️ TROUBLESHOOTING

### **Problema 1: "Site não atualizado"**

**Causa**: Cache do navegador ou deploy não propagado

**Solução**:
```
1. Pressione: Ctrl + Shift + R
2. Se não funcionar, abra janela anônima (Ctrl + Shift + N)
3. Teste na janela anônima
```

---

### **Problema 2: "Erro 503 - Service Unavailable"**

**Causa**: Serviço está fazendo deploy ou demorou muito sem acesso

**Solução**:
```
1. Aguarde 2-5 minutos (Render está fazendo build)
2. Se persistir, acesse dashboard do Render
3. Verifique logs do serviço (botão "Logs")
4. Procure por erros de build ou variáveis faltando
```

---

### **Problema 3: "Produtos não aparecem"**

**Causa**: Erro de conexão com Supabase ou backend offline

**Solução**:
```
1. Teste o backend diretamente:
   https://emporio-bothanico.onrender.com/produtos
   
2. Deve retornar JSON com produtos
3. Se retornar erro, verifique variável DATABASE_URL no Render
```

---

### **Problema 4: "Login não funciona"**

**Causa**: JWT_SECRET incorreto ou usuário não existe no Supabase

**Solução**:
```
1. Confirme que JWT_SECRET está configurado no Render
2. Verifique se usuário existe no Supabase:
   - Acesse: https://supabase.com/dashboard
   - Projeto → Table Editor → usuarios
   - Procure por: admin@emporio.com.br
   
3. Se não existir, crie manualmente ou rode migrations
```

---

## 📋 CHECKLIST FINAL

Antes de considerar o deploy completo, verifique:

- [ ] Backend com status 🟢 Live no Render
- [ ] Frontend com status 🟢 Live no Render
- [ ] Site abre em: https://emporiobothanico.com.br
- [ ] Produtos carregam na página inicial
- [ ] Login no admin funciona
- [ ] Nome do usuário aparece no header admin
- [ ] Busca de pedidos retorna resultados (ou "nenhum pedido")
- [ ] Funcionário com permissões limitadas vê apenas menus permitidos
- [ ] Upload de imagem funciona (Cloudinary)
- [ ] Checkout funciona e salva pedido no banco

---

## 🎯 PRÓXIMOS PASSOS (OPCIONAL)

Depois que tudo estiver funcionando:

1. **Teste completo do fluxo de compra**
   - Adicione produto ao carrinho
   - Finalize compra
   - Verifique se pedido aparece em "Pedidos"

2. **Configure DNS customizado** (se ainda não fez)
   - No Registro.br: Aponte para Render
   - Aguarde propagação (até 48h)

3. **Backup do banco de dados**
   - Supabase faz backup automático
   - Mas exporte uma cópia local por segurança

4. **Monitore logs**
   - Render Dashboard → Logs
   - Procure por erros ou warnings
   - Configure alertas (opcional)

---

## 📞 SUPORTE

Se após seguir todos os passos ainda houver problemas:

1. **Anote**:
   - URL exata do erro
   - Screenshot do erro (F12 → Console)
   - Horário do erro
   - Últimas ações antes do erro

2. **Logs do Render**:
   - Dashboard → Serviço → Logs
   - Copie últimas 50 linhas

3. **Banco de dados**:
   - Supabase → Table Editor
   - Confirme se tabelas existem: `usuarios`, `produtos`, `pedidos`, `itens_pedido`, `permissoes`

---

**IMPORTANTE**: Não altere código manualmente no Render. Sempre faça mudanças localmente, commite, e faça deploy pelo GitHub.

**LEMBRE-SE**: Deploy demora 5-8 minutos no total. Seja paciente! 🚀
