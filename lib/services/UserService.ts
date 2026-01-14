import { UserRepository } from "@/lib/repositories/UserRepository";
import { User, CreateUserInput, LoginInput } from "@/lib/types/user";
import { createUserSchema, loginSchema } from "@/lib/validations/user.schema";
import bcrypt from "bcryptjs";

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(data: CreateUserInput): Promise<Omit<User, "password_hash">> {
    // Validação
    const validated = createUserSchema.parse(data);

    // Verificar se email já existe
    const existing = await this.repository.findByEmail(validated.email);
    if (existing) {
      throw new Error("Email já cadastrado");
    }

    // Hash da senha
    const password_hash = await bcrypt.hash(validated.password, 10);

    // Criar usuário
    const user = await this.repository.create({
      ...validated,
      password_hash,
    });

    // Retornar sem senha
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginInput): Promise<Omit<User, "password_hash">> {
    // Validação
    const validated = loginSchema.parse(data);

    // Buscar usuário
    const user = await this.repository.findByEmail(validated.email);
    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    // Verificar senha
    const isValid = await bcrypt.compare(validated.password, user.password_hash);
    if (!isValid) {
      throw new Error("Email ou senha inválidos");
    }

    // Retornar sem senha
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: string): Promise<Omit<User, "password_hash"> | null> {
    const user = await this.repository.findById(id);
    if (!user) {
      return null;
    }
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
