import { NextRequest, NextResponse } from "next/server";
import { RankingService } from "@/lib/services/RankingService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100");

    const rankingService = new RankingService();
    const ranking = await rankingService.getRanking(limit);

    return NextResponse.json({
      success: true,
      data: ranking,
    });
  } catch (error) {
    console.error("Error fetching ranking:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar ranking",
      },
      { status: 500 }
    );
  }
}
