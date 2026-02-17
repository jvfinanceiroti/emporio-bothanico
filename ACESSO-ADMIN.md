# 🔐 Acesso ao Painel Administrativo

**Guarde este arquivo em local seguro e NÃO compartilhe publicamente.**

---

## Caminho de acesso

```
https://seudominio.com.br/admin
```

ou diretamente na página de login:

```
https://seudominio.com.br/admin/login
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

*Empório Bothânico - Acesso restrito*
