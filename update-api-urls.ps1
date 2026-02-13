# Script Simples - Substituição Global
$files = Get-ChildItem -Path "C:\Users\joaov\loja\frontend\app" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'http://localhost:3001') {
        # Adicionar import se não existir
        if ($content -match '"use client"' -and $content -notmatch '@/lib/api') {
            $content = $content -replace '("use client";)', "`$1`nimport { API_URL } from '@/lib/api';"
        }
        # Substituir URLs
        $content = $content -replace 'http://localhost:3001', '${API_URL}'
        $content = $content -replace '"\$\{API_URL\}', '`${API_URL}'
        $content = $content -replace "'`$\{API_URL\}", '`${API_URL}'
        
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "Atualizado: $($file.Name)"
    }
}
Write-Host "Concluído!"
