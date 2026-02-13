# 🔧 CORREÇÃO - Erro ao Listar Funcionários

## ❌ Problema
```
Erro ao listar funcionários: error: column "created_at" does not exist
```

## ✅ SOLUÇÃO RÁPIDA

### 1️⃣ Execute SQL no Supabase (OPCIONAL - melhoria futura)

Cole e execute no **Supabase SQL Editor**:

```sql
-- Adicionar coluna created_at na tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Atualizar registros existentes
UPDATE usuarios SET created_at = NOW() WHERE created_at IS NULL;
```

### 2️⃣ Redeploy do Backend (OBRIGATÓRIO)

O código já foi corrigido para **não depender** da coluna `created_at`.

**No Render:**
1. Acesse: https://dashboard.render.com
2. Selecione o serviço **backend** (emporio-bothanico)
3. Clique em **Manual Deploy** → **Deploy latest commit**
4. Aguarde ~2 minutos

### 3️⃣ Teste

Após o deploy:
1. Acesse: https://emporiobothanico.com.br/admin/dashboard
2. Clique em **Funcionários**
3. Deve listar os funcionários sem erro

---

**Status:** ✅ Código corrigido e pronto para deploy
