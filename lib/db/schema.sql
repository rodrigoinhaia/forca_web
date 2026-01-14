-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  total_score INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de palavras
CREATE TABLE IF NOT EXISTS words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50),
  difficulty VARCHAR(20) DEFAULT 'medio' CHECK (difficulty IN ('facil', 'medio', 'dificil')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de sessões de jogo (para histórico e ranking)
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  word_id UUID REFERENCES words(id) ON DELETE CASCADE,
  word VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('won', 'lost', 'in_progress')),
  attempts INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  difficulty VARCHAR(20) DEFAULT 'medio',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de configurações do jogo
CREATE TABLE IF NOT EXISTS game_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir mensagem padrão de vitória
INSERT INTO game_settings (key, value, description) VALUES
  ('victory_message', '🎉 Você Ganhou!', 'Mensagem exibida quando o usuário acerta a palavra')
ON CONFLICT (key) DO NOTHING;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_total_score ON users(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_words_word ON words(word);
CREATE INDEX IF NOT EXISTS idx_words_difficulty ON words(difficulty);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_word_id ON game_sessions(word_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_words_updated_at BEFORE UPDATE ON words
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário administrador padrão
-- Email: admin@forca.com
-- Senha: admin123
-- ⚠️ IMPORTANTE: Altere a senha após o primeiro login!
-- Nota: O hash será gerado pelo script create-default-admin.ts
-- Este INSERT não funcionará diretamente no SQL, use o script

-- Inserir algumas palavras iniciais
INSERT INTO words (word, category, difficulty) VALUES
  ('COMPUTADOR', 'Tecnologia', 'medio'),
  ('ELEFANTE', 'Animais', 'facil'),
  ('PROGRAMACAO', 'Tecnologia', 'dificil'),
  ('BANANA', 'Frutas', 'facil'),
  ('JAVASCRIPT', 'Tecnologia', 'medio'),
  ('GIRAFA', 'Animais', 'facil'),
  ('ARQUITETURA', 'Geral', 'dificil'),
  ('LARANJA', 'Frutas', 'facil'),
  ('REACT', 'Tecnologia', 'medio'),
  ('HIPOPOTAMO', 'Animais', 'medio')
ON CONFLICT (word) DO NOTHING;
