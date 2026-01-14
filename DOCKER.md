# Docker Setup para Easypanel

Este projeto está configurado para ser hospedado no Easypanel usando Docker.

## Arquivos Docker

- `Dockerfile` - Configuração multi-stage para build otimizado
- `.dockerignore` - Arquivos excluídos do build
- `docker-compose.yml` - Configuração para desenvolvimento local (opcional)

## Configuração no Easypanel

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Easypanel:

```env
# Banco de Dados (escolha uma opção)
DATABASE_URL=postgresql://usuario:senha@host:5432/forca_db
# OU
POSTGRES_URL=postgres://usuario:senha@host:5432/forca_db
# OU
POSTGRES_PRISMA_URL=postgres://usuario:senha@host:5432/forca_db

# JWT Secret (obrigatório)
JWT_SECRET=seu-secret-key-super-seguro-aqui

# Node Environment
NODE_ENV=production
```

### 2. Porta

- Porta interna: `3000`
- Easypanel configurará automaticamente a porta externa

### 3. Health Check

O aplicativo possui um endpoint de health check em `/api/health` que verifica:
- Status da aplicação
- Conexão com o banco de dados

### 4. Inicialização do Banco de Dados

Após o primeiro deploy, você precisará inicializar o banco de dados. Você pode fazer isso de duas formas:

#### Opção 1: Via Terminal do Easypanel

1. Acesse o terminal do container no Easypanel
2. Execute:
```bash
pnpm run db:init
```

#### Opção 2: Adicionar ao Dockerfile (se necessário)

Se quiser que o banco seja inicializado automaticamente, você pode adicionar um script de inicialização.

## Build Local (Teste)

Para testar o build localmente:

```bash
# Build da imagem
docker build -t forca-web .

# Executar container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://usuario:senha@host:5432/forca_db" \
  -e JWT_SECRET="seu-secret-key" \
  forca-web
```

## Docker Compose (Desenvolvimento)

Para desenvolvimento local com Docker Compose:

```bash
# Criar arquivo .env com as variáveis
cp env.example .env
# Editar .env com suas configurações

# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## Otimizações

O Dockerfile usa multi-stage build para:
- Reduzir o tamanho da imagem final
- Separar dependências de desenvolvimento
- Usar output standalone do Next.js para melhor performance

## Troubleshooting

### Erro de conexão com banco de dados

1. Verifique se a variável `DATABASE_URL` está configurada corretamente
2. Verifique se o banco de dados está acessível do container
3. Teste a conexão usando o endpoint `/api/health`

### Erro de build

1. Verifique se todas as dependências estão no `package.json`
2. Verifique se o `next.config.ts` tem `output: "standalone"`
3. Verifique os logs do build no Easypanel

### Porta não exposta

1. Verifique se a porta 3000 está configurada no Easypanel
2. Verifique se o `EXPOSE 3000` está no Dockerfile

## Notas

- O aplicativo roda como usuário `nextjs` (não root) por segurança
- O build usa cache de layers para otimização
- O output standalone do Next.js reduz significativamente o tamanho da imagem
