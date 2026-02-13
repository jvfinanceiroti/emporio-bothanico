// ===================================
// VERIFICAÇÃO DE VERSÃO DO BACKEND
// ===================================
// Este arquivo serve para confirmar qual commit está rodando no Render

module.exports = {
  version: "467d423-cpf-nos-pedidos",
  date: "2026-02-13",
  features: [
    "✅ Endpoint /pedidos/buscar PÚBLICO (sem verificarToken)",
    "✅ CPF do cliente nos pedidos",
    "✅ Colunas codigo_rastreio e updated_at",
    "✅ Logs de debug detalhados"
  ],
  endpoint_publico_buscar_pedidos: true
};

console.log("🚀 BACKEND VERSÃO:", module.exports.version);
console.log("📅 DATA:", module.exports.date);
console.log("🔓 Endpoint /pedidos/buscar é PÚBLICO:", module.exports.endpoint_publico_buscar_pedidos);
