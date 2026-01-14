# 🎮 Jogo da Forca - Planejamento

## 📋 Objetivo

Desenvolver um Jogo da Forca web interativo com animações e efeitos visuais, utilizando Next.js 16 e PostgreSQL para gerenciar usuários e palavras.

## 🎯 Requisitos Funcionais (RF)

### RF01 - Gerenciamento de Usuários
- Cadastro e autenticação de usuários
- Persistência de dados no PostgreSQL

### RF02 - Gerenciamento de Palavras
- CRUD de palavras para o jogo
- Sorteio aleatório de palavras
- Categorização de palavras (opcional)

### RF03 - Mecânica do Jogo
- Seleção aleatória de palavra do banco
- Tentativas de letras (máximo 6 erros)
- Exibição de letras acertadas
- Detecção de vitória/derrota
- Reinício do jogo

### RF04 - Interface e Animações
- Animações suaves nas transições
- Efeitos visuais ao acertar/errar letras
- Animação da forca sendo desenhada
- Feedback visual imediato
- Design moderno e responsivo

## 🛡️ Requisitos Não Funcionais (RNF)

### RNF01 - Performance
- Carregamento inicial < 2s
- Animações a 60fps
- Otimização de imagens/assets

### RNF02 - Usabilidade
- Interface intuitiva
- Feedback claro de ações
- Responsivo (mobile/desktop)

### RNF03 - Segurança
- Validação de dados (Zod)
- Sanitização de inputs
- Proteção contra SQL injection (usando parâmetros)

### RNF04 - Arquitetura
- Clean Architecture (multicamadas)
- Separação de responsabilidades
- Código testável e manutenível

## 🏗️ Arquitetura

### Estrutura de Camadas

```
📦 forca_web
├── app/
│   ├── api/                    → Presentation Layer (API Routes)
│   │   ├── auth/
│   │   ├── game/
│   │   ├── words/
│   │   └── users/
│   ├── (routes)/               → Frontend Routes
│   │   ├── page.tsx            → Home/Jogo
│   │   ├── login/
│   │   └── admin/
│   └── layout.tsx
├── lib/
│   ├── services/               → Business Logic Layer
│   │   ├── GameService.ts
│   │   ├── UserService.ts
│   │   └── WordService.ts
│   ├── repositories/           → Data Access Layer
│   │   ├── BaseRepository.ts
│   │   ├── UserRepository.ts
│   │   └── WordRepository.ts
│   ├── types/                  → Domain Layer
│   │   ├── user.ts
│   │   ├── word.ts
│   │   └── game.ts
│   ├── validations/            → Validation Schemas
│   │   ├── user.schema.ts
│   │   └── word.schema.ts
│   └── db/                     → Database Connection
│       └── connection.ts
├── components/
│   ├── game/
│   │   ├── Hangman.tsx         → Componente da forca animado
│   │   ├── WordDisplay.tsx     → Exibição da palavra
│   │   ├── Keyboard.tsx        → Teclado virtual
│   │   └── GameStatus.tsx      → Status do jogo
│   └── ui/                     → Componentes shadcn/ui
└── public/
    └── assets/
```

### Fluxo de Dados

```
Frontend → API Route → Service → Repository → PostgreSQL
                ↓
         Validação (Zod)
```

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 16.x** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Framer Motion** - Animações
- **TanStack Query** - Gerenciamento de estado servidor

### Backend
- **Next.js API Routes** - API REST
- **PostgreSQL 16** - Banco de dados
- **@vercel/postgres** ou **pg** - Driver PostgreSQL
- **Zod** - Validação de schemas
- **bcryptjs** - Hash de senhas
- **next-auth** ou **jose** - Autenticação

### Qualidade
- **Vitest** - Testes unitários
- **Playwright** - Testes E2E
- **ESLint** - Linter
- **Prettier** - Formatação

### DevOps
- **Docker** - Containerização (opcional)
- **Vercel/Railway** - Deploy

## 📊 Modelo de Dados

### Tabela: users
```sql
- id: UUID (PK)
- email: VARCHAR(255) (UNIQUE)
- name: VARCHAR(255)
- password_hash: VARCHAR(255)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Tabela: words
```sql
- id: UUID (PK)
- word: VARCHAR(100) (UNIQUE, NOT NULL)
- category: VARCHAR(50) (opcional)
- difficulty: VARCHAR(20) (facil, medio, dificil)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Tabela: game_sessions (opcional - para histórico)
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- word_id: UUID (FK)
- status: VARCHAR(20) (won, lost, in_progress)
- attempts: INTEGER
- created_at: TIMESTAMP
```

## 🎨 Design e Animações

### Animações Principais
1. **Forca**: Desenho progressivo conforme erros
2. **Letras**: Fade-in ao acertar, shake ao errar
3. **Teclado**: Desabilitação animada de letras
4. **Transições**: Fade entre estados (menu → jogo → resultado)
5. **Feedback**: Toast notifications para ações

### Paleta de Cores
- Primária: Azul (#3B82F6)
- Sucesso: Verde (#10B981)
- Erro: Vermelho (#EF4444)
- Aviso: Amarelo (#F59E0B)
- Fundo: Gradiente suave

## 📅 Fases de Desenvolvimento

### Fase 1: Setup e Infraestrutura (Dia 1)
- [x] Estrutura do projeto Next.js
- [ ] Configuração PostgreSQL
- [ ] Schema do banco de dados
- [ ] BaseRepository e conexão

### Fase 2: Backend - Camadas de Dados (Dia 1-2)
- [ ] Repositories (User, Word)
- [ ] Services (User, Word, Game)
- [ ] API Routes
- [ ] Validações Zod

### Fase 3: Frontend - Componentes Base (Dia 2-3)
- [ ] Componente Hangman (forca animada)
- [ ] Componente WordDisplay
- [ ] Componente Keyboard
- [ ] Layout e estilização

### Fase 4: Lógica do Jogo (Dia 3)
- [ ] Estado do jogo (React Context/State)
- [ ] Integração com API
- [ ] Fluxo completo (início → jogo → fim)

### Fase 5: Animações e Polimento (Dia 3-4)
- [ ] Animações Framer Motion
- [ ] Efeitos visuais
- [ ] Responsividade
- [ ] Testes básicos

### Fase 6: Autenticação e Admin (Dia 4)
- [ ] Sistema de login
- [ ] Painel admin (CRUD palavras)
- [ ] Proteção de rotas

## ⚠️ Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Performance das animações | Médio | Usar Framer Motion (otimizado) |
| Complexidade do estado | Médio | Context API bem estruturado |
| Integração PostgreSQL | Baixo | Usar driver testado (@vercel/postgres) |
| Responsividade | Baixo | Mobile-first com Tailwind |

## ✅ Critérios de Sucesso

- [ ] Jogo funcional com todas as mecânicas
- [ ] Animações suaves (60fps)
- [ ] Integração completa com PostgreSQL
- [ ] Código organizado em camadas
- [ ] Interface responsiva e moderna
- [ ] Documentação completa
- [ ] Testes básicos implementados

## 📝 Notas

- Priorizar experiência do usuário (animações)
- Manter código limpo e documentado
- Seguir arquitetura multicamadas rigorosamente
- PostgreSQL usado apenas para dados, não para lógica
