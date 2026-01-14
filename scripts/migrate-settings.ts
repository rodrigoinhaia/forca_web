#!/usr/bin/env ts-node
/**
 * Script para adicionar a tabela de configurações ao banco de dados
 * Execute: npx tsx scripts/migrate-settings.ts
 */

// Carregar variáveis de ambiente ANTES de importar a conexão
import { config } from "dotenv";
import { resolve } from "path";

// Carregar .env da raiz do projeto
config({ path: resolve(process.cwd(), ".env") });

import { sql } from "../lib/db/connection";

async function migrateSettings() {
  try {
    console.log("🔄 Adicionando tabela de configurações...");

    // Criar tabela de configurações
    await sql`
      CREATE TABLE IF NOT EXISTS game_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key VARCHAR(100) UNIQUE NOT NULL,
        value TEXT NOT NULL,
        description TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Inserir mensagem padrão de vitória
    await sql`
      INSERT INTO game_settings (key, value, description) VALUES
        ('victory_message', '🎉 Você Ganhou!', 'Mensagem exibida quando o usuário acerta a palavra')
      ON CONFLICT (key) DO NOTHING
    `;

    console.log("✅ Tabela de configurações criada com sucesso!");
    console.log("✅ Mensagem padrão de vitória inserida!");

    return true;
  } catch (error) {
    console.error("❌ Erro ao criar tabela de configurações:", error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  migrateSettings()
    .then(() => {
      console.log("\n🎉 Migração concluída com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Falha na migração:", error);
      process.exit(1);
    });
}

export { migrateSettings };
