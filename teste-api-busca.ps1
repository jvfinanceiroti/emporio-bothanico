# Script para testar busca de pedidos na API
# Execute: .\teste-api-busca.ps1

Write-Host "🔍 TESTE DA API - BUSCA DE PEDIDOS" -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

$apiUrl = "https://emporio-bothanico.onrender.com"
$email = "kleb@gmail.com"

Write-Host "🌐 URL da API: $apiUrl" -ForegroundColor Yellow
Write-Host "📧 Email de teste: $email`n" -ForegroundColor Yellow

$url = "$apiUrl/pedidos/buscar?tipo=email&valor=$([uri]::EscapeDataString($email))"

Write-Host "📡 Fazendo requisição GET para:" -ForegroundColor Green
Write-Host "$url`n" -ForegroundColor White

try {
    $response = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing -ErrorAction Stop
    
    Write-Host "✅ STATUS: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "`n📦 RESPOSTA:" -ForegroundColor Cyan
    
    $json = $response.Content | ConvertFrom-Json
    $json | ConvertTo-Json -Depth 5 | Write-Host
    
    Write-Host "`n✅ Total de pedidos encontrados: $($json.Count)" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ ERRO!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Mensagem: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "`nDetalhes do erro:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor White
    }
}

Write-Host "`n===================================`n" -ForegroundColor Cyan
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
