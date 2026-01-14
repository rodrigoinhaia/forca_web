import { WordRepository } from "@/lib/repositories/WordRepository";
import { Word, CreateWordInput, UpdateWordInput } from "@/lib/types/word";
import { createWordSchema, updateWordSchema } from "@/lib/validations/word.schema";

export class WordService {
  private repository: WordRepository;

  constructor() {
    this.repository = new WordRepository();
  }

  async createWord(data: CreateWordInput): Promise<Word> {
    // Validação
    const validated = createWordSchema.parse(data);

    // Verificar se palavra já existe
    const existing = await this.repository.findByWord(validated.word);
    if (existing) {
      throw new Error("Palavra já cadastrada");
    }

    // Criar palavra
    return await this.repository.create(validated);
  }

  async updateWord(id: string, data: UpdateWordInput): Promise<Word> {
    // Validação
    const validated = updateWordSchema.parse(data);

    // Verificar se palavra existe
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Palavra não encontrada");
    }

    // Se está atualizando a palavra, verificar duplicata
    if (validated.word && validated.word !== existing.word) {
      const duplicate = await this.repository.findByWord(validated.word);
      if (duplicate) {
        throw new Error("Palavra já cadastrada");
      }
    }

    // Atualizar
    const updated = await this.repository.update(id, validated);
    if (!updated) {
      throw new Error("Erro ao atualizar palavra");
    }

    return updated;
  }

  async deleteWord(id: string): Promise<boolean> {
    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new Error("Palavra não encontrada");
    }

    return await this.repository.delete(id);
  }

  async getRandomWord(difficulty?: "facil" | "medio" | "dificil"): Promise<Word> {
    const word = await this.repository.getRandomWord(difficulty);
    if (!word) {
      throw new Error("Nenhuma palavra disponível");
    }
    return word;
  }

  async getAllWords(limit = 100, offset = 0): Promise<Word[]> {
    return await this.repository.findAll(limit, offset);
  }

  async getWordById(id: string): Promise<Word | null> {
    return await this.repository.findById(id);
  }

  async getWordsByCategory(category: string): Promise<Word[]> {
    return await this.repository.findByCategory(category);
  }
}
