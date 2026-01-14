import { UserRepository } from "@/lib/repositories/UserRepository";
import { UserRanking } from "@/lib/types/user";

export class RankingService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getRanking(limit = 100): Promise<UserRanking[]> {
    const ranking = await this.repository.getRanking(limit);
    return ranking as UserRanking[];
  }

  async getUserRanking(userId: string): Promise<UserRanking | null> {
    const userRanking = await this.repository.getUserRanking(userId);
    return userRanking as UserRanking | null;
  }

  async updateUserScore(
    userId: string,
    score: number,
    won: boolean
  ): Promise<void> {
    await this.repository.updateScore(userId, score, won);
  }
}
