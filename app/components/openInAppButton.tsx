"use client";
// components/OpenInAppButton.tsx
// Handles 3 cases:
//   1. Production  → krown://event/123  (custom scheme, always works if app installed)
//   2. Expo Go dev → exp://192.x.x.x:8081/--/event/123
//   3. Not installed → shows App Store / Play Store links

import { useEffect, useState } from "react";

type Props = {
    path: string; // e.g. "event/123" or "cafe/456"
    appStoreUrl: string;
    playStoreUrl: string;
};

export default function OpenInAppButton({ path, appStoreUrl, playStoreUrl }: Props) {
    const [showFallback, setShowFallback] = useState(false);

    // The production custom scheme link — always try this first
    const prodLink = `krown://${path}`;

    const tryOpen = () => {
        setShowFallback(false);

        // Try opening the app via custom scheme
        window.location.href = prodLink;

        // If the app didn't open within 1.5s, the app isn't installed → show store links
        const timer = setTimeout(() => {
            setShowFallback(true);
        }, 1500);

        // If user came back to the tab, app opened successfully → clear timer
        const handleVisibility = () => {
            if (document.visibilityState === "hidden") {
                clearTimeout(timer);
            }
        };
        document.addEventListener("visibilitychange", handleVisibility, { once: true });
    };

    return (
        <div>
            <button onClick={tryOpen} style={s.primaryBtn}>
                Open in Krown App
            </button>

            {showFallback && (
                <div style={{ marginTop: 16 }}>
                    <p style={s.fallbackLabel}>App not found. Download it here:</p>
                    <div style={s.storeRow}>
                        <a href={appStoreUrl} style={s.storeBtn}>🍎 App Store</a>
                        <a href={playStoreUrl} style={s.storeBtn}>🤖 Play Store</a>
                    </div>
                </div>
            )}

            {/* Always show store buttons as secondary option */}
            {!showFallback && (
                <div style={{ marginTop: 12 }}>
                    <p style={s.orLabel}>Don't have the app?</p>
                    <div style={s.storeRow}>
                        <a href={appStoreUrl} style={s.storeBtn}>🍎 App Store</a>
                        <a href={playStoreUrl} style={s.storeBtn}>🤖 Play Store</a>
                    </div>
                </div>
            )}

            {/* Dev helper — only shown on non-production */}
            <DevHelper path={path} />
        </div>
    );
}

/* ── Dev helper box (only visible in development) ─────────────── */
function DevHelper({ path }: { path: string }) {
    const [devUrl, setDevUrl] = useState<string | null>(null);

    useEffect(() => {
        // Only show in non-production
        if (process.env.NODE_ENV === "production") return;

        // The Expo Go URL format: exp://LOCAL_IP:8081/--/path
        // We can't know the exact IP from the web server, so we show instructions
        setDevUrl(`exp://192.168.31.193:8081/--/${path}`);
    }, [path]);

    if (!devUrl) return null;

    return (
        <div style={s.devBox}>
            <p style={s.devTitle}>🛠️ Dev / Expo Go</p>
            <p style={s.devText}>
                Universal Links don't work in Expo Go. To test deep linking, open this URL manually in Expo Go:
            </p>
            <code style={s.devCode}>{devUrl}</code>
            <p style={s.devText}>
                Replace <strong>YOUR_LOCAL_IP</strong> with your machine's local IP (shown in Expo terminal).
            </p>
            <p style={s.devText}>
                Or use a <strong>custom dev build</strong> where <code>krown://</code> scheme works natively.
            </p>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    primaryBtn: {
        display: "block",
        width: "100%",
        padding: "15px 0",
        backgroundColor: "#C11E38",
        color: "#FFFFFF",
        border: "none",
        borderRadius: 14,
        textAlign: "center",
        fontWeight: 700,
        fontSize: 16,
        cursor: "pointer",
    },
    fallbackLabel: { fontSize: 13, color: "#8A8A8A", textAlign: "center", margin: "0 0 10px" },
    orLabel: { fontSize: 13, color: "#8A8A8A", textAlign: "center", margin: "0 0 10px" },
    storeRow: { display: "flex", gap: 10 },
    storeBtn: {
        flex: 1,
        padding: "12px 0",
        backgroundColor: "#2A2A2A",
        color: "#FFFFFF",
        borderRadius: 12,
        textAlign: "center",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 14,
        border: "1px solid #3A3A3A",
    },
    devBox: {
        marginTop: 24,
        backgroundColor: "#1A1A00",
        border: "1px solid #3A3A00",
        borderRadius: 12,
        padding: "14px 16px",
    },
    devTitle: { fontSize: 14, fontWeight: 700, color: "#FBBF24", margin: "0 0 6px" },
    devText: { fontSize: 13, color: "#A0A0A0", margin: "4px 0", lineHeight: 1.5 },
    devCode: {
        display: "block",
        backgroundColor: "#0B0B0B",
        color: "#4ADE80",
        padding: "8px 10px",
        borderRadius: 8,
        fontSize: 12,
        margin: "8px 0",
        wordBreak: "break-all" as const,
    },
};
