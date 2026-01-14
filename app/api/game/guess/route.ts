import { NextRequest, NextResponse } from "next/server";
import { GameService } from "@/lib/services/GameService";
import { GameState } from "@/lib/types/game";

export async function POST(req: NextRequest) {
  try {
    const { gameState, letter } = await req.json();

    if (!gameState || !letter) {
      return NextResponse.json(
        { success: false, error: "gameState e letter são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar letra
    if (!/^[A-Za-z]$/.test(letter)) {
      return NextResponse.json(
        { success: false, error: "Letra inválida" },
        { status: 400 }
      );
    }

    const gameService = new GameService();

    // Converter gameState recebido para o formato correto
    const currentState: GameState = {
      word: gameState.word,
      guessedLetters: new Set(gameState.guessedLetters || []),
      wrongGuesses: gameState.wrongGuesses || 0,
      maxWrongGuesses: gameState.maxWrongGuesses || 6,
      status: gameState.status || "playing",
    };

    const newState = gameService.makeGuess(currentState, letter);
    const displayWord = gameService.getDisplayWord(newState);

    return NextResponse.json({
      success: true,
      data: {
        word: newState.word,
        displayWord,
        guessedLetters: Array.from(newState.guessedLetters),
        wrongGuesses: newState.wrongGuesses,
        maxWrongGuesses: newState.maxWrongGuesses,
        status: newState.status,
      },
    });
  } catch (error) {
    console.error("Error making guess:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao fazer tentativa",
      },
      { status: 500 }
    );
  }
}
