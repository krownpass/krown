import { NextRequest, NextResponse } from "next/server";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API!;

/**
 * Helper: extract the session token from the httpOnly cookie.
 * Returns null if missing/expired.
 */
function getSessionToken(req: NextRequest): string | null {
    return req.cookies.get("krown_session")?.value ?? null;
}

/**
 * GET /api/plans
 * Proxies to backend: GET /api/subscriptions/plans
 */
export async function GET(req: NextRequest) {
    const token = getSessionToken(req);

    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized — session expired or missing" },
            { status: 401 }
        );
    }

    try {
        const backendRes = await fetch(`${BACKEND_API}/api/subscriptions/plans`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await backendRes.json();
        return NextResponse.json(data, { status: backendRes.status });
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch plans" },
            { status: 502 }
        );
    }
}
