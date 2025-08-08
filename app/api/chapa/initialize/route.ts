import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const chapaRes = await fetch("https://api.chapa.co/v1/transaction/initialize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await chapaRes.json();

  return NextResponse.json(data, { status: chapaRes.status });
}
