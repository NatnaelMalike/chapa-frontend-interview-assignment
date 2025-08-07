// app/api/transfers/verify/[tx_ref]/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { tx_ref: string } }
) {
  try {
    const { tx_ref } = params;

    const response = await fetch(`https://api.chapa.co/v1/transfers/verify/${tx_ref}`, {
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
      { message: 'Failed to verify transfer', error: (error as Error).message },
      { status: 500 }
    );
  }
}