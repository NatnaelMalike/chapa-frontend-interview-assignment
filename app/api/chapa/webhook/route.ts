// app/api/payment/callback/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("Payment callback received:", body);
  const tx_ref = body.tx_ref;

  if (!tx_ref) {
    return NextResponse.json({ message: "Missing tx_ref" }, { status: 400 });
  }

  try {
    // Call Chapa verify endpoint
    const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    });

    const verifyData = await verifyRes.json();

    if (verifyRes.ok && verifyData.status === "success") {
      // ✅ Transaction verified - do something (e.g., save to DB, mark as paid)
      console.log("Verified transaction:", verifyData.data);
    } else {
      console.error("Verification failed:", verifyData);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error verifying transaction:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
