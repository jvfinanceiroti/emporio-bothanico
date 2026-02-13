# 🚀 Guia de Deploy - Hostinger + Supabase

## Parte 1: Preparar o Projeto

### 1.1 Build do Frontend (Next.js)
```powershell
cd C:\Users\joaov\loja\frontend
npm run build
```

### 1.2 Preparar Backend (Node.js)
O backend já está pronto em `C:\Users\joaov\loja\backend`

---

## Parte 2: Configurar Supabase (Banco de Dados)

### 2.1 Criar conta no Supabase
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub ou Email
4. Clique em "New Project"

### 2.2 Configurar o projeto
- **Name**: loja-emporio (ou o nome que preferir)
- **Database Password**: (escolha uma senha forte - ANOTE!)
- **Region**: South America (São Paulo)
- Aguarde 2-3 minutos enquanto cria

### 2.3 Obter credenciais do banco
Após criar o projeto:
1. Vá em **Settings** (ícone de engrenagem)
2. Clique em **Database**
3. Role até "Connection string" e copie a **URI** (formato: `postgresql://...`)

Exemplo:
```
postgresql://postgres.xxxxxxxxxxxx:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### 2.4 Criar as tabelas no Supabase
1. Vá em **SQL Editor** (no menu lateral)
2. Clique em **New Query**
3. Cole o script SQL abaixo e clique em **RUN**

```sql
-- TABELA DE PRODUTOS
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL,
  estoque INTEGER DEFAULT 0,
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true,
  peso_kg NUMERIC(5,2),
  altura_cm NUMERIC(5,2),
  largura_cm NUMERIC(5,2),
  comprimento_cm NUMERIC(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABELA DE USUÁRIOS
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  nome TEXT,
  role TEXT DEFAULT 'cliente',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- TABELA DE PEDIDOS
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER,
  status TEXT DEFAULT 'aguardando_pagamento',
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  cliente_nome TEXT,
  cliente_email TEXT,
  cliente_telefone TEXT,
  endereco_cep VARCHAR(10),
  endereco_rua TEXT,
  endereco_numero VARCHAR(10),
  endereco_complemento TEXT,
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_estado VARCHAR(2),
  frete NUMERIC(10,2) DEFAULT 0,
  forma_pagamento VARCHAR(20)
);

-- TABELA DE ITENS DO PEDIDO
CREATE TABLE pedido_itens (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER NOT NULL,
  preco_unitario NUMERIC(10,2) NOT NULL
);

-- CRIAR USUÁRIO ADMIN
INSERT INTO usuarios (email, senha, nome, role)
VALUES ('admin@emporio.com.br', '$2b$10$YourHashedPasswordHere', 'Administrador', 'admin');
```

**⚠️ IMPORTANTE**: A senha do admin precisa ser hashada. Vou gerar para você depois.

---

## Parte 3: Configurar Hostinger

### 3.1 Painel do Hostinger
1. Faça login em: https://hpanel.hostinger.com
2. Vá em **Hospedagem** ou **Websites**
3. Clique em **Adicionar Website** (ou use um existente)

### 3.2 Escolher tipo de hospedagem
Para este projeto, você precisa de:
- **Node.js Hosting** (para o backend)
- **Static Site** ou **Node.js** (para o frontend Next.js)

**Opção Recomendada**: Use **2 subdomínios**:
- `api.seudominio.com` → Backend (Node.js)
- `www.seudominio.com` → Frontend (Next.js)

### 3.3 Upload do Backend
1. No painel, vá em **Arquivos** > **Gerenciador de Arquivos**
2. Vá para a pasta do subdomínio da API (ex: `public_html/api`)
3. Faça upload de TODOS os arquivos da pasta `backend`:
   - `server.js`
   - `db.js`
   - `package.json`
   - `package-lock.json`
   - Pasta `uploads/` (se tiver)

4. No terminal do Hostinger (ou via SSH):
```bash
cd public_html/api
npm install
```

5. Crie o arquivo `.env` no servidor:
```env
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxx:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
JWT_SECRET=seu-secret-key-super-seguro-aqui-mudar
PORT=3001
```

6. Inicie o servidor:
```bash
node server.js
```

**OU** configure como aplicação Node.js permanente:
- No painel Hostinger, vá em **Node.js**
- Selecione a versão do Node (16+)
- Entry point: `server.js`
- Clique em **Iniciar**

### 3.4 Upload do Frontend
1. Vá para a pasta do domínio principal (ex: `public_html`)
2. Faça upload da pasta `frontend/.next/` completa
3. Faça upload de:
   - `frontend/package.json`
   - `frontend/package-lock.json`
   - `frontend/next.config.js` (se existir)
   - `frontend/public/` (pasta completa)

4. No terminal:
```bash
cd public_html
npm install
```

5. Crie `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com
```

6. Inicie:
```bash
npm run start
```

### 3.5 Configurar URLs no Frontend
Edite TODOS os arquivos que fazem `fetch("http://localhost:3001/...")` e substitua por:
```javascript
fetch("https://api.seudominio.com/...")
```

Ou use variável de ambiente:
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
fetch(`${API_URL}/produtos`)
```

---

## Parte 4: Testar Tudo

### 4.1 Testar Backend
Acesse: `https://api.seudominio.com/produtos`
- Deve retornar JSON com lista de produtos

### 4.2 Testar Frontend
Acesse: `https://www.seudominio.com`
- Deve carregar a loja
- Produtos devem aparecer
- Carrinho deve funcionar

### 4.3 Testar Admin
Acesse: `https://www.seudominio.com/admin/login`
- Email: `admin@emporio.com.br`
- Senha: (a que você definiu)

---

## Checklist Final

- [ ] Supabase criado e configurado
- [ ] Tabelas criadas no Supabase
- [ ] Backend rodando no Hostinger
- [ ] Frontend rodando no Hostinger
- [ ] Variáveis de ambiente configuradas
- [ ] URLs do localhost substituídas
- [ ] Produtos aparecem na loja
- [ ] Login admin funcionando
- [ ] Checkout funciona
- [ ] Pedidos são salvos

---

## Próximos Passos (Opcional)

1. **SSL/HTTPS**: Hostinger geralmente ativa automaticamente
2. **Domínio customizado**: Configurar em DNS
3. **Email de confirmação**: Integrar SendGrid ou similar
4. **Pagamento real**: Integrar Stripe/PayPal/Mercado Pago
5. **Backup automático**: Configurar no Supabase

---

## Precisa de Ajuda?

Me avise quando:
1. Criar o projeto no Supabase → Te ajudo a rodar o script SQL
2. Subir os arquivos → Te ajudo a configurar as variáveis
3. Testar → Te ajudo a debugar erros

**Boa sorte! 🚀**
