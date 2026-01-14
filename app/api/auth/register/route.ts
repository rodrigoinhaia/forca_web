import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/UserService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userService = new UserService();
    const user = await userService.createUser(body);

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    if (error instanceof Error && error.message.includes("já cadastrado")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao cadastrar usuário",
      },
      { status: 500 }
    );
  }
}
