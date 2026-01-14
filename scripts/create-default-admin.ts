#!/usr/bin/env ts-node
/**
 * Script para criar usuário administrador padrão
 * Execute: npx tsx scripts/create-default-admin.ts
 */

// Carregar variáveis de ambiente ANTES de importar a conexão
import { config } from "dotenv";
import { resolve } from "path";

// Carregar .env da raiz do projeto
config({ path: resolve(process.cwd(), ".env") });

import { UserService } from "../lib/services/UserService";
import { sql } from "../lib/db/connection";
import bcrypt from "bcryptjs";

async function createDefaultAdmin() {
  try {
    console.log("👤 Criando usuário administrador padrão...\n");

    const email = "admin@forca.com";
    const name = "Administrador";
    const password = "admin123";

    // Verificar se já existe
    const existing = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existing.rows.length > 0) {
      // Atualizar senha do admin existente
      const password_hash = await bcrypt.hash(password, 10);
      await sql`
        UPDATE users
        SET 
          password_hash = ${password_hash},
          role = 'admin',
          name = ${name}
        WHERE email = ${email}
      `;
      console.log("✅ Senha do administrador atualizada!");
    } else {
      // Criar novo admin
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
      console.log("✅ Administrador criado!");
    }

    console.log("\n📋 Credenciais do Administrador:");
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}`);
    console.log("\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!");
    console.log("\n💡 Para usar estas credenciais na API:");
    console.log(`   Authorization: Bearer ${Buffer.from(`${email}:${password}`).toString('base64')}`);

    return true;
  } catch (error) {
    console.error("\n❌ Erro ao criar administrador:", error);
    throw error;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createDefaultAdmin()
    .then(() => {
      console.log("\n🎉 Processo concluído!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Falha ao criar administrador:", error);
      process.exit(1);
    });
}

export { createDefaultAdmin };
