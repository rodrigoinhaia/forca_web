import { NextRequest, NextResponse } from "next/server";
import { WordService } from "@/lib/services/WordService";
import { updateWordSchema } from "@/lib/validations/word.schema";
import { optionalAuth, requireAdmin } from "@/lib/middleware/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wordService = new WordService();
    const word = await wordService.getWordById(id);

    if (!word) {
      return NextResponse.json(
        { success: false, error: "Palavra não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: word,
    });
  } catch (error) {
    console.error("Error fetching word:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar palavra",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Apenas admins podem atualizar palavras
    await requireAdmin(req);

    const { id } = await params;
    const body = await req.json();
    const validated = updateWordSchema.parse(body);

    const wordService = new WordService();
    const word = await wordService.updateWord(id, validated);

    return NextResponse.json({
      success: true,
      data: word,
    });
  } catch (error) {
    console.error("Error updating word:", error);
    
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
    
    if (error instanceof Error && error.message.includes("não encontrada")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao atualizar palavra",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Apenas admins podem deletar palavras
    await requireAdmin(req);

    const { id } = await params;
    const wordService = new WordService();
    const deleted = await wordService.deleteWord(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Erro ao deletar palavra" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Palavra deletada com sucesso",
    });
  } catch (error) {
    console.error("Error deleting word:", error);
    
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
    
    if (error instanceof Error && error.message.includes("não encontrada")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao deletar palavra",
      },
      { status: 500 }
    );
  }
}
