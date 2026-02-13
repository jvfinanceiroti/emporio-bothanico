// ============================================
// UTILITÁRIOS DE VALIDAÇÃO DE CARTÃO
// ============================================

/**
 * Algoritmo de Luhn para validar número de cartão
 */
export function validarNumeroCartao(numero: string): boolean {
  const limpo = numero.replace(/\D/g, "");
  
  if (limpo.length < 13 || limpo.length > 19) {
    return false;
  }
  
  let soma = 0;
  let alternar = false;
  
  for (let i = limpo.length - 1; i >= 0; i--) {
    let digito = parseInt(limpo.charAt(i), 10);
    
    if (alternar) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }
    
    soma += digito;
    alternar = !alternar;
  }
  
  return soma % 10 === 0;
}

/**
 * Detectar bandeira do cartão pelo BIN
 */
export function detectarBandeira(numero: string): string | null {
  const limpo = numero.replace(/\D/g, "");
  
  // Visa: começa com 4
  if (/^4/.test(limpo)) {
    return "Visa";
  }
  
  // Mastercard: 51-55 ou 2221-2720
  if (/^5[1-5]/.test(limpo) || /^2(22[1-9]|2[3-9]|[3-6]|7[0-1]|720)/.test(limpo)) {
    return "Mastercard";
  }
  
  // Amex: 34 ou 37
  if (/^3[47]/.test(limpo)) {
    return "American Express";
  }
  
  // Elo
  if (/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(limpo)) {
    return "Elo";
  }
  
  // Hipercard
  if (/^(606282|637095|637568|637599|637609|637612)/.test(limpo)) {
    return "Hipercard";
  }
  
  // Diners: 300-305, 36, 38
  if (/^3(0[0-5]|[68])/.test(limpo)) {
    return "Diners Club";
  }
  
  // Discover: 6011, 622126-622925, 644-649, 65
  if (/^(6011|65|64[4-9]|622(1(2[6-9]|[3-9])|[2-8]|9([01]|2[0-5])))/.test(limpo)) {
    return "Discover";
  }
  
  return null;
}

/**
 * Validar data de validade (MM/AA)
 */
export function validarValidade(validade: string): { valido: boolean; mensagem?: string } {
  const limpo = validade.replace(/\D/g, "");
  
  if (limpo.length !== 4) {
    return { valido: false, mensagem: "Formato inválido" };
  }
  
  const mes = parseInt(limpo.substring(0, 2), 10);
  const ano = parseInt("20" + limpo.substring(2, 4), 10);
  
  if (mes < 1 || mes > 12) {
    return { valido: false, mensagem: "Mês inválido" };
  }
  
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  
  if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
    return { valido: false, mensagem: "Cartão expirado" };
  }
  
  return { valido: true };
}

/**
 * Formatar número do cartão com espaços
 */
export function formatarNumeroCartao(valor: string): string {
  const limpo = valor.replace(/\D/g, "");
  const grupos = limpo.match(/.{1,4}/g) || [];
  return grupos.join(" ").trim();
}

/**
 * Formatar validade (MM/AA)
 */
export function formatarValidade(valor: string): string {
  const limpo = valor.replace(/\D/g, "");
  if (limpo.length >= 2) {
    return limpo.substring(0, 2) + "/" + limpo.substring(2, 4);
  }
  return limpo;
}
