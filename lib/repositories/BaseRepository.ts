import { sql } from "@/lib/db/connection";

export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  async findById(id: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1`;
    const result = await sql.unsafe(query, [id]);
    return (result.rows[0] as T) || null;
  }

  async findAll(limit = 100, offset = 0): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    const result = await sql.unsafe(query, [limit, offset]);
    return result.rows as T[];
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result = await sql.unsafe(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  protected async executeQuery<TResult>(
    query: string,
    params: any[] = []
  ): Promise<TResult[]> {
    const result = await sql.unsafe(query, params);
    return result.rows as TResult[];
  }
}
