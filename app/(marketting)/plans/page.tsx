import PlansClient from "@/app/client/plans-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Plans | Krown Membership",
    description:
        "Choose your Krown membership plan and unlock exclusive perks, free drinks, and priority access across Chennai's best cafés.",

    keywords: [
        "cafe membership plans",
        "Krown plans",
        "Krown membership",
        "cafe subscription plans",
        "Chennai cafe membership",
        "premium cafe plans",
        "cafe pass plans",
        "Krown pricing"
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
        url: "https://krownpass.com/plans",
        siteName: "Krown",
        title: "Krown Membership Plans",
        description:
            "Choose your Krown membership and unlock exclusive perks across Chennai's best cafés.",
        images: [
            {
                url: "/og/krown-og.jpg",
                width: 1200,
                height: 630,
                alt: "Krown Membership Plans",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Krown Membership Plans",
        description:
            "Choose your Krown membership and unlock exclusive perks across Chennai's best cafés.",
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
        canonical: "https://krownpass.com/plans",
    },
};

export default function PlansPage() {
    return (
        <main className="bg-black text-white">
            <PlansClient />
        </main>
    );
}

