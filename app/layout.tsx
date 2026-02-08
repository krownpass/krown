import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import IntroGate from "./client/intro-gate";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://krownpass.com"),

    title: {
        default: "Krown – Chennai Café Membership Pass",
        template: "%s | Krown",
    },

    description:
        "Krown is Chennai’s premium café membership. Work from cafés, attend exclusive events, and unlock curated experiences.",


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
        url: "https://krownpass.com",
        siteName: "Krown",
        title: "Krown – Chennai’s Premium Café Membership",
        description:
            "Your city pass to Chennai’s best cafés. Work, meet, and attend exclusive events with one membership.",
        images: [
            {
                url: "/og/opengraph.svg",
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
        images: ["/og/opengraph.svg"],
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
        canonical: "https://krownpass.com",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                suppressHydrationWarning
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "Krown",
                            url: "https://krownpass.com",
                            description:
                                "Premium café membership platform in Chennai",
                            address: {
                                "@type": "PostalAddress",
                                addressLocality: "Chennai",
                                addressCountry: "IN",
                            },
                            sameAs: [
                                "https://www.instagram.com/krownpass",
                                "https://twitter.com/krownpass",
                            ],
                        }),
                    }}
                />
                <IntroGate>
                    {children}
                    <Footer />
                </IntroGate>
            </body>
        </html>
    );
}

