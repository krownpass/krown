// app/cafe/[id]/page.tsx
// Drop this in your Next.js app directory at: app/cafe/[id]/page.tsx
// Fields match what cafeService.ts / RedeemScreen.tsx use exactly

import { notFound } from "next/navigation";
import { Metadata } from "next";

type Cafe = {
    cafe_id: string;
    cafe_name: string;
    cafe_location?: string;
    cafe_mail_id?: string;
    cafe_mobile_no?: string;
    cover_img?: string;
    ratings?: number | string;
    reviews_count?: number;
    latitude?: number;
    longitude?: number;
    opening_time?: string;
    closing_time?: string;
    description?: string;
    tags?: string[];
};

/* ── Fetch ──────────────────────────────────────────────────────── */
async function getCafe(id: string): Promise<Cafe | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/cafes/${id}`, {
            next: { revalidate: 60 },
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return (json?.data as Cafe) ?? null;
    } catch {
        return null;
    }
}

/* ── Fetch cafe images (same endpoint as getCafeImages in cafeService.ts) ── */
async function getCafeHeroImage(id: string): Promise<string | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/cafes/${id}/images`, {
            next: { revalidate: 60 },
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) return null;
        const json = await res.json();
        // mirrors getCafeImages logic in cafeService.ts
        const mainImages = json?.data?.main?.images ?? [];
        return mainImages[0]?.image_url ?? null;
    } catch {
        return null;
    }
}

/* ── OG Metadata ────────────────────────────────────────────────── */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const cafe = await getCafe(id);
    if (!cafe) return { title: "Café not found – KrownPass" };

    const image = cafe.cover_img ?? "https://krownpass.com/og-default.png";
    const url = `https://krownpass.com/cafe/${id}`;
    const desc = cafe.description ?? `${cafe.cafe_location ?? "Visit us"} · ⭐ ${cafe.ratings ?? "4.5"}`;

    return {
        title: `${cafe.cafe_name} – KrownPass`,
        description: desc,
        openGraph: {
            title: cafe.cafe_name,
            description: desc,
            url,
            siteName: "KrownPass",
            images: [{ url: image, width: 1200, height: 630, alt: cafe.cafe_name }],
            type: "website",
        },
        twitter: { card: "summary_large_image", title: cafe.cafe_name, description: desc, images: [image] },
    };
}

/* ── Page ───────────────────────────────────────────────────────── */
export default async function CafePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [cafe, heroImage] = await Promise.all([
        getCafe(id),
        getCafeHeroImage(id),
    ]);

    if (!cafe) notFound();

    const coverImage = heroImage ?? cafe.cover_img;

    const APP_STORE = "https://apps.apple.com/app/idYOUR_APP_ID";     // ← replace
    const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.krown.app";
    const APP_LINK = `krown://cafe/${id}`;

    // Google Maps directions link (same logic as handleDirections in RedeemScreen)
    const mapsUrl = cafe.latitude && cafe.longitude
        ? `https://www.google.com/maps/dir/?api=1&destination=${cafe.latitude},${cafe.longitude}&travelmode=driving`
        : null;

    return (
        <main style={s.page}>
            {/* ── Hero ── */}
            <div style={s.hero}>
                {coverImage
                    ? <img src={coverImage} alt={cafe.cafe_name} style={s.heroImg} />
                    : <div style={s.heroFallback}>☕</div>}
                <div style={s.heroOverlay} />

                {/* Brand */}
                <div style={s.brandPill}>
                    <span style={{ fontWeight: 700, color: "#C11E38" }}>KROWN</span>
                    <span style={{ fontWeight: 700, color: "#FFC44A" }}>PASS</span>
                </div>

                {/* Rating */}
                {cafe.ratings && (
                    <div style={s.ratingBadge}>
                        ⭐ {Number(cafe.ratings).toFixed(1)}
                        {cafe.reviews_count ? <span style={{ color: "#9CA3AF", fontSize: 12 }}> ({cafe.reviews_count}+)</span> : null}
                    </div>
                )}

                {/* Name */}
                <div style={s.heroBottom}>
                    <h1 style={s.heroTitle}>{cafe.cafe_name}</h1>
                    {cafe.cafe_location && (
                        <div style={s.heroLocation}>📍 {cafe.cafe_location}</div>
                    )}
                </div>
            </div>

            {/* ── Card ── */}
            <div style={s.card}>

                {/* KrownPass perks banner */}
                <div style={s.perksBanner}>
                    <span style={{ fontSize: 20 }}>🎉</span>
                    <span style={s.perksText}>KrownPass members get exclusive perks here</span>
                </div>

                <div style={s.divider} />

                {/* Info rows */}
                {cafe.cafe_location && <Row icon="📍" label="Location" value={cafe.cafe_location} />}

                {cafe.opening_time && cafe.closing_time && (
                    <Row icon="🕒" label="Hours" value={`${cafe.opening_time} – ${cafe.closing_time}`} />
                )}

                {cafe.cafe_mobile_no && (
                    <Row icon="📞" label="Phone" value={cafe.cafe_mobile_no} href={`tel:${cafe.cafe_mobile_no}`} />
                )}

                {cafe.cafe_mail_id && (
                    <Row icon="✉️" label="Email" value={cafe.cafe_mail_id} href={`mailto:${cafe.cafe_mail_id}`} />
                )}

                {/* Tags */}
                {cafe.tags && cafe.tags.length > 0 && (
                    <div style={s.tagsRow}>
                        {cafe.tags.map((tag) => (
                            <span key={tag} style={s.tag}>{tag}</span>
                        ))}
                    </div>
                )}

                {/* Description */}
                {cafe.description && (
                    <>
                        <div style={s.divider} />
                        <p style={s.desc}>{cafe.description}</p>
                    </>
                )}

                <div style={s.divider} />

                {/* Directions button (if coords available) */}
                {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={s.directionsBtn}>
                        🗺️ Get Directions
                    </a>
                )}

                {/* CTA */}
                <p style={s.ctaLabel}>View menu, redeem drinks &amp; book a table in the app</p>

                <a href={APP_LINK} style={s.primaryBtn}>
                    Open in Krown App
                </a>

                <p style={s.orLabel}>Don't have the app?</p>
                <div style={s.storeRow}>
                    <a href={APP_STORE} style={s.storeBtn}>🍎 App Store</a>
                    <a href={PLAY_STORE} style={s.storeBtn}>🤖 Play Store</a>
                </div>
            </div>
        </main>
    );
}

/* ── Row component ──────────────────────────────────────────────── */
function Row({ icon, label, value, sub, href }: {
    icon: string; label: string; value: string; sub?: string; href?: string;
}) {
    const valueEl = href
        ? <a href={href} style={{ fontSize: 15, fontWeight: 600, color: "#C11E38", textDecoration: "none" }}>{value}</a>
        : <div style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF" }}>{value}</div>;

    return (
        <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
            <div>
                <div style={{ fontSize: 11, color: "#8A8A8A", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
                    {label}
                </div>
                {valueEl}
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
    heroFallback: { width: "100%", height: "100%", background: "linear-gradient(135deg,#2D1B00,#0B0B0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 },
    heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 55%)" },
    brandPill: { position: "absolute", top: 16, left: 16, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 999, padding: "6px 14px", fontSize: 13, letterSpacing: 1, display: "flex", gap: 4 },
    ratingBadge: { position: "absolute", top: 16, right: 16, backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 999, padding: "6px 12px", fontSize: 14, fontWeight: 700, color: "#FFD700" },
    heroBottom: { position: "absolute", bottom: 20, left: 20, right: 20 },
    heroTitle: { fontSize: 24, fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px" },
    heroLocation: { fontSize: 14, color: "rgba(255,255,255,0.75)" },
    card: { width: "100%", maxWidth: 480, backgroundColor: "#1A1A1A", borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, padding: "24px 20px 48px", flex: 1 },
    perksBanner: { display: "flex", alignItems: "center", gap: 10, backgroundColor: "#1F1500", border: "1px solid #3D2E00", borderRadius: 12, padding: "14px 16px" },
    perksText: { fontSize: 14, color: "#FFC44A", fontWeight: 500 },
    divider: { height: 1, backgroundColor: "#2A2A2A", margin: "16px 0" },
    tagsRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 },
    tag: { backgroundColor: "rgba(193,30,56,0.15)", color: "#C11E38", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(193,30,56,0.3)" },
    desc: { fontSize: 14, color: "#A0A0A0", lineHeight: 1.6, margin: 0 },
    directionsBtn: { display: "block", padding: "12px 0", backgroundColor: "#2A2A2A", color: "#FFFFFF", borderRadius: 12, textAlign: "center", textDecoration: "none", fontWeight: 600, fontSize: 15, marginBottom: 16, border: "1px solid #3A3A3A" },
    ctaLabel: { fontSize: 13, color: "#8A8A8A", textAlign: "center", marginBottom: 12 },
    primaryBtn: { display: "block", padding: "15px 0", backgroundColor: "#C11E38", color: "#FFFFFF", borderRadius: 14, textAlign: "center", textDecoration: "none", fontWeight: 700, fontSize: 16, marginBottom: 16 },
    orLabel: { fontSize: 13, color: "#8A8A8A", textAlign: "center", margin: "0 0 10px" },
    storeRow: { display: "flex", gap: 10 },
    storeBtn: { flex: 1, padding: "12px 0", backgroundColor: "#2A2A2A", color: "#FFFFFF", borderRadius: 12, textAlign: "center", textDecoration: "none", fontWeight: 600, fontSize: 14, border: "1px solid #3A3A3A" },
};
