/**
 * Configuração de conexão com banco de dados usando variáveis de ambiente
 * 
 * Variáveis suportadas (em ordem de prioridade):
 * 1. POSTGRES_URL (Vercel Postgres)
 * 2. POSTGRES_PRISMA_URL (Vercel Postgres - Prisma)
 * 3. DATABASE_URL (genérico - PostgreSQL padrão)
 */

// Função para obter a string de conexão
function getConnectionString(): string | null {
  return (
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    null
  );
}

// Inicializar conexão de forma lazy (só quando necessário)
let sqlInstance: any;
let poolInstance: any;
let connectionInitialized = false;

function initializeConnection() {
  if (connectionInitialized && sqlInstance) {
    return sqlInstance;
  }

  const connectionString = getConnectionString();

  if (!connectionString) {
    console.error(
      "❌ Variável de conexão com banco de dados não encontrada!\n" +
        "Configure uma das seguintes variáveis no arquivo .env:\n" +
        "  - DATABASE_URL=postgresql://usuario:senha@localhost:5432/forca_db\n" +
        "  - POSTGRES_URL=postgres://... (para Vercel Postgres)\n" +
        "  - POSTGRES_PRISMA_URL=postgres://... (para Vercel Postgres com Prisma)"
    );
    throw new Error(
      "Nenhuma variável de conexão configurada. Configure DATABASE_URL no .env"
    );
  }

  if (process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL) {
    // Usar @vercel/postgres para Vercel Postgres
    try {
      const vercelPostgres = require("@vercel/postgres");
      sqlInstance = vercelPostgres.sql;
      console.log("✅ Usando @vercel/postgres (Vercel Postgres)");
    } catch (error) {
      console.error("❌ Erro ao carregar @vercel/postgres:", error);
      throw new Error("Falha ao inicializar conexão com Vercel Postgres");
    }
  } else {
    // Usar pg nativo para desenvolvimento local
    try {
      const { Pool } = require("pg");
      poolInstance = new Pool({
        connectionString,
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
      });

      // Criar wrapper sql compatível com @vercel/postgres
      sqlInstance = (strings: TemplateStringsArray, ...values: any[]) => {
        let query = "";
        const params: any[] = [];
        let paramIndex = 1;

        for (let i = 0; i < strings.length; i++) {
          query += strings[i];
          if (i < values.length) {
            query += `$${paramIndex++}`;
            params.push(values[i]);
          }
        }

        return poolInstance.query(query, params);
      };

      // Adicionar método unsafe para compatibilidade
      sqlInstance.unsafe = (query: string, params?: any[]) => {
        return poolInstance.query(query, params || []);
      };

      console.log("✅ Usando pg nativo (PostgreSQL local)");
    } catch (error) {
      console.error("❌ Erro ao carregar pg:", error);
      throw new Error("Falha ao inicializar conexão com PostgreSQL");
    }
  }

  connectionInitialized = true;
  return sqlInstance;
}

// Criar função sql como template literal tag
// Esta função será chamada quando usamos sql`SELECT ...`
function sqlTagFunction(strings: TemplateStringsArray, ...values: any[]) {
  const sqlInstance = initializeConnection();
  
  // Se for @vercel/postgres, sqlInstance já é uma tag function
  if (process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL) {
    return sqlInstance(strings, ...values);
  }
  
  // Se for pg nativo, sqlInstance é nossa função wrapper
  if (typeof sqlInstance === "function") {
    return sqlInstance(strings, ...values);
  }
  
  throw new Error("SQL instance is not a function");
}

// Adicionar método unsafe
sqlTagFunction.unsafe = (query: string, params?: any[]) => {
  const sqlInstance = initializeConnection();
  
  // Se for @vercel/postgres e tiver unsafe
  if (sqlInstance && typeof sqlInstance.unsafe === "function") {
    return sqlInstance.unsafe(query, params);
  }
  
  // Se for pg nativo, usar pool diretamente
  if (poolInstance) {
    return poolInstance.query(query, params || []);
  }
  
  throw new Error("Connection not initialized");
};

const sql = sqlTagFunction;

export { sql };

/**
 * Testa a conexão com o banco de dados
 */
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    console.log("✅ Conexão com banco de dados estabelecida com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar com banco de dados:", error);
    console.error(
      "\n💡 Verifique:\n" +
        "  1. Se o PostgreSQL está rodando\n" +
        "  2. Se a variável DATABASE_URL está correta no .env\n" +
        "  3. Se as credenciais estão corretas"
    );
    return false;
  }
}

/**
 * Obtém informações da conexão (sem expor credenciais)
 */
export function getConnectionInfo() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    return { configured: false };
  }

  try {
    const url = new URL(connectionString.replace(/^postgres:/, "postgresql:"));
    return {
      configured: true,
      host: url.hostname,
      port: url.port || "5432",
      database: url.pathname.slice(1),
      user: url.username,
      // Não expor senha
    };
  } catch {
    return {
      configured: true,
      // String de conexão customizada
    };
  }
}
