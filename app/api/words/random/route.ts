import { NextRequest, NextResponse } from "next/server";
import { WordService } from "@/lib/services/WordService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty") as
      | "facil"
      | "medio"
      | "dificil"
      | null;

    const wordService = new WordService();
    const word = await wordService.getRandomWord(difficulty || undefined);

    return NextResponse.json({
      success: true,
      data: word,
    });
  } catch (error) {
    console.error("Error fetching random word:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar palavra aleatória",
      },
      { status: 500 }
    );
  }
}
