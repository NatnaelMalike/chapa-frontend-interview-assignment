import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.chapa.co/v1/banks', {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 });
  }
}
