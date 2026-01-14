import { NextRequest, NextResponse } from "next/server";
import { GameSettingsRepository } from "@/lib/repositories/GameSettingsRepository";
import { requireAdmin } from "@/lib/middleware/auth";

const settingsRepository = new GameSettingsRepository();

// GET - Obter todas as configurações (público para ler, mas admin para editar)
export async function GET(request: NextRequest) {
  try {
    const settings = await settingsRepository.getAllSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar configurações",
      },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar configuração (apenas admin)
export async function PATCH(request: NextRequest) {
  try {
    // Verificar autenticação e permissões de admin
    await requireAdmin(request);

    const body = await request.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "key e value são obrigatórios",
        },
        { status: 400 }
      );
    }

    const setting = await settingsRepository.updateSetting(key, value, description);

    return NextResponse.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error("Erro ao atualizar configuração:", error);
    
    // Se for erro de autenticação/autorização
    if (error instanceof Error && (
      error.message.includes("Token") || 
      error.message.includes("Acesso negado") ||
      error.message.includes("autenticação")
    )) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao atualizar configuração",
      },
      { status: 500 }
    );
  }
}
