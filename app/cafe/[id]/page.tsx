// app/cafe/[id]/page.tsx
import { Metadata } from "next";

const APP_STORE = `https://apps.apple.com/app/id${process.env.NEXT_PUBLIC_APP_STORE_ID}`;
const PLAY_STORE = `https://play.google.com/store/apps/details?id=${process.env.NEXT_PUBLIC_PLAY_STORE_ID}`;
const APP_STORE_ID = process.env.NEXT_PUBLIC_APP_STORE_ID ?? "";
const BUNDLE_ID = process.env.NEXT_PUBLIC_PLAY_STORE_ID ?? "com.krown.app";

// Strict UUID regex — matches exactly xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getCafe(id: string) {
    try {
        const isUUID = UUID_REGEX.test(id);
        const url = isUUID
            ? `${process.env.API_BASE_URL}/api/cafes/${id}`
            : `${process.env.API_BASE_URL}/api/cafes/slug/${id}`;
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const cafe = await getCafe(id);
    const title = cafe?.cafe_name ?? "Krown Café";
    const image = cafe?.cover_img ?? "https://krownpass.com/og/opengraph.svg";
    return {
        title: `${title} – KrownPass`,
        description: cafe?.description ?? `Visit ${title} on KrownPass`,
        openGraph: {
            title,
            description: cafe?.description ?? "",
            images: [{ url: image, width: 1200, height: 630 }],
        },
        twitter: { card: "summary_large_image", title, images: [image] },
    };
}

export default async function CafePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="al:ios:url" content={`krown://cafe/${id}`} />
                <meta property="al:ios:app_store_id" content={APP_STORE_ID} />
                <meta property="al:ios:app_name" content="Krown" />
                <meta property="al:android:url" content={`krown://cafe/${id}`} />
                <meta property="al:android:package" content={BUNDLE_ID} />
                <meta property="al:android:app_name" content="Krown" />
            </head>
            <body style={{ margin: 0, backgroundColor: "#000", fontFamily: "-apple-system, sans-serif" }}>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function() {
  var id        = ${JSON.stringify(id)};
  var scheme    = "krown://cafe/" + id;
  var appStore  = ${JSON.stringify(APP_STORE)};
  var playStore = ${JSON.stringify(PLAY_STORE)};
  var ua        = navigator.userAgent || "";
  var isIOS     = /iPhone|iPad|iPod/i.test(ua);
  var isAndroid = /Android/i.test(ua);

  if (!isIOS && !isAndroid) {
    document.getElementById("stores").style.display = "flex";
    return;
  }

  var storeUrl = isIOS ? appStore : playStore;
  window.location.href = scheme;

  var timer = setTimeout(function() {
    window.location.replace(storeUrl);
  }, 1500);

  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") clearTimeout(timer);
  }, { once: true });
})();
                        `,
                    }}
                />

                <div id="stores" style={{
                    display: "none", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", minHeight: "100vh",
                    color: "#fff", textAlign: "center", padding: "0 24px", gap: 16,
                }}>
                    <div style={{ fontSize: 56 }}>☕</div>
                    <p style={{ fontSize: 22, fontWeight: 700, margin: "8px 0 4px" }}>Get the Krown App</p>
                    <p style={{ fontSize: 15, color: "#888", margin: "0 0 24px" }}>Available on iOS and Android</p>
                    <a href={APP_STORE} style={{
                        display: "block", width: 220, padding: "14px 0",
                        backgroundColor: "#fff", color: "#000",
                        borderRadius: 14, textDecoration: "none", fontWeight: 700, fontSize: 16,
                    }}>🍎 App Store</a>
                    <a href={PLAY_STORE} style={{
                        display: "block", width: 220, padding: "14px 0",
                        backgroundColor: "#C11E38", color: "#fff",
                        borderRadius: 14, textDecoration: "none", fontWeight: 700, fontSize: 16,
                    }}>🤖 Play Store</a>
                </div>
            </body>
        </html>
    );
}
