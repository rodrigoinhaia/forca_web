import { BaseRepository } from "./BaseRepository";
import { User, CreateUserInput } from "@/lib/types/user";
import { sql } from "@/lib/db/connection";

export class UserRepository extends BaseRepository<User> {
  protected tableName = "users";

  async findByEmail(email: string): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users
      WHERE email = ${email}
      LIMIT 1
    `;
    return result.rows[0] as User || null;
  }

  async create(data: CreateUserInput & { password_hash: string }): Promise<User> {
    const result = await sql`
      INSERT INTO users (email, name, password_hash, role)
      VALUES (${data.email}, ${data.name}, ${data.password_hash}, 'user')
      RETURNING *
    `;
    return result.rows[0] as User;
  }

  async update(id: string, data: Partial<Omit<User, "id" | "created_at">>): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.email) {
      updates.push(`email = $${paramIndex++}`);
      values.push(data.email);
    }
    if (data.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.password_hash) {
      updates.push(`password_hash = $${paramIndex++}`);
      values.push(data.password_hash);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sql.unsafe(query, values);
    return result.rows[0] as User || null;
  }

  async updateScore(
    userId: string,
    score: number,
    won: boolean
  ): Promise<User | null> {
    const result = await sql`
      UPDATE users
      SET 
        total_score = total_score + ${score},
        games_played = games_played + 1,
        games_won = games_won + ${won ? 1 : 0},
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *
    `;
    return result.rows[0] as User || null;
  }

  async getRanking(limit = 100): Promise<any[]> {
    const result = await sql`
      SELECT 
        id,
        name,
        email,
        total_score,
        games_won,
        games_played,
        CASE 
          WHEN games_played > 0 THEN ROUND((games_won::numeric / games_played::numeric) * 100, 2)
          ELSE 0
        END::float as win_rate
      FROM users
      WHERE role = 'user'
      ORDER BY total_score DESC, games_won DESC, win_rate DESC
      LIMIT ${limit}
    `;
    return result.rows.map((row, index) => ({
      ...row,
      position: index + 1,
      win_rate: parseFloat(row.win_rate) || 0,
    }));
  }

  async getUserRanking(userId: string): Promise<any | null> {
    const result = await sql`
      WITH ranked_users AS (
        SELECT 
          id,
          name,
          email,
          total_score,
          games_won,
          games_played,
          CASE 
            WHEN games_played > 0 THEN ROUND((games_won::numeric / games_played::numeric) * 100, 2)
            ELSE 0
          END::float as win_rate,
          ROW_NUMBER() OVER (
            ORDER BY total_score DESC, games_won DESC, win_rate DESC
          ) as position
        FROM users
        WHERE role = 'user'
      )
      SELECT * FROM ranked_users WHERE id = ${userId}
    `;
    const row = result.rows[0];
    if (!row) return null;
    return {
      ...row,
      win_rate: parseFloat(row.win_rate) || 0,
    };
  }
}
