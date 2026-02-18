# Guia de Verificação de Deploy - Empório Bothânico

## Se as alterações não aparecerem no site

### 1. Verificar configuração da Vercel

Acesse o Dashboard da Vercel e seu projeto:

| Configuração | Valor esperado |
|--------------|----------------|
| **Root Directory** | `frontend` (obrigatório) |
| **Production Branch** | `main` |

Se Root Directory estiver vazio, o build falhará.

### 2. Limpar cache e fazer redeploy

Deployments > Redeploy > marque "Clear build cache"

### 3. Variáveis de ambiente

- NEXT_PUBLIC_API_URL = https://api.emporiobothanico.com.br
- NEXT_PUBLIC_SITE_URL = https://www.emporiobothanico.com.br

### 4. Cache do navegador

Ctrl+Shift+R ou modo anônimo.

### 5. Confirmar commit

O deploy deve usar o commit 35d1c2d (Melhorias: SSR home, fundo verde, PAC/SEDEX...).
