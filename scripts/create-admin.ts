#!/usr/bin/env ts-node
/**
 * Script para criar usuário administrador
 * Execute: npx tsx scripts/create-admin.ts
 */

// Carregar variáveis de ambiente ANTES de importar a conexão
import { config } from "dotenv";
import { resolve } from "path";

// Carregar .env da raiz do projeto
config({ path: resolve(process.cwd(), ".env") });

import { UserService } from "../lib/services/UserService";
import { sql } from "../lib/db/connection";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log("👤 Criando usuário administrador...\n");

    const email = await question("Email do administrador: ");
    const name = await question("Nome do administrador: ");
    const password = await question("Senha: ");

    if (!email || !name || !password) {
      throw new Error("Todos os campos são obrigatórios");
    }

    if (password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    // Criar usuário
    const userService = new UserService();
    const user = await userService.createUser({
      email,
      name,
      password,
    });

    // Atualizar role para admin
    await sql`
      UPDATE users
      SET role = 'admin'
      WHERE id = ${user.id}
    `;

    console.log("\n✅ Usuário administrador criado com sucesso!");
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nome: ${user.name}`);
    console.log(`   Role: admin`);

    rl.close();
    return user;
  } catch (error) {
    console.error("\n❌ Erro ao criar administrador:", error);
    rl.close();
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createAdmin()
    .then(() => {
      console.log("\n🎉 Processo concluído!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Falha ao criar administrador:", error);
      process.exit(1);
    });
}

export { createAdmin };
