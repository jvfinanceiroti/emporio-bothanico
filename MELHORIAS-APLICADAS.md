# Melhorias Aplicadas - Empório Bothânico

## Segurança

### Backend (Render)

1. **Helmet** – Headers HTTP de segurança (XSS, HSTS, no-sniff, etc.)
2. **Rate limiting**
   - Geral: 100 req/15min por IP
   - Login: 10 tentativas/15min (brute force)
   - Endpoints sensíveis: 20 req/min (pedidos, pagamento, upload)
3. **CORS restrito** – Apenas `localhost`, `FRONTEND_URL`, `CORS_ORIGIN` e `*.vercel.app`
4. **Proteção de login**
   - Bloqueio após 5 tentativas falhas (15 min)
   - Validação de email e senha
   - `JWT_SECRET` obrigatório em produção
5. **JWT** – Expiração padrão 8h (via `JWT_EXPIRES_IN`)
6. **Cloudinary** – Uso apenas via variáveis de ambiente (sem credenciais fixas)
7. **Validação em `/api/buscar-pedido-simples`**
   - Email válido
   - CPF com 11+ dígitos
   - Limite de 50 pedidos por busca

### Frontend (Vercel)

1. **Headers de segurança** em `next.config.ts`
   - X-Frame-Options, X-Content-Type-Options
   - Referrer-Policy, X-DNS-Prefetch-Control
2. **Login admin**
   - Remoção de credenciais padrão na tela
   - Placeholder genérico no campo de email
   - `autocomplete` adequado
3. **API**
   - Função `apiRequestAuth` com logout automático em 401
   - Tratamento seguro de token

### Variáveis de ambiente para Render

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `FRONTEND_URL` | Sim | URL do frontend na Vercel (ex: https://seu-app.vercel.app) |
| `JWT_SECRET` | Sim | Chave segura (ex.: 32+ caracteres aleatórios) |
| `CORS_ORIGIN` | Opcional | Domínio customizado se diferente de Vercel |
| `CLOUDINARY_*` | Opcional | Só se usar Cloudinary para upload |

## Design system (CSS)

1. **Paleta**
   - Accent: `#2d5a4a`
   - Superfície: `#faf9f7`
   - Bordas, sombras e feedback unificados
2. **Componentes**
   - `.store-card`, `.btn-primary`, `.btn-secondary`
   - `.input-store`, `.store-link`
3. **Layout institucional**
   - Fundo em gradiente leve
   - Cards com borda e sombra suaves
   - Links internos usando `Link` do Next.js
4. **Admin**
   - Tema `.admin-theme` com azul para o painel

## Páginas ajustadas

- **Home** – uso de variáveis de design
- **Produtos** – mantido
- **Carrinho** – mantido
- **LayoutInstitucional** – novo layout
- **Ajuda, Contato, Sobre** – design system + `Link`
- **Entregas, Trocas** – links internos com `Link`
- **Privacidade** – mantido
- **Admin login** – novo layout e segurança

## Deploy

- **Frontend (Vercel)** – `NEXT_PUBLIC_API_URL` com a URL do backend no Render
- **Backend (Render)** – `FRONTEND_URL` com a URL do app na Vercel

Depois do deploy, rodar `npm install` no backend para instalar `helmet` e `express-rate-limit`.
