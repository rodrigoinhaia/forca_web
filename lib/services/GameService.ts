import { WordService } from "./WordService";
import { GameState, GameStatus } from "@/lib/types/game";

export class GameService {
  private wordService: WordService;

  constructor() {
    this.wordService = new WordService();
  }

  async startNewGame(difficulty?: "facil" | "medio" | "dificil"): Promise<GameState> {
    // Buscar palavra aleatória
    const word = await this.wordService.getRandomWord(difficulty);

    return {
      word: word.word.toUpperCase(),
      guessedLetters: new Set<string>(),
      wrongGuesses: 0,
      maxWrongGuesses: 6,
      status: "playing",
    };
  }

  makeGuess(gameState: GameState, letter: string): GameState {
    if (gameState.status !== "playing") {
      return gameState;
    }

    const upperLetter = letter.toUpperCase();
    
    // Verificar se já foi tentada
    if (gameState.guessedLetters.has(upperLetter)) {
      return gameState;
    }

    // Adicionar à lista de tentativas
    const newGuessedLetters = new Set(gameState.guessedLetters);
    newGuessedLetters.add(upperLetter);

    // Verificar se está na palavra
    const isInWord = gameState.word.includes(upperLetter);
    const newWrongGuesses = isInWord
      ? gameState.wrongGuesses
      : gameState.wrongGuesses + 1;

    // Verificar status
    let status: GameStatus = "playing";

    // Verificar vitória
    const allLettersGuessed = gameState.word
      .split("")
      .filter((char) => char !== " ")
      .every((char) => newGuessedLetters.has(char));

    if (allLettersGuessed) {
      status = "won";
    } else if (newWrongGuesses >= gameState.maxWrongGuesses) {
      status = "lost";
    }

    return {
      ...gameState,
      guessedLetters: newGuessedLetters,
      wrongGuesses: newWrongGuesses,
      status,
    };
  }

  getDisplayWord(gameState: GameState): string {
    return gameState.word
      .split("")
      .map((char) => {
        if (char === " ") return " ";
        return gameState.guessedLetters.has(char) ? char : "_";
      })
      .join(" ");
  }

  getAvailableLetters(): string[] {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  }

  /**
   * Calcula a pontuação baseada no resultado do jogo
   */
  calculateScore(
    status: "won" | "lost",
    wrongGuesses: number,
    maxWrongGuesses: number,
    difficulty: "facil" | "medio" | "dificil" = "medio"
  ): number {
    if (status === "lost") {
      return 0;
    }

    // Pontuação base por dificuldade
    const baseScore = {
      facil: 10,
      medio: 20,
      dificil: 30,
    };

    // Bônus por tentativas restantes
    const remainingGuesses = maxWrongGuesses - wrongGuesses;
    const bonus = remainingGuesses * 5;

    return baseScore[difficulty] + bonus;
  }
}
