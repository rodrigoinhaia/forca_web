export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: UserRole;
  total_score: number;
  games_won: number;
  games_played: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserRanking {
  id: string;
  name: string;
  email: string;
  total_score: number;
  games_won: number;
  games_played: number;
  win_rate: number;
  position: number;
}
