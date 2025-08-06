import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear cookie
  (await cookies()).delete("auth");

  return NextResponse.json({ success: true }, { status: 200 });
}
