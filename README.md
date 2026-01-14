# 🎮 Jogo da Forca

Jogo da Forca interativo desenvolvido com Next.js 16, TypeScript, PostgreSQL e animações suaves usando Framer Motion.

## 🚀 Características

- ✨ Animações suaves e efeitos visuais
- 🎯 Interface moderna e responsiva
- 🗄️ Integração com PostgreSQL
- 🏗️ Arquitetura multicamadas (Clean Architecture)
- 🔒 Validação de dados com Zod
- 🎨 Design moderno com Tailwind CSS

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 16+
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd forca_web
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas credenciais:

**Para PostgreSQL Local:**
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/forca_db
```

**Para Vercel Postgres:**
```env
POSTGRES_URL=postgres://default:senha@host.vercel-storage.com:5432/verceldb
```

> 💡 O sistema detecta automaticamente qual variável usar. Para desenvolvimento local, use `DATABASE_URL`. Para Vercel, use `POSTGRES_URL`.

4. Inicialize o banco de dados:
```bash
npm run db:init
```

5. Crie um usuário administrador:
```bash
npm run db:create-admin
```

6. Execute o projeto:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
forca_web/
├── app/
│   ├── api/              # API Routes
│   ├── page.tsx          # Página principal do jogo
│   └── layout.tsx
├── components/
│   └── game/             # Componentes do jogo
├── lib/
│   ├── db/               # Conexão com banco
│   ├── repositories/     # Camada de acesso a dados
│   ├── services/         # Camada de lógica de negócio
│   ├── types/            # Tipos TypeScript
│   └── validations/      # Schemas Zod
└── public/
```

## 🎮 Como Jogar

1. O jogo inicia automaticamente com uma palavra aleatória
2. Clique nas letras do teclado para fazer tentativas
3. Você tem 6 tentativas erradas antes de perder
4. Complete a palavra antes de esgotar as tentativas para ganhar!

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com separação em camadas:

- **API Routes** (`app/api/`): Validação de entrada/saída
- **Services** (`lib/services/`): Lógica de negócio
- **Repositories** (`lib/repositories/`): Acesso a dados
- **Types** (`lib/types/`): Entidades do domínio

## 📝 API Endpoints

### Jogo
- `POST /api/game/start` - Iniciar novo jogo
- `POST /api/game/guess` - Fazer tentativa de letra

### Palavras
- `GET /api/words` - Listar palavras
- `POST /api/words` - Criar palavra
- `GET /api/words/random` - Palavra aleatória
- `GET /api/words/[id]` - Buscar palavra
- `PATCH /api/words/[id]` - Atualizar palavra
- `DELETE /api/words/[id]` - Deletar palavra

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login

### Ranking
- `GET /api/ranking` - Listar ranking geral
- `GET /api/ranking/me` - Ver posição do usuário autenticado

## 🧪 Scripts

- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Iniciar produção
- `npm run lint` - Verificar código
- `npm run type-check` - Verificar tipos
- `npm test` - Executar testes

## 📄 Licença

MIT
