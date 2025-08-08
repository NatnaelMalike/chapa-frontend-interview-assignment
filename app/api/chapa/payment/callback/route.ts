import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trx_ref = searchParams.get('trx_ref');
  const ref_id = searchParams.get('ref_id');
  const status = searchParams.get('status');

  console.log({ trx_ref, ref_id, status });

  // Optional: Verify transaction with Chapa's verify endpoint
  const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${trx_ref}`, {
    headers: {
      Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    },
  });

  const verifyData = await verifyRes.json();

  if (verifyData.status === 'success') {    
    return NextResponse.json({ message: 'Payment verified and processed' }, { status: 200 });
  }

  return NextResponse.json({ message: 'Verification failed' }, { status: 400 });
}
