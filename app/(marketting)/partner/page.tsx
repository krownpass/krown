import PartnerSectionClient from "@/app/client/parnter-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Partner with Krown | Café Owners",
    description:
        "Join Chennai’s curated café membership network and host community-driven experiences.",

    keywords: [
        "Chennai cafes parter",
        "cafe membership partner",
        "work with cafe Chennai partner",
        "premium cafes Chennai",
        "Krown cafe partner",
        "cafe partner",
        "krown partner"
    ],

    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },

    openGraph: {
        type: "website",
        locale: "en_IN",
        url: "https://krownpass.com/partner",
        siteName: "Krown",
        title: "Krown – Chennai’s Premium Café Membership",
        description:
            "Your city pass to Chennai’s best cafés. Work, meet, and attend exclusive events with one membership.",
        images: [
            {
                url: "/og/krown-og.jpg",
                width: 1200,
                height: 630,
                alt: "Krown – Chennai Café Membership Pass",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Krown – Chennai Café Membership Pass",
        description:
            "One membership. Chennai’s best cafés. Work, meet & discover.",
        images: ["/og/krown-og.jpg"],
        creator: "@krownpass",
    },

    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: "/apple-touch-icon.png",
    },

    alternates: {
        canonical: "https://krownpass.com/partner",
    },
};

export default function PartnerPage() {
    return (
        <main className="bg-black text-white">
            <PartnerSectionClient />
        </main>
    );
}
