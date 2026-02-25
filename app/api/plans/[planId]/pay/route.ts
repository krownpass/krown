import { NextRequest, NextResponse } from "next/server";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API!;

/**
 * POST /api/plans/[planId]/pay
 * Proxies to backend: POST /api/subscriptions/{planId}/pay
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ planId: string }> }
) {
    const { planId } = await params;
    const token = req.cookies.get("krown_session")?.value;

    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized — session expired or missing" },
            { status: 401 }
        );
    }

    try {
        const backendRes = await fetch(
            `${BACKEND_API}/api/subscriptions/${planId}/pay`,
            {
                method: "POST",
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
            { error: "Failed to initiate payment" },
            { status: 502 }
        );
    }
}
