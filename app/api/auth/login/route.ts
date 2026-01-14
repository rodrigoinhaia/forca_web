import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/UserService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userService = new UserService();
    const user = await userService.login(body);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao fazer login",
      },
      { status: 401 }
    );
  }
}
