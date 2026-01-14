import { BaseRepository } from "./BaseRepository";
import { Word, CreateWordInput, UpdateWordInput } from "@/lib/types/word";
import { sql } from "@/lib/db/connection";

export class WordRepository extends BaseRepository<Word> {
  protected tableName = "words";

  async findByWord(word: string): Promise<Word | null> {
    const result = await sql`
      SELECT * FROM words
      WHERE LOWER(word) = LOWER(${word})
      LIMIT 1
    `;
    return result.rows[0] as Word || null;
  }

  async create(data: CreateWordInput): Promise<Word> {
    const result = await sql`
      INSERT INTO words (word, category, difficulty)
      VALUES (
        ${data.word.toUpperCase()},
        ${data.category || null},
        ${data.difficulty || "medio"}
      )
      RETURNING *
    `;
    return result.rows[0] as Word;
  }

  async update(id: string, data: UpdateWordInput): Promise<Word | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.word) {
      updates.push(`word = $${paramIndex++}`);
      values.push(data.word.toUpperCase());
    }
    if (data.category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(data.category || null);
    }
    if (data.difficulty) {
      updates.push(`difficulty = $${paramIndex++}`);
      values.push(data.difficulty);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE words
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sql.unsafe(query, values);
    return result.rows[0] as Word || null;
  }

  async getRandomWord(difficulty?: "facil" | "medio" | "dificil"): Promise<Word | null> {
    let query = `
      SELECT * FROM words
    `;
    const params: any[] = [];

    if (difficulty) {
      query += ` WHERE difficulty = $1`;
      params.push(difficulty);
    }

    query += ` ORDER BY RANDOM() LIMIT 1`;

    const result = await sql.unsafe(query, params);
    return result.rows[0] as Word || null;
  }

  async findByCategory(category: string): Promise<Word[]> {
    const result = await sql`
      SELECT * FROM words
      WHERE category = ${category}
      ORDER BY word
    `;
    return result.rows as Word[];
  }
}
