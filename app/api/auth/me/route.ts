import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { users } from "@/data/users";

export async function GET() {
  const authCookie = (await cookies()).get("auth")?.value;

  if (!authCookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const id = JSON.parse(authCookie);
    const user = users.find(u => u.id === id)
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { user: null, error: "Invalid cookie format" },
      { status: 400 }
    );
  }
}
