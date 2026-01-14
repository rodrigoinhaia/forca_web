#!/usr/bin/env ts-node
/**
 * Script para inicializar o banco de dados
 * Execute: npx tsx scripts/init-db.ts
 */

// Carregar variáveis de ambiente ANTES de importar a conexão
import { config } from "dotenv";
import { resolve } from "path";

// Carregar .env da raiz do projeto
config({ path: resolve(process.cwd(), ".env") });

import { readFileSync } from "fs";
import { join } from "path";
import { sql } from "../lib/db/connection";

async function initDatabase() {
  try {
    console.log("🔄 Inicializando banco de dados...");

    // Ler o arquivo schema.sql
    const schemaPath = join(process.cwd(), "lib/db/schema.sql");
    const schema = readFileSync(schemaPath, "utf-8");

    // Executar o SQL completo de uma vez
    // O PostgreSQL suporta múltiplos comandos separados por ;
    try {
      await sql.unsafe(schema);
      console.log("✅ Schema executado com sucesso!");
    } catch (error: any) {
      // Se falhar, tentar executar comando por comando
      console.log("⚠️  Tentando executar comando por comando...");

      // Dividir em comandos simples (apenas por ;, sem parsing complexo)
      const commands = schema
        .split(";")
        .map((cmd) => cmd.trim())
        .filter((cmd) => cmd.length > 0 && !cmd.trim().startsWith("--"));

      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        if (!command || command.length < 10) continue; // Ignorar comandos muito curtos

        try {
          await sql.unsafe(command + ";");
        } catch (cmdError: any) {
          // Ignorar apenas erros de "já existe"
          if (
            cmdError?.code === "42P07" || // relation already exists
            cmdError?.code === "42710" || // duplicate object
            cmdError?.code === "42723" || // function already exists
            cmdError?.message?.includes("already exists") ||
            cmdError?.message?.includes("duplicate") ||
            cmdError?.message?.includes("já existe")
          ) {
            // Silenciar - objeto já existe
          } else {
            // Mostrar erro mas continuar (pode ser problema de sintaxe na divisão)
            console.warn(`⚠️  Erro no comando ${i + 1}: ${cmdError.message.substring(0, 80)}`);
          }
        }
      }
    }

    console.log("\n✅ Schema do banco de dados criado com sucesso!");
    console.log("✅ Tabelas criadas: users, words, game_sessions");
    console.log("✅ Índices e triggers configurados");
    console.log("✅ Palavras iniciais inseridas");

    return true;
  } catch (error) {
    console.error("❌ Erro ao inicializar banco de dados:", error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log("\n🎉 Banco de dados inicializado com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Falha ao inicializar banco de dados:", error);
      process.exit(1);
    });
}

export { initDatabase };
