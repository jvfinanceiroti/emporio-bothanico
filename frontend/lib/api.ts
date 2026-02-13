// Configuração central da API
// Usa variável de ambiente em produção, localhost em desenvolvimento
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper para fazer requests
export async function apiRequest(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}
