import { NextRequest, NextResponse } from "next/server";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API || "https://api.krownpass.com";

function getSessionToken(req: NextRequest): string | null {
    return req.cookies.get("krown_session")?.value ?? null;
}

export async function GET(req: NextRequest) {
    const token = getSessionToken(req);
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const backendRes = await fetch(`${BACKEND_API}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await backendRes.json();
        return NextResponse.json(data, { status: backendRes.status });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 502 });
    }
}

export async function DELETE(req: NextRequest) {
    const token = getSessionToken(req);
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const backendRes = await fetch(`${BACKEND_API}/api/users/me`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await backendRes.json();
        
        const response = NextResponse.json(data, { status: backendRes.status });
        // Clean up session token cookie on success
        if (backendRes.ok) {
            response.cookies.delete("krown_session");
        }
        return response;
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to delete account" }, { status: 502 });
    }
}