import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const authCookie = (await cookies()).get("auth")?.value;

  if (!authCookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = JSON.parse(authCookie);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { user: null, error: "Invalid cookie format" },
      { status: 400 }
    );
  }
}
