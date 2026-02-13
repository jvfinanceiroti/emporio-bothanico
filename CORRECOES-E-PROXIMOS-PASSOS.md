# 🔧 CORREÇÕES APLICADAS E PRÓXIMOS PASSOS

## ✅ Correções Aplicadas

### 1. **Botão Gerenciar Funcionários no Dashboard**
- ✅ Adicionado botão "🔧 Gerenciar Funcionários" no dashboard admin
- Localização: `/admin/dashboard` → Seção "Ações Rápidas"
- Cor: Rosa (#ec4899) para diferenciar dos outros botões
- Link: `/admin/funcionarios`

### 2. **Busca de Pedidos por Email - Backend**
- ✅ Corrigido fluxo de execução no endpoint `/pedidos/buscar`
- Problema: Query era executada duas vezes causando erro
- Solução: Adicionado `return` explícito após executar query de email
- Logs adicionados para debug (🔍, 📧, 🆔, ✅, ❌)

### 3. **Busca de Pedidos por Email - Frontend**
- ✅ Corrigida URL da API (porta errada)
- Arquivo: `frontend/app/meus-pedidos/page.tsx`
- Mudança: `localhost:3001` → `localhost:5000`
- Logs adicionados para debug no console do navegador

### 4. **Variáveis de Ambiente**
- ✅ `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5000`
- ✅ `.env.production`: `NEXT_PUBLIC_API_URL=https://emporio-bothanico.onrender.com`

---

## 🚀 TESTE LOCAL AGORA

### Passos para testar:

1. **Reiniciar o frontend** (a mudança do .env.local requer restart):
   ```powershell
   cd C:\Users\joaov\loja\frontend
   # Parar o servidor atual (Ctrl+C)
   npm run dev
   ```

2. **Verificar se backend está rodando**:
   ```powershell
   cd C:\Users\joaov\loja\backend
   npm start
   ```

3. **Testar busca de pedidos**:
   - Abrir: http://localhost:3000/meus-pedidos
   - Escolher "Email"
   - Digitar o email usado em algum pedido
   - Clicar em "🔍 Buscar"
   - Abrir o Console do navegador (F12) e ver os logs

4. **Testar botão de funcionários**:
   - Fazer login em: http://localhost:3000/admin/login
   - Ir para Dashboard
   - Verificar se aparece o botão "🔧 Gerenciar Funcionários"
   - Clicar nele

---

## 📋 MIGRATIONS SQL PENDENTES (Supabase)

**IMPORTANTE**: Você precisa executar estas migrations no Supabase para ter todas as funcionalidades.

### 🔹 Migration 1: Adicionar campo CPF
```sql
-- Arquivo: backend/migrations/add-cliente-cpf.sql
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cliente_cpf VARCHAR(11);

CREATE INDEX IF NOT EXISTS idx_pedidos_cpf ON pedidos(cliente_cpf);
```

### 🔹 Migration 2: Sistema de Permissões (CRÍTICO para Funcionários)
```sql
-- Arquivo: backend/migrations/add-permissoes-funcionarios.sql
-- (Este arquivo já existe, execute ele no SQL Editor do Supabase)
```

**Conteúdo completo:**
```sql
-- Criar tabela de permissões
CREATE TABLE IF NOT EXISTS permissoes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  
  -- Permissões de Produtos
  pode_criar_produtos BOOLEAN DEFAULT false,
  pode_editar_produtos BOOLEAN DEFAULT false,
  pode_deletar_produtos BOOLEAN DEFAULT false,
  pode_gerenciar_estoque BOOLEAN DEFAULT false,
  pode_upload_imagens BOOLEAN DEFAULT false,
  
  -- Permissões de Pedidos
  pode_visualizar_pedidos BOOLEAN DEFAULT true,
  pode_alterar_status_pedidos BOOLEAN DEFAULT false,
  pode_cancelar_pedidos BOOLEAN DEFAULT false,
  pode_adicionar_rastreio BOOLEAN DEFAULT false,
  
  -- Permissões de Usuários/Clientes
  pode_visualizar_usuarios BOOLEAN DEFAULT false,
  pode_gerenciar_funcionarios BOOLEAN DEFAULT false,
  
  -- Permissões de Categorias
  pode_gerenciar_categorias BOOLEAN DEFAULT false,
  
  -- Dashboard
  pode_acessar_dashboard BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_permissoes_usuario ON permissoes(usuario_id);

-- Adicionar coluna role na tabela usuarios se não existir
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'funcionario';

-- Atualizar usuário admin existente
UPDATE usuarios 
SET role = 'admin' 
WHERE email = 'admin@emporio.com.br';

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_permissoes_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_permissoes_timestamp
BEFORE UPDATE ON permissoes
FOR EACH ROW
EXECUTE FUNCTION update_permissoes_timestamp();
```

### 🔹 Migration 3: Código de Rastreio
```sql
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS codigo_rastreio VARCHAR(100);
```

### 🔹 Migration 4: Campo updated_at
```sql
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
```

---

## 🌐 DEPLOY NO RENDER

### Variáveis de Ambiente Obrigatórias:

No painel do Render, adicione estas variáveis:

```
DATABASE_URL = postgresql://postgres.xxxxx:[SUA_SENHA]@aws-xxxxx.pooler.supabase.com:6543/postgres
JWT_SECRET = sua_chave_secreta_super_segura_aqui
PORT = 5000
NODE_ENV = production
CLOUDINARY_CLOUD_NAME = dhyblzugz
CLOUDINARY_API_KEY = 629775744341559
CLOUDINARY_API_SECRET = IACl75fZDlj66c44Us981JkWDi0
```

### Após adicionar variáveis:
1. Clique em "Manual Deploy" → "Deploy latest commit"
2. Aguarde o deploy finalizar (~2-5 minutos)
3. Verifique os logs para confirmar que não há erros

---

## 🔍 TROUBLESHOOTING

### Busca de pedidos retorna vazio:
1. Abra o Console do navegador (F12)
2. Verifique os logs: 
   - `🔍 Buscando pedidos:` mostra a URL
   - `📡 Status da resposta:` mostra se chegou no backend
   - `✅ Pedidos encontrados:` mostra os dados retornados
3. Se status for 500, verifique os logs do backend
4. Se status for 404, a URL da API está errada

### Botão de funcionários não aparece:
1. Limpar cache do navegador (Ctrl+F5)
2. Verificar se está logado como admin
3. Verificar console do navegador por erros

### Página de funcionários dá erro 500:
1. Executar a Migration 2 (Permissões) no Supabase
2. Reiniciar o backend
3. Testar novamente

---

## 📊 STATUS DAS FUNCIONALIDADES

| Funcionalidade | Status | Observação |
|----------------|--------|------------|
| Dashboard Admin | ✅ OK | Botão funcionários adicionado |
| Busca por Email | ✅ CORRIGIDO | Testar após restart |
| Busca por CPF | ⚠️ REQUER MIGRATION | Migration 1 pendente |
| Gerenciar Funcionários | ⚠️ REQUER MIGRATION | Migration 2 pendente |
| Código Rastreio | ⚠️ REQUER MIGRATION | Migration 3 pendente |
| Upload de Imagens | ✅ OK | Cloudinary configurado |
| Categorias | ✅ OK | Sistema implementado |

---

## 🎯 PRÓXIMA AÇÃO

**AGORA:**
1. Restart do frontend para aplicar mudança do .env
2. Testar busca por email localmente
3. Verificar logs no console

**DEPOIS:**
1. Executar Migrations no Supabase (copiar/colar no SQL Editor)
2. Fazer deploy no Render
3. Testar em produção

---

**Data da correção**: 2026-02-13
**Arquivos modificados**:
- `backend/server.js` (endpoint /pedidos/buscar)
- `frontend/app/meus-pedidos/page.tsx` (logs + URL)
- `frontend/app/admin/dashboard/page.tsx` (ícone botão)
- `frontend/.env.local` (porta correta)
- `frontend/.env.production` (URL produção)
