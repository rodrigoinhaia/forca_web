# 🗄️ Setup do Banco de Dados

## Passo a Passo Completo

### 1. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/forca_db
```

### 2. Inicializar o Banco de Dados

Execute o script de inicialização:

```bash
npm run db:init
```

Este script irá:
- ✅ Criar todas as tabelas (users, words, game_sessions)
- ✅ Configurar índices e triggers
- ✅ Inserir palavras iniciais

### 3. Criar Usuário Administrador

Você tem duas opções:

#### Opção A: Admin Padrão (Recomendado para desenvolvimento)

```bash
npm run db:create-default-admin
```

Isso cria um admin com credenciais padrão:
- **Email:** `admin@forca.com`
- **Senha:** `admin123`

#### Opção B: Admin Personalizado

```bash
npm run db:create-admin
```

O script irá solicitar:
- Email do administrador
- Nome do administrador
- Senha (mínimo 6 caracteres)

**Exemplo:**
```
Email do administrador: admin@forca.com
Nome do administrador: Administrador
Senha: admin123
```

⚠️ **IMPORTANTE:** Altere a senha padrão após o primeiro login em produção!

### 4. Verificar Conexão

Teste se tudo está funcionando:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) e verifique se o jogo carrega.

## Scripts Disponíveis

| Script | Comando | Descrição |
|--------|--------|-----------|
| Inicializar DB | `npm run db:init` | Cria tabelas e estrutura |
| Criar Admin Padrão | `npm run db:create-default-admin` | Cria admin com credenciais padrão (admin@forca.com / admin123) |
| Criar Admin Personalizado | `npm run db:create-admin` | Cria usuário administrador (interativo) |
| Setup Completo | `npm run db:setup` | Inicializa DB (sem criar admin) |

## Estrutura do Banco

### Tabela: users
- `id` - UUID (chave primária)
- `email` - Email único
- `name` - Nome do usuário
- `password_hash` - Hash da senha
- `role` - 'admin' ou 'user' (padrão: 'user')
- `total_score` - Pontuação total
- `games_won` - Jogos ganhos
- `games_played` - Jogos jogados
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela: words
- `id` - UUID (chave primária)
- `word` - Palavra (única, maiúscula)
- `category` - Categoria (opcional)
- `difficulty` - 'facil', 'medio', 'dificil'
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela: game_sessions
- `id` - UUID (chave primária)
- `user_id` - ID do usuário (FK)
- `word_id` - ID da palavra (FK)
- `word` - Palavra jogada
- `status` - 'won', 'lost', 'in_progress'
- `attempts` - Número de tentativas
- `score` - Pontuação da partida
- `difficulty` - Dificuldade
- `created_at` - Data de criação

## Permissões

### Administrador (admin)
- ✅ Criar, editar e deletar palavras
- ✅ Acessar todas as rotas
- ✅ Ver ranking

### Usuário (user)
- ✅ Jogar
- ✅ Ver ranking
- ✅ Ver sua própria pontuação
- ❌ Gerenciar palavras

## Troubleshooting

### Erro: "Variável de conexão não encontrada"
- Verifique se o arquivo `.env` existe
- Confirme se `DATABASE_URL` está configurada

### Erro: "Connection refused"
- Verifique se o PostgreSQL está rodando
- Confirme se a porta está correta (padrão: 5432)

### Erro: "Database does not exist"
- Crie o banco: `createdb forca_db`
- Ou use um banco existente e atualize `DATABASE_URL`

### Erro ao executar scripts
- Instale dependências: `npm install`
- Certifique-se de ter `tsx` instalado

## Próximos Passos

1. ✅ Banco inicializado
2. ✅ Admin criado
3. ⏳ Testar jogo
4. ⏳ Adicionar mais palavras (via API ou admin panel)
