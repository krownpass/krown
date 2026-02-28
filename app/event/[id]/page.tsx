// app/event/[id]/page.tsx
// Drop this in your Next.js app directory at: app/event/[id]/page.tsx
// Fields match KrownEvent type from EventDetailsScreen.tsx exactly

import { notFound } from "next/navigation";
import { Metadata } from "next";
import OpenInAppButton from "@/app/components/openInAppButton";

type KrownEvent = {
    event_id: string;
    slug?: string;
    title: string;
    description?: string;
    cover_image?: string;
    event_type: string;
    status: string;
    start_time: string;
    end_time: string;
    venue_name?: string;
    venue_address?: string;
    venue_city?: string;
    venue_state?: string;
    is_paid: boolean;
    base_price?: number;
    max_capacity?: number;
    current_registrations?: number;
    is_registration_open?: boolean;
    is_revealed?: boolean;
};

/* ── Fetch ──────────────────────────────────────────────────────── */
async function getEvent(id: string): Promise<KrownEvent | null> {
    try {
        const res = await fetch(`${process.env.API_BASE_URL}/api/events/${id}`, {
            next: { revalidate: 60 },
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return (json?.data as KrownEvent) ?? null;
    } catch {
        return null;
    }
}

/* ── Helpers ────────────────────────────────────────────────────── */
const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

/* ── OG Metadata ────────────────────────────────────────────────── */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const event = await getEvent(params.id);
    if (!event) return { title: "Event not found – KrownPass" };

    const image = event.cover_image ?? "https://krownpass.com/og-default.png";
    const url = `https://krownpass.com/event/${params.id}`;

    return {
        title: `${event.title} – KrownPass`,
        description: event.description ?? `${event.venue_name ?? "KrownPass Event"} · ${formatDate(event.start_time)}`,
        openGraph: {
            title: event.title,
            description: event.description ?? "",
            url,
            siteName: "KrownPass",
            images: [{ url: image, width: 1200, height: 630, alt: event.title }],
            type: "website",
        },
        twitter: { card: "summary_large_image", title: event.title, description: event.description ?? "", images: [image] },
    };
}

/* ── Page ───────────────────────────────────────────────────────── */
export default async function EventPage({ params }: { params: { id: string } }) {
    const event = await getEvent(params.id);
    if (!event) notFound();

    const isRevealed = event.is_revealed !== false;
    const available = event.max_capacity ? event.max_capacity - (event.current_registrations ?? 0) : null;
    const isSoldOut = available !== null && available <= 0;
    const isClosed = event.is_registration_open === false;
    const venueAddress = [event.venue_address, event.venue_city, event.venue_state].filter(Boolean).join(", ");

    const APP_STORE = "https://apps.apple.com/app/idYOUR_APP_ID";     // ← replace
    const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.krown.app";
    const APP_LINK = `krown://event/${params.id}`;

    return (
        <main style={s.page}>
            {/* ── Hero ── */}
            <div style={s.hero}>
                {event.cover_image
                    ? <img src={event.cover_image} alt={event.title} style={s.heroImg} />
                    : <div style={s.heroFallback}>🎉</div>}
                <div style={s.heroOverlay} />

                {/* Brand */}
                <div style={s.brandPill}>
                    <span style={{ fontWeight: 700, color: "#C11E38" }}>KROWN</span>
                    <span style={{ fontWeight: 700, color: "#FFC44A" }}>PASS</span>
                </div>

                {/* Status */}
                <div style={{ ...s.statusBadge, backgroundColor: event.status === "open" ? "#22C55E" : "#C11E38" }}>
                    {event.status.toUpperCase()}
                </div>

                {/* Title */}
                <div style={s.heroBottom}>
                    <span style={s.typePill}>{event.event_type.replace("_", " ").toUpperCase()}</span>
                    <h1 style={s.heroTitle}>{event.title}</h1>
                </div>
            </div>

            {/* ── Card ── */}
            <div style={s.card}>

                {/* Price + availability */}
                <div style={s.priceRow}>
                    <span style={event.is_paid ? s.pricePaid : s.priceFree}>
                        {event.is_paid ? `₹${event.base_price}` : "FREE"}
                    </span>
                    {available !== null && (
                        <span style={isSoldOut ? s.tagRed : s.tagGreen}>
                            {isSoldOut ? "Sold Out" : `${available} spots left`}
                        </span>
                    )}
                </div>

                <div style={s.divider} />

                {/* Date */}
                <Row icon="📅" label="Date" value={formatDate(event.start_time)} />

                {/* Time */}
                <Row icon="🕒" label="Time" value={`${formatTime(event.start_time)} – ${formatTime(event.end_time)}`} />

                {/* Venue */}
                {isRevealed && event.venue_name
                    ? <Row icon="📍" label="Venue" value={event.venue_name} sub={venueAddress} />
                    : <Row icon="🔒" label="Venue" value="Will be revealed soon!" />}

                {/* Description */}
                {event.description && (
                    <>
                        <div style={s.divider} />
                        <p style={s.desc}>{event.description}</p>
                    </>
                )}

                <div style={s.divider} />

                {/* Registration status notice */}
                {(isClosed || isSoldOut) && (
                    <div style={s.noticeBanner}>
                        {isClosed ? "🔒 Registration is currently closed" : "🎟️ This event is sold out"}
                    </div>
                )}

                {/* CTA */}
                <p style={s.ctaLabel}>Register &amp; manage your ticket in the app</p>

                <a href={APP_LINK} style={s.primaryBtn}>
                    Open in Krown App
                </a>

                <p style={s.orLabel}>Don't have the app?</p>
                <div style={s.storeRow}>

// Replace the CTA section with:
                    <OpenInAppButton
                        path={`event/${params.id}`}   // or cafe/${params.id}
                        appStoreUrl="https://apps.apple.com/app/idYOUR_APP_ID"
                        playStoreUrl="https://play.google.com/store/apps/details?id=com.krown.app"
                    />
                </div>
            </div>
        </main>
    );
}

/* ── Small reusable row component ───────────────────────────────── */
function Row({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
    return (
        <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
            <div>
                <div style={{ fontSize: 11, color: "#8A8A8A", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
                    {label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF" }}>{value}</div>
                {sub && <div style={{ fontSize: 13, color: "#8A8A8A", marginTop: 2 }}>{sub}</div>}
            </div>
        </div>
    );
}

/* ── Styles ─────────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    page: { minHeight: "100vh", backgroundColor: "#0B0B0B", fontFamily: "'Inter',-apple-system,sans-serif", display: "flex", flexDirection: "column", alignItems: "center" },
    hero: { width: "100%", maxWidth: 480, height: 300, position: "relative", overflow: "hidden" },
    heroImg: { width: "100%", height: "100%", objectFit: "cover" },
    heroFallback: { width: "100%", height: "100%", background: "linear-gradient(135deg,#800020,#1A0007)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 },
    heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 55%)" },
    brandPill: { position: "absolute", top: 16, left: 16, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 999, padding: "6px 14px", fontSize: 13, letterSpacing: 1, display: "flex", gap: 4 },
    statusBadge: { position: "absolute", top: 16, right: 16, borderRadius: 999, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 0.5 },
    heroBottom: { position: "absolute", bottom: 20, left: 20, right: 20 },
    typePill: { display: "inline-block", backgroundColor: "rgba(193,30,56,0.85)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, marginBottom: 8, letterSpacing: 0.5 },
    heroTitle: { fontSize: 22, fontWeight: 800, color: "#FFFFFF", margin: 0, lineHeight: 1.3 },
    card: { width: "100%", maxWidth: 480, backgroundColor: "#1A1A1A", borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, padding: "24px 20px 48px", flex: 1 },
    priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    priceFree: { fontSize: 22, fontWeight: 800, color: "#4ADE80" },
    pricePaid: { fontSize: 22, fontWeight: 800, color: "#FBBF24" },
    tagGreen: { fontSize: 13, color: "#4ADE80", fontWeight: 600, backgroundColor: "rgba(74,222,128,0.1)", padding: "4px 10px", borderRadius: 999 },
    tagRed: { fontSize: 13, color: "#EF4444", fontWeight: 600, backgroundColor: "rgba(239,68,68,0.1)", padding: "4px 10px", borderRadius: 999 },
    divider: { height: 1, backgroundColor: "#2A2A2A", margin: "16px 0" },
    desc: { fontSize: 14, color: "#A0A0A0", lineHeight: 1.6, margin: 0 },
    noticeBanner: { backgroundColor: "#2A2A2A", border: "1px solid #3A3A3A", borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#8A8A8A", textAlign: "center", marginBottom: 16 },
    ctaLabel: { fontSize: 13, color: "#8A8A8A", textAlign: "center", marginBottom: 12 },
    primaryBtn: { display: "block", padding: "15px 0", backgroundColor: "#C11E38", color: "#FFFFFF", borderRadius: 14, textAlign: "center", textDecoration: "none", fontWeight: 700, fontSize: 16, marginBottom: 16 },
    orLabel: { fontSize: 13, color: "#8A8A8A", textAlign: "center", margin: "0 0 10px" },
    storeRow: { display: "flex", gap: 10 },
    storeBtn: { flex: 1, padding: "12px 0", backgroundColor: "#2A2A2A", color: "#FFFFFF", borderRadius: 12, textAlign: "center", textDecoration: "none", fontWeight: 600, fontSize: 14, border: "1px solid #3A3A3A" },
};
