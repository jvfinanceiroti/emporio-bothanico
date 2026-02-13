# ==========================================
# Script Automático: Atualizar URLs da API
# Substitui localhost por variável de ambiente
# ==========================================

Write-Host "🚀 Iniciando atualização automática das URLs da API..." -ForegroundColor Cyan
Write-Host ""

$frontendPath = "C:\Users\joaov\loja\frontend"
$arquivos = @(
    "$frontendPath\app\produto\[id]\page.tsx",
    "$frontendPath\app\carrinho\page.tsx",
    "$frontendPath\app\checkout\page.tsx",
    "$frontendPath\app\sucesso\page.tsx",
    "$frontendPath\app\pagamento\page.tsx",
    "$frontendPath\app\admin\login\page.tsx",
    "$frontendPath\app\admin\produtos\page.tsx",
    "$frontendPath\app\admin\pedidos\page.tsx",
    "$frontendPath\app\admin\usuarios\page.tsx",
    "$frontendPath\app\admin\dashboard\page.tsx"
)

$contador = 0
$erros = 0

foreach ($arquivo in $arquivos) {
    if (Test-Path $arquivo) {
        Write-Host "📝 Processando: $(Split-Path $arquivo -Leaf)" -ForegroundColor Yellow
        
        try {
            # Ler conteúdo
            $conteudo = Get-Content $arquivo -Raw -Encoding UTF8
            
            # Verificar se precisa atualizar imports
            $precisaImport = $conteudo -match '"use client"' -and $conteudo -notmatch 'import.*API_URL.*from.*@/lib/api'
            
            if ($precisaImport) {
                # Adicionar import após "use client"
                $conteudo = $conteudo -replace '("use client";[\r\n]+)', "`$1`nimport { API_URL } from `"@/lib/api`";`n"
                Write-Host "  ✓ Import adicionado" -ForegroundColor Green
            }
            
            # Substituir todas as ocorrências de localhost:3001
            $antes = ($conteudo -split 'http://localhost:3001').Count - 1
            $conteudo = $conteudo -replace 'http://localhost:3001', '${API_URL}'
            $conteudo = $conteudo -replace '"http://localhost:3001"', '`${API_URL}`'
            $conteudo = $conteudo -replace "'http://localhost:3001'", '`${API_URL}`'
            
            # Corrigir aspas nas interpolações
            $conteudo = $conteudo -replace 'fetch\("(\$\{API_URL\}[^"]*?)"\)', 'fetch(`$1`)'
            $conteudo = $conteudo -replace 'fetch\(''(\$\{API_URL\}[^'']*?)''\)', 'fetch(`$1`)'
            
            if ($antes -gt 0) {
                Write-Host "  ✓ $antes URL(s) substituída(s)" -ForegroundColor Green
                $contador++
            } else {
                Write-Host "  ⚠ Nenhuma URL encontrada (já atualizado?)" -ForegroundColor Gray
            }
            
            # Salvar arquivo
            Set-Content $arquivo -Value $conteudo -Encoding UTF8 -NoNewline
            
        } catch {
            Write-Host "  ✗ ERRO: $_" -ForegroundColor Red
            $erros++
        }
        
    } else {
        Write-Host "⚠ Arquivo não encontrado: $(Split-Path $arquivo -Leaf)" -ForegroundColor Red
        $erros++
    }
    Write-Host ""
}

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "✅ CONCLUÍDO!" -ForegroundColor Green
Write-Host "   Arquivos atualizados: $contador" -ForegroundColor White
if ($erros -gt 0) {
    Write-Host "   Erros: $erros" -ForegroundColor Red
}
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Testar local: npm run dev" -ForegroundColor White
Write-Host "   2. Build produção: npm run build" -ForegroundColor White
Write-Host "   3. Subir para Hostinger" -ForegroundColor White
Write-Host ""
