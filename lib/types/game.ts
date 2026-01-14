export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  word: string;
  guessedLetters: Set<string>;
  wrongGuesses: number;
  maxWrongGuesses: number;
  status: GameStatus;
}

export interface GameSession {
  id: string;
  user_id?: string;
  word_id: string;
  word: string;
  status: GameStatus;
  attempts: number;
  score: number;
  difficulty: "facil" | "medio" | "dificil";
  created_at: Date;
}
