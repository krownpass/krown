import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/session?token=xxx
 * 
 * Opened directly by the mobile app in the browser.
 * Sets the token as an httpOnly cookie and redirects to /plans.
 * The token appears in the URL only for this one request — the browser
 * immediately redirects to /plans (clean URL) and the cookie persists.
 */
export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
    const source = req.nextUrl.searchParams.get("source");
    const redirectUrl = req.nextUrl.searchParams.get("redirect_url");

    // Build redirect URL using the original host (respects tunnel/proxy)
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const host = req.headers.get("host") || req.nextUrl.host;
    const origin = `${proto}://${host}`;

    const targetPath = redirectUrl || "/plans";
    const targetUrl = new URL(targetPath, origin);
    if (source) targetUrl.searchParams.set("source", source);

    if (!token) {
        return NextResponse.redirect(targetUrl);
    }

    // Decode JWT payload to get expiry (for cookie maxAge)
    let maxAge = 20 * 60; // default 20 minutes
    try {
        const payloadBase64 = token.split(".")[1];
        const base64 = payloadBase64
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const padded = base64.padEnd(
            base64.length + ((4 - (base64.length % 4)) % 4),
            "="
        );
        const payload = JSON.parse(atob(padded));
        if (payload.exp) {
            const remaining = payload.exp - Math.floor(Date.now() / 1000);
            if (remaining <= 0) {
                // Token expired — redirect (will likely show Access Denied if protected)
                return NextResponse.redirect(targetUrl);
            }
            maxAge = remaining;
        }
    } catch {
        // If we can't decode, use default maxAge — server will verify on use
    }

    // Redirect to target path and set the httpOnly cookie
    const response = NextResponse.redirect(targetUrl);

    response.cookies.set("krown_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge,
    });

    return response;
}

/**
 * DELETE /api/auth/session
 * Clears the session cookie.
 */
export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("krown_session");
    return response;
}
