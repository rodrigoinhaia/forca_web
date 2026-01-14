import { NextRequest, NextResponse } from "next/server";
import { RankingService } from "@/lib/services/RankingService";
import { optionalAuth } from "@/lib/middleware/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await optionalAuth(req);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Autenticação necessária",
        },
        { status: 401 }
      );
    }

    const rankingService = new RankingService();
    const userRanking = await rankingService.getUserRanking(session.user.id);

    if (!userRanking) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuário não encontrado no ranking",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: userRanking,
    });
  } catch (error) {
    console.error("Error fetching user ranking:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar ranking do usuário",
      },
      { status: 500 }
    );
  }
}
