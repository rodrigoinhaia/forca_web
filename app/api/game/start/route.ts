import { NextRequest, NextResponse } from "next/server";
import { GameService } from "@/lib/services/GameService";

export async function POST(req: NextRequest) {
  try {
    const { difficulty } = await req.json();

    const gameService = new GameService();
    const gameState = await gameService.startNewGame(difficulty);

    return NextResponse.json({
      success: true,
      data: {
        word: gameState.word,
        guessedLetters: Array.from(gameState.guessedLetters),
        wrongGuesses: gameState.wrongGuesses,
        maxWrongGuesses: gameState.maxWrongGuesses,
        status: gameState.status,
      },
    });
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao iniciar jogo",
      },
      { status: 500 }
    );
  }
}
