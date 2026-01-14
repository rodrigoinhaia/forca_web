# 🚀 Guia de Setup - Jogo da Forca

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 16+ instalado e rodando
- npm ou yarn

## Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

#### Opção A: PostgreSQL Local

1. Crie um banco de dados:
```bash
createdb forca_db
```

2. Inicialize o banco com o script:
```bash
npm run db:init
```

Este script cria todas as tabelas, índices e insere palavras iniciais.

#### Opção B: Vercel Postgres (Cloud)

1. Crie um projeto no Vercel
2. Adicione o Postgres addon
3. Copie a connection string
4. Execute: `npm run db:init`

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

**Para PostgreSQL Local:**
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/forca_db
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Para Vercel Postgres (Cloud):**
```env
POSTGRES_URL=postgres://default:senha@host.vercel-storage.com:5432/verceldb
# ou
POSTGRES_PRISMA_URL=postgres://default:senha@host.vercel-storage.com:5432/verceldb
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Formato da DATABASE_URL:**
```
postgresql://[usuario]:[senha]@[host]:[porta]/[nome_do_banco]
```

Exemplo:
```
postgresql://postgres:minhasenha123@localhost:5432/forca_db
```

### 4. Criar Usuário Administrador

```bash
npm run db:create-admin
```

O script irá solicitar email, nome e senha. Este usuário terá permissão para gerenciar palavras.

### 5. Executar o Projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Verificação

1. ✅ O jogo deve iniciar automaticamente
2. ✅ Uma palavra aleatória deve aparecer
3. ✅ O teclado deve estar funcional
4. ✅ As animações devem estar suaves
5. ✅ Usuário admin criado com sucesso

## Sistema de Permissões

### Administrador (admin)
- ✅ Gerenciar palavras (criar, editar, deletar)
- ✅ Ver ranking completo
- ✅ Acessar todas as funcionalidades

### Usuário (user)
- ✅ Jogar o jogo
- ✅ Ver ranking geral
- ✅ Ver sua própria pontuação
- ❌ Gerenciar palavras (apenas admin)

## Troubleshooting

### Erro de Conexão com Banco

- Verifique se o PostgreSQL está rodando
- Confirme a string de conexão no `.env`
- Teste a conexão: `psql $DATABASE_URL`

### Erro "Nenhuma palavra disponível"

- Execute o schema.sql para inserir palavras iniciais
- Ou adicione palavras via API: `POST /api/words`

### Erro de Build

- Limpe o cache: `rm -rf .next node_modules`
- Reinstale: `npm install`
- Rebuild: `npm run build`

## Próximos Passos

- Adicionar mais palavras ao banco
- Personalizar animações
- Adicionar autenticação (opcional)
- Criar painel admin (opcional)
