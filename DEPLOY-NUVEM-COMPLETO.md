# 🚀 DEPLOY COMPLETO NA NUVEM - RENDER

## 📋 Status Atual dos Commits

```
af3c647 - Guia de teste final do sistema de permissões
d055228 - Adicionar nome do usuário no header admin ⭐ NOVO
d0f29ee - Corrigir busca de pedidos com URL dinâmica ⭐ NOVO
ebe9b88 - Adicionar documentação completa
490aedc - Implementar sistema de permissões ⭐ NOVO
```

**Total de mudanças novas:** 3 commits importantes

---

## 🎯 O Que Será Atualizado

### Backend (Commit d0f29ee + anteriores)
- ✅ Endpoint `/auth/permissoes` funcionando
- ✅ Sistema de permissões completo
- ✅ Correções de bugs

### Frontend (Commit d055228 + anteriores)
- ✅ **Header com nome do usuário** - "👑 Administrador • Olá, Naiara"
- ✅ **Badge visual** - Card cinza com nome
- ✅ **Sistema de permissões completo** - Bloqueia páginas/botões
- ✅ **Menu condicional** - Só mostra opções permitidas
- ✅ **Busca de pedidos corrigida** - URL dinâmica

---

## 📝 PASSO A PASSO PARA DEPLOY

### 1️⃣ Deploy do BACKEND

1. Acesse: **https://dashboard.render.com**

2. **Localize o serviço do BACKEND:**
   - Nome: `emporio-bothanico` ou similar
   - Tipo: Web Service
   - URL: `https://emporio-bothanico.onrender.com`

3. **Fazer deploy:**
   - Clique em **"Manual Deploy"**
   - Selecione **"Deploy latest commit"**
   - Aguarde: ~2-3 minutos

4. **Verificar se funcionou:**
   - Status deve ficar: ✅ **Live**
   - Cor: Verde
   - Última mensagem de log: "Servidor rodando na porta..."

---

### 2️⃣ Deploy do FRONTEND

1. **Localize o serviço do FRONTEND:**
   - Nome: Pode ser o mesmo ou diferente do backend
   - Tipo: Web Service
   - URL vinculada: `emporiobothanico.com.br`

2. **Verificar variável de ambiente CRÍTICA:**
   - Vá em **"Environment"** (menu lateral)
   - Confirme que existe:
     ```
     NEXT_PUBLIC_API_URL = https://emporio-bothanico.onrender.com
     ```
   - ⚠️ **SE NÃO EXISTIR:** Adicione agora!

3. **Fazer deploy:**
   - Clique em **"Manual Deploy"**
   - Selecione **"Deploy latest commit"**
   - Aguarde: ~3-5 minutos (Next.js demora mais)

4. **Verificar se funcionou:**
   - Status deve ficar: ✅ **Live**
   - Cor: Verde
   - Logs devem mostrar: "Build completed"

---

## ✅ TESTE APÓS DEPLOY

### Teste 1: Header com Nome

1. Acesse: **https://emporiobothanico.com.br/admin/login**

2. Faça login:
   ```
   Email: admin@emporio.com.br
   Senha: admin123
   ```

3. **Deve ver no header:**
   ```
   ┌──────────────────────────────────────┐
   │ 🖼️ Logo | Painel Admin              │
   │           👑 Administrador • Olá, Naiara │
   │                                       │
   │                  [👑 Naiara] [Sair]  │
   └──────────────────────────────────────┘
   ```

4. **Se não aparecer:**
   - Pressione `Ctrl + Shift + R` (hard refresh)
   - Ou limpe cache do navegador
   - Ou abra em aba anônima

---

### Teste 2: Busca de Pedidos

1. Acesse: **https://emporiobothanico.com.br/meus-pedidos**

2. Digite: `kleb@gmail.com`

3. Clique em **"Buscar"**

4. **Deve mostrar:**
   ```
   ✅ Pedidos encontrados: 1
   
   📦 Pedido #4
   Cliente: Joao kleber
   ...
   ```

5. **Se der erro "Token não fornecido":**
   - ⚠️ Frontend não foi redeployado corretamente
   - Ou variável `NEXT_PUBLIC_API_URL` não está configurada

---

### Teste 3: Sistema de Permissões

#### A) Criar Funcionário Restrito

1. Logado como admin, clique em **"Funcionários"**

2. Clique em **"Novo Funcionário"**

3. Preencha:
   ```
   Nome: João Teste
   Email: func.teste@emporio.com.br
   Senha: teste123
   
   PERMISSÕES (marcar APENAS):
   ✅ Pode visualizar pedidos
   ✅ Pode adicionar código de rastreio
   ```

4. Salvar

#### B) Testar Funcionário

1. Faça **Logout**

2. Faça login com:
   ```
   Email: func.teste@emporio.com.br
   Senha: teste123
   ```

3. **Deve ver:**
   ```
   Header: "👤 Funcionário • Olá, João Teste"
   Badge: [👤 João Teste]
   Menu: APENAS "🛒 Pedidos"
   ```

4. **NÃO deve ver:**
   ```
   Menus: Dashboard, Produtos, Usuários, Funcionários
   ```

5. **Teste de bloqueio de URL:**
   - Tente acessar: `https://emporiobothanico.com.br/admin/produtos`
   - Deve mostrar alerta: "Você não tem permissão para acessar esta página"
   - E redirecionar para: `/admin/dashboard`

---

## 🔍 VERIFICAÇÕES DE SEGURANÇA

### Verificar Variáveis de Ambiente (Backend)

No Render, serviço BACKEND → Environment:

```
✅ DATABASE_URL = postgresql://postgres.cztqx...
✅ JWT_SECRET = super-secret-jwt-key-2024
✅ CLOUDINARY_CLOUD_NAME = dhyblzugz
✅ CLOUDINARY_API_KEY = 629775744341559
✅ CLOUDINARY_API_SECRET = IACl75fZDlj66c44Us981JkWDi0
```

### Verificar Variáveis de Ambiente (Frontend)

No Render, serviço FRONTEND → Environment:

```
✅ NEXT_PUBLIC_API_URL = https://emporio-bothanico.onrender.com
```

⚠️ **ATENÇÃO:** Se adicionar/alterar variável no frontend, precisa fazer **deploy novamente** (Next.js compila variáveis no build)

---

## 🐛 TROUBLESHOOTING

### Problema: "Token não fornecido" na busca de pedidos

**Causa:** Frontend não atualizou ou variável `NEXT_PUBLIC_API_URL` não está configurada

**Solução:**
1. Verificar variável no Render (Frontend → Environment)
2. Fazer deploy novamente
3. Aguardar 3-5 minutos
4. Testar com hard refresh (`Ctrl + Shift + R`)

---

### Problema: Nome não aparece no header

**Causa:** Cache do navegador ou frontend não atualizou

**Solução:**
1. Hard refresh: `Ctrl + Shift + R`
2. Limpar cache: `Ctrl + Shift + Delete`
3. Testar em aba anônima: `Ctrl + Shift + N`
4. Verificar se deploy foi concluído (status Live)

---

### Problema: Funcionário vê todas as páginas

**Causa:** Sistema de permissões não carregou ou backend não retornou permissões

**Solução:**
1. Verificar se backend foi deployado
2. Abrir console do navegador (F12)
3. Procurar por erro em vermelho
4. Verificar se requisição `/auth/permissoes` retorna dados corretos

---

## 📊 CHECKLIST FINAL

### Antes do Deploy
- [x] Commits enviados para GitHub
- [x] Servidores locais parados

### Durante o Deploy
- [ ] Backend: Deploy iniciado
- [ ] Backend: Status = Live (verde)
- [ ] Frontend: Variável NEXT_PUBLIC_API_URL configurada
- [ ] Frontend: Deploy iniciado
- [ ] Frontend: Status = Live (verde)

### Após o Deploy
- [ ] Teste 1: Header mostra nome do usuário
- [ ] Teste 2: Busca de pedidos funciona
- [ ] Teste 3: Funcionário criado com permissões limitadas
- [ ] Teste 4: Funcionário vê apenas menus permitidos
- [ ] Teste 5: Funcionário bloqueado ao tentar acessar páginas restritas

---

## 🎯 RESULTADO ESPERADO

Após completar todos os passos:

### Para Admin (Naiara)
```
✅ Header: "👑 Administrador • Olá, Naiara"
✅ Badge: [👑 Naiara]
✅ Menus: Dashboard | Produtos | Pedidos | Usuários | Funcionários
✅ Acesso: Total a todas as páginas e ações
```

### Para Funcionário (João Teste)
```
✅ Header: "👤 Funcionário • Olá, João Teste"
✅ Badge: [👤 João Teste]
✅ Menus: Apenas Pedidos
❌ Bloqueado: Dashboard, Produtos, Usuários, Funcionários
❌ Botões ocultos: Ações que não tem permissão
```

---

**Tempo estimado de deploy:** 5-8 minutos (backend + frontend)
**Próxima ação:** Acessar https://dashboard.render.com e iniciar deploy! 🚀
