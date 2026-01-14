import { sql } from "@/lib/db/connection";

export interface GameSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  updated_at: Date;
}

export class GameSettingsRepository {
  async getSetting(key: string): Promise<GameSetting | null> {
    const result = await sql`
      SELECT * FROM game_settings WHERE key = ${key}
    `;
    return result.rows[0] as GameSetting || null;
  }

  async getSettingValue(key: string, defaultValue: string = ""): Promise<string> {
    const setting = await this.getSetting(key);
    return setting?.value || defaultValue;
  }

  async updateSetting(key: string, value: string, description?: string): Promise<GameSetting> {
    const result = await sql`
      INSERT INTO game_settings (key, value, description)
      VALUES (${key}, ${value}, ${description || null})
      ON CONFLICT (key) 
      DO UPDATE SET 
        value = EXCLUDED.value,
        description = COALESCE(EXCLUDED.description, game_settings.description),
        updated_at = NOW()
      RETURNING *
    `;
    return result.rows[0] as GameSetting;
  }

  async getAllSettings(): Promise<GameSetting[]> {
    const result = await sql`
      SELECT * FROM game_settings ORDER BY key
    `;
    return result.rows as GameSetting[];
  }
}
