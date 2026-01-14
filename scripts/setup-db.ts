#!/usr/bin/env ts-node
/**
 * Script completo de setup do banco de dados
 * Inicializa o banco e cria o usuário admin
 * Execute: npx tsx scripts/setup-db.ts
 */

// Carregar variáveis de ambiente ANTES de importar
import { config } from "dotenv";
import { resolve } from "path";

// Carregar .env da raiz do projeto
config({ path: resolve(process.cwd(), ".env") });

import { initDatabase } from "./init-db";
import { createAdmin } from "./create-admin";

async function setupDatabase() {
  try {
    console.log("🚀 Iniciando setup completo do banco de dados...\n");

    // 1. Inicializar banco
    await initDatabase();
    console.log("");

    // 2. Criar admin
    const createAdminNow = process.argv.includes("--create-admin");
    if (createAdminNow) {
      await createAdmin();
    } else {
      console.log("💡 Para criar um administrador, execute:");
      console.log("   npx tsx scripts/create-admin.ts");
    }

    console.log("\n✅ Setup completo!");
  } catch (error) {
    console.error("\n❌ Erro no setup:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  setupDatabase();
}

export { setupDatabase };
