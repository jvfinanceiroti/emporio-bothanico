# 🔐 CONFIGURAÇÃO DE CRIPTOGRAFIA DE CARTÃO

## ⚠️ AVISO LEGAL IMPORTANTE

**VOCÊ ASSUME TOTAL RESPONSABILIDADE LEGAL AO USAR ESTA FUNCIONALIDADE.**

Esta implementação permite salvar números de cartão criptografados no banco de dados. **Isso é extremamente arriscado e pode ser ILEGAL dependendo do seu caso de uso.**

### 🚨 Responsabilidades Legais:
- ✅ **PERMITIDO**: Salvar seu próprio cartão em ambiente de teste/desenvolvimento
- ❌ **PROIBIDO**: Processar cartões de terceiros sem certificação PCI-DSS
- ❌ **PROIBIDO**: Uso comercial sem conformidade total com PCI-DSS Level 1
- ⚠️ **RISCO**: Multas de até R$ 50 milhões (LGPD) + processos criminais

---

## 📋 PASSO A PASSO DE CONFIGURAÇÃO

### 1️⃣ Execute o SQL no Supabase

Acesse o **SQL Editor** do Supabase e execute:

```sql
-- Adicionar coluna para número do cartão CRIPTOGRAFADO
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_numero_criptografado TEXT;

-- Índice para busca
CREATE INDEX IF NOT EXISTS idx_pedidos_cartao_cripto 
  ON pedidos(cartao_numero_criptografado) 
  WHERE cartao_numero_criptografado IS NOT NULL;
```

---

### 2️⃣ Configure a Chave de Criptografia no Render

**⚠️ GUARDE ESTA CHAVE COM SEGURANÇA! SE PERDER, NÃO CONSEGUIRÁ DESCRIPTOGRAFAR OS DADOS!**

**Sua chave gerada:**
```
ENCRYPTION_KEY=2d5adff4662002dc72f3439e8f9904d61de6b0ccc0fbeebbeeae0cf2ff8b6de4
```

**Como adicionar no Render (Backend):**

1. Acesse: https://dashboard.render.com
2. Vá no seu serviço de **backend** (emporio-bothanico)
3. Clique em **Environment**
4. Clique em **Add Environment Variable**
5. Adicione:
   - **Key:** `ENCRYPTION_KEY`
   - **Value:** `2d5adff4662002dc72f3439e8f9904d61de6b0ccc0fbeebbeeae0cf2ff8b6de4`
6. Clique **Save Changes**
7. Aguarde o **redeploy automático**

---

### 3️⃣ Faça Deploy do Frontend

No Vercel ou Render (frontend):

1. O código já está pronto
2. Faça deploy normalmente:
   - Vercel: Push no GitHub dispara deploy automático
   - Render: Clique em **Manual Deploy → Deploy latest commit**

---

## 🔐 Como Funciona a Criptografia

### Algoritmo: **AES-256-GCM** (padrão militar)

**Fluxo de Criptografia:**
```
Número do Cartão (1234567812345678)
         ↓
   [Frontend] Envia via HTTPS
         ↓
   [Backend] Recebe número limpo
         ↓
   [crypto-helper.js] Criptografa com AES-256-GCM
         ↓
   Resultado: "abc123:def456:xyz789..." (IV:AuthTag:Encrypted)
         ↓
   [PostgreSQL] Salva criptografado
```

**Fluxo de Descriptografia:**
```
  [PostgreSQL] Retorna texto criptografado
         ↓
   [crypto-helper.js] Descriptografa com ENCRYPTION_KEY
         ↓
   Número Original: 1234567812345678
```

---

## 📊 Estrutura no Banco de Dados

Após configurado, cada pedido com cartão terá:

| Coluna | Exemplo | Descrição |
|--------|---------|-----------|
| `cartao_ultimos_digitos` | `1234` | Últimos 4 dígitos (visível) |
| `cartao_nome_titular` | `JOÃO SILVA` | Nome no cartão |
| `cartao_bandeira` | `Visa` | Bandeira do cartão |
| `cartao_numero_criptografado` | `a1b2c3:d4e5f6:g7h8i9...` | Número completo CRIPTOGRAFADO |

---

## 🛠️ Como Descriptografar um Cartão (Admin)

**Via código Node.js:**

```javascript
const { decrypt } = require('./crypto-helper');

// Buscar pedido do banco
const pedido = await pool.query('SELECT * FROM pedidos WHERE id = $1', [123]);

if (pedido.rows[0].cartao_numero_criptografado) {
  const numeroDescriptografado = decrypt(pedido.rows[0].cartao_numero_criptografado);
  console.log('Número do cartão:', numeroDescriptografado);
  // Resultado: 1234567812345678
}
```

**Via SQL no Supabase (não é possível):**
- SQL não consegue descriptografar AES-256
- Você PRECISA usar o backend Node.js com a ENCRYPTION_KEY

---

## 🚨 REGRAS DE SEGURANÇA OBRIGATÓRIAS

### ✅ SEMPRE FAÇA:
1. Mantenha a `ENCRYPTION_KEY` em variável de ambiente (nunca no código)
2. Use HTTPS em produção (já configurado no Render/Vercel)
3. Faça backup da ENCRYPTION_KEY em local seguro
4. Limite acesso ao banco de dados
5. Audite quem acessa os dados descriptografados

### ❌ NUNCA FAÇA:
1. Commitar a ENCRYPTION_KEY no Git
2. Expor dados descriptografados em APIs públicas
3. Mostrar número completo na tela (só mostre mascarado: **** **** **** 1234)
4. Processar cartões de clientes reais sem certificação PCI-DSS
5. Compartilhar a chave por email/Slack/WhatsApp

---

## 🧪 Como Testar

### Teste com seu próprio cartão:

1. Adicione produtos ao carrinho
2. Vá para checkout
3. Preencha seus dados
4. Clique "Finalizar Pagamento"
5. Escolha "Cartão de Crédito"
6. Clique "Confirmar Pedido"
7. **Digite SEU cartão** (será criptografado)
8. Clique "Pagar"

### Verificar no banco:

```sql
-- Ver dados criptografados
SELECT 
  id,
  cliente_nome,
  total,
  cartao_ultimos_digitos,
  cartao_nome_titular,
  cartao_bandeira,
  LEFT(cartao_numero_criptografado, 50) as numero_criptografado_preview
FROM pedidos
WHERE cartao_numero_criptografado IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🆘 Perdi a Chave de Criptografia! O que fazer?

**Infelizmente, NÃO HÁ SOLUÇÃO.**

- AES-256 é inquebrável sem a chave
- Dados criptografados se tornam permanentemente inacessíveis
- Você precisará gerar nova chave e recriptografar dados futuros
- Dados antigos serão perdidos

**Por isso:**
1. **Faça backup da chave** em local seguro (ex: gerenciador de senhas)
2. **Documente** onde está o backup
3. Considere ter uma chave de backup secundária

---

## 📞 Suporte

**⚠️ Lembre-se:**
- Eu implementei a funcionalidade conforme solicitado
- Você assume responsabilidade legal total
- Use APENAS para seus próprios dados
- Em caso de dúvida, consulte um advogado especializado em LGPD/PCI-DSS

---

## 🔗 Recursos Adicionais

- [PCI-DSS Requirements](https://www.pcisecuritystandards.org/)
- [LGPD - Lei Geral de Proteção de Dados](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)
- [AES-GCM Encryption](https://en.wikipedia.org/wiki/Galois/Counter_Mode)

---

**Última atualização:** 2026-02-13  
**Commit:** e8a4886
