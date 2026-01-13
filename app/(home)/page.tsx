import type { Metadata } from 'next';
import HomeClient from "../client/home-client";

export const metadata: Metadata = {
    title: "Chennai’s Premium Café Membership",
    description:
        "Your city pass to Chennai’s best cafés. Work, meet, and attend exclusive events with one membership.",
    keywords: [
        "cafe membership app",
        "best café membership in India",
        "coffee membership near me",
        "dine-in café app",
        "cafe discovery app",
        "cafe events app",
        "cafe membership in Chennai",
        "best cafes in Chennai",
        "cafe pass Chennai",
        "work from cafe Chennai",
        "cafe hopping Chennai",
        "premium cafés near me",
        "best coffee places near me",
        "community café events",

        "lifestyle events at cafés",
        "best coffee subscription for students",
        "cafe membership for professionals",
        "coffee subscription for remote workers",
        "affordable cafe membership",
        "premium cafe experiences",
        "community cafés near me",

        "KROWN café membership",
        "KROWN app",
        "KROWN cafés"
    ],
    openGraph: {
        title: "Krown – Chennai’s Premium Café Membership",
        description:
            "One membership. Chennai’s best cafés. Work, meet & discover.",
        url: "https://krownpass.com",
    },

    alternates: {
        canonical: "https://krownpass.com",
    },
};
export default function Page() {
    return (
        <>
            <HomeClient />

        </>
    )
}
