import { mockUsers } from "@/data/users";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password, rememberMe } = await request.json();
  const user = mockUsers.find(
    (user) => user.email === email && user.password === password
  );
  
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
  // Set HTTP-only cookie
  (await cookies()).set("auth", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days or session
    path: "/",
  });

  return NextResponse.json(user);
}
