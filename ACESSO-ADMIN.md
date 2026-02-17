# 🔐 Acesso ao Painel Administrativo

**Guarde este arquivo em local seguro e NÃO compartilhe publicamente.**

---

## Credenciais (executar RESET-ADMIN-UNICO.sql no Supabase primeiro)

As credenciais estão definidas no arquivo **RESET-ADMIN-UNICO.sql**.  
**NÃO compartilhe este arquivo ou as credenciais.**

---

## Se o login não funcionar (404 nos chunks, erro no console)

1. **Variáveis na Vercel** (frontend): `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_SITE_URL` devem estar configurados.
2. **Variáveis no Render** (backend): `FRONTEND_URL` ou `CORS_ORIGIN` deve incluir `https://painel.emporiobothanico.com.br`.
3. Após o deploy com a correção de `assetPrefix`, os arquivos JS passam a carregar do domínio principal — faça um novo deploy.
4. **Alternativa**: Acesse por `https://emporiobothanico.com.br/admin` em vez do subdomínio — o login deve funcionar.

---

## Caminho de acesso (único)

```
https://painel.emporiobothanico.com.br
```

ou na página de login:

```
https://painel.emporiobothanico.com.br/login
```

---

## Segurança: /admin no domínio principal

Se alguém acessar `emporiobothanico.com.br/admin`, será **redirecionado** para `painel.emporiobothanico.com.br`.  
O painel **não é servido** no domínio principal — apenas o subdomínio.

---

## O que foi feito para esconder dos buscadores

- **robots.txt**: `/admin` e `/admin/` estão em `Disallow` — Google e outros crawlers não indexam
- **Meta robots**: Páginas em `/admin` têm `noindex, nofollow`
- **Sitemap**: A área admin não aparece no sitemap.xml

---

## Camadas de proteção implementadas

- **Admin único**: Apenas um email autorizado pode acessar o painel
- **Bloqueio por tentativas**: 4 falhas = bloqueio de 30 min (por email e por IP)
- **Rate limit**: 5 tentativas de login por 15 min por IP
- **Whitelist no backend**: Mesmo com conta admin no banco, só o email autorizado entra
- **JWT validado**: Token expira em 6h e é verificado em toda requisição
- **Criação de admins desabilitada**: Impossível criar novos admins via API

---

## Dica de segurança

Para dificultar ainda mais o acesso por terceiros, você pode:

1. **Manter este arquivo apenas local** — remova do repositório antes de fazer push
2. **Usar um subdomínio** — ex.: `painel.seudominio.com.br` (configuração no DNS)
3. **Adicionar autenticação no servidor** — proteção extra via .htaccess ou nginx

---

## Configuração DNS (painel subdomínio)

Para o subdomínio **painel.emporiobothanico.com.br** funcionar:

1. **Vercel**: Em Project Settings → Domains, adicione `painel.emporiobothanico.com.br`
2. **DNS**: Na sua provedora de domínio (Registro.br, Hostinger, etc.), adicione:
   - **Tipo:** CNAME
   - **Nome:** painel (ou painel.emporiobothanico)
   - **Valor:** cname.vercel-dns.com (ou o que a Vercel indicar)

A Vercel mostra o valor exato ao adicionar o domínio. Pode levar alguns minutos para propagar.

---

*Empório Bothânico - Acesso restrito*
