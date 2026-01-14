import { NextRequest, NextResponse } from "next/server";
import { WordService } from "@/lib/services/WordService";
import { createWordSchema } from "@/lib/validations/word.schema";
import { optionalAuth, requireAdmin } from "@/lib/middleware/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const category = searchParams.get("category");

    const wordService = new WordService();

    let words;
    if (category) {
      words = await wordService.getWordsByCategory(category);
    } else {
      words = await wordService.getAllWords(limit, offset);
    }

    return NextResponse.json({
      success: true,
      data: words,
    });
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar palavras",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Apenas admins podem criar palavras
    await requireAdmin(req);

    const body = await req.json();
    const validated = createWordSchema.parse(body);

    const wordService = new WordService();
    const word = await wordService.createWord(validated);

    return NextResponse.json(
      {
        success: true,
        data: word,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating word:", error);
    
    // Erro de autenticação/autorização
    if (error instanceof Error && (
      error.message.includes("Token") || 
      error.message.includes("Acesso negado") ||
      error.message.includes("autenticação")
    )) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes("já cadastrada")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao criar palavra",
      },
      { status: 500 }
    );
  }
}
