// Teste da API de busca de pedidos
// Execute: node teste-busca-api.js

const API_URL = "https://emporio-bothanico.onrender.com";
const EMAIL_TESTE = "kleb@gmail.com";

console.log("🔍 TESTE DA API - BUSCA DE PEDIDOS");
console.log("===================================\n");

async function testarBusca() {
  const url = `${API_URL}/pedidos/buscar?tipo=email&valor=${encodeURIComponent(EMAIL_TESTE)}`;
  
  console.log(`📡 Fazendo requisição para:`);
  console.log(`   ${url}\n`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📊 Headers:`, Object.fromEntries(response.headers.entries()));

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    console.log(`\n✅ SUCESSO!`);
    console.log(`📦 Total de pedidos: ${data.length}`);
    console.log(`\n📄 Dados:`);
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error(`\n❌ ERRO:`, error.message);
    console.error(`Stack:`, error.stack);
  }
}

testarBusca();
