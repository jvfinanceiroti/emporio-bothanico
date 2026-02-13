const bcrypt = require('bcrypt');

async function gerarSenhaAdmin() {
  const senha = 'admin123'; // Você pode mudar aqui
  const hash = await bcrypt.hash(senha, 10);
  
  console.log('\n=== CREDENCIAIS DO ADMIN ===');
  console.log('Email: admin@emporio.com.br');
  console.log('Senha:', senha);
  console.log('\n=== SQL PARA INSERIR NO SUPABASE ===\n');
  console.log(`INSERT INTO usuarios (email, senha, nome, role)`);
  console.log(`VALUES ('admin@emporio.com.br', '${hash}', 'Administrador', 'admin');`);
  console.log('\n');
}

gerarSenhaAdmin();
