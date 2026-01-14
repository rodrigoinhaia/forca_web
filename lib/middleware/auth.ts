import { NextRequest } from "next/server";
import { UserService } from "@/lib/services/UserService";
import { User } from "@/lib/types/user";

export interface AuthSession {
  user: Omit<User, "password_hash">;
}

/**
 * Verifica autenticação via header Authorization (Bearer token)
 * Por enquanto, usa email:password em base64 como token simples
 * TODO: Implementar JWT adequado
 */
export async function requireAuth(
  req: NextRequest
): Promise<AuthSession> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token de autenticação não fornecido");
  }

  const token = authHeader.replace("Bearer ", "");
  
  try {
    // Decodificar token (email:password em base64)
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [email, password] = decoded.split(":");

    if (!email || !password) {
      throw new Error("Token inválido");
    }

    const userService = new UserService();
    const user = await userService.login({ email, password });

    return { user };
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
}

/**
 * Verifica se o usuário é administrador
 */
export async function requireAdmin(req: NextRequest): Promise<AuthSession> {
  const session = await requireAuth(req);

  if (session.user.role !== "admin") {
    throw new Error("Acesso negado. Apenas administradores podem acessar.");
  }

  return session;
}

/**
 * Autenticação opcional (não lança erro se não autenticado)
 */
export async function optionalAuth(
  req: NextRequest
): Promise<AuthSession | null> {
  try {
    return await requireAuth(req);
  } catch {
    return null;
  }
}
