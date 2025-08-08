import { users } from "@/data/users";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {

  const { email, password, rememberMe } = await request.json();
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // Store the user's ID in the cookie.
  const cookieStore = await cookies();
  cookieStore.set("auth", user.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days or session
    path: "/",
  });

  // 2. Create a new user object without the password field
  //    before sending the response. This prevents the password from
  //    ever being exposed to the client.
  const { password: _, ...userWithoutPassword } = user;

  // 3. Return the sanitized user object
  return NextResponse.json(userWithoutPassword);
  // --- END REFACTORED CODE ---
}