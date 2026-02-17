-- ==========================================
-- RESET: ÚNICO ADMIN - Empório Bothânico
-- Executar no Supabase SQL Editor
-- ==========================================
-- DELETA TODOS os usuários e cria APENAS o admin autorizado
-- Login: 5704@emporiobothanico.com.br
-- Senha: 812511
-- ==========================================

-- 1. Deletar permissões primeiro (FK para usuarios) - ignora se tabela não existir
DO $$ BEGIN
  DELETE FROM permissoes;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
-- 2. Deletar TODOS os usuários (inclui admins e funcionários)
DELETE FROM usuarios;

-- 3. Recriar apenas o admin autorizado
INSERT INTO usuarios (email, senha, nome, role)
VALUES (
  '5704@emporiobothanico.com.br',
  '$2b$12$Bjoo1LUYPZ26UcAnowssF.dDHFXWHy/Npo0znsVOFfPOoBjBxU4tq',
  'Administrador',
  'admin'
);
