// app/api/transfers/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';

    const response = await fetch(`https://api.chapa.co/v1/transfers?page=${page}&per_page=${per_page}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch transfers', error: (error as Error).message },
      { status: 500 }
    );
  }
}