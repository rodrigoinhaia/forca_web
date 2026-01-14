import { NextResponse } from "next/server";
import { GameSettingsRepository } from "@/lib/repositories/GameSettingsRepository";

const settingsRepository = new GameSettingsRepository();

// GET - Obter mensagem de vitória (público)
export async function GET() {
  try {
    const message = await settingsRepository.getSettingValue(
      "victory_message",
      "🎉 Você Ganhou!"
    );
    return NextResponse.json({
      success: true,
      data: { message },
    });
  } catch (error) {
    console.error("Erro ao buscar mensagem de vitória:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar mensagem de vitória",
        data: { message: "🎉 Você Ganhou!" }, // Fallback
      },
      { status: 500 }
    );
  }
}
