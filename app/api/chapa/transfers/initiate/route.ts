
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { account_number, amount, bank_code, reference } = await req.json();

    const response = await fetch('https://api.chapa.co/v1/transfers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_number,
        amount,
        bank_code,
        reference,
      }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error initiating transfer:', error);
    return NextResponse.json(
      { message: 'Transfer failed', error: (error as Error).message },
      { status: 500 }
    );
  }
}
