export interface Word {
  id: string;
  word: string;
  category?: string;
  difficulty: "facil" | "medio" | "dificil";
  created_at: Date;
  updated_at: Date;
}

export interface CreateWordInput {
  word: string;
  category?: string;
  difficulty?: "facil" | "medio" | "dificil";
}

export interface UpdateWordInput {
  word?: string;
  category?: string;
  difficulty?: "facil" | "medio" | "dificil";
}
