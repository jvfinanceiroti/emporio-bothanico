# 🔐 Acesso ao Painel Administrativo

**Guarde este arquivo em local seguro e NÃO compartilhe publicamente.**

---

## Caminho de acesso (recomendado)

```
https://painel.emporiobothanico.com.br
```

ou diretamente na página de login:

```
https://painel.emporiobothanico.com.br/login
```

---

## Acesso alternativo (domínio principal)

```
https://emporiobothanico.com.br/admin
```

---

## O que foi feito para esconder dos buscadores

- **robots.txt**: `/admin` e `/admin/` estão em `Disallow` — Google e outros crawlers não indexam
- **Meta robots**: Páginas em `/admin` têm `noindex, nofollow`
- **Sitemap**: A área admin não aparece no sitemap.xml

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
