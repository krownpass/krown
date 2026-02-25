import { NextRequest, NextResponse } from "next/server";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API!;

/**
 * GET /api/plans/payment-status/[transactionId]
 * Proxies to backend: GET /api/subscriptions/payment-status/{transactionId}
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ transactionId: string }> }
) {
    const { transactionId } = await params;
    const token = req.cookies.get("krown_session")?.value;

    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized — session expired or missing" },
            { status: 401 }
        );
    }

    try {
        const backendRes = await fetch(
            `${BACKEND_API}/api/subscriptions/payment-status/${transactionId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await backendRes.json();
        return NextResponse.json(data, { status: backendRes.status });
    } catch {
        return NextResponse.json(
            { error: "Failed to check payment status" },
            { status: 502 }
        );
    }
}
