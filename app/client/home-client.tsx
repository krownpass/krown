"use client";

import { useRef, useState } from "react";
import CircularRevealStrips from "../components/CircularRevealStrips";
import GlassNavbar from "../components/NavBar";
import JoinOverlay from "../components/Overlay";
import PartnerOverlay from "../components/PartnerOverlay";
import PartnerWithKrown from "../components/PartnerWithKrown";
import KrownAccess from "../components/KrownAccess";
import KrownAdvantage from "../components/KrownAdvantages";
export default function HomeClient() {
    const [joinOpen, setJoinOpen] = useState(false);
    const [partnerOpen, setPartnerOpen] = useState(false);
    const partnerSectionRef = useRef<HTMLDivElement>(null);

    const scrollToPartner = () => {
        partnerSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };
    return (
        <>
            {/* BACKGROUND (NON CLICKABLE) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <CircularRevealStrips />
            </div>

            {/* NAV */}
            <div className="relative z-30">
                <GlassNavbar
                    onJoin={() => setJoinOpen(true)}
                    onBecomePartner={scrollToPartner}
                />
            </div>

            {/* HERO */}
            <section className="relative z-10 min-h-screen flex items-center justify-center text-center px-6">
                <div className="max-w-3xl">
                    <h1 className="text-white text-[2.4rem] sm:text-[3rem] md:text-[4.2rem] font-serif italic leading-tight">
                        <span className="block">Your city pass to</span>
                        <span className="block mt-2">
                            better experiences.
                        </span>
                    </h1>

                    <p className="mt-6 text-white/70">
                        From where you work to where you unwind,
                        Krown gives you access to what matters.
                    </p>

                    <button
                        onClick={() => setJoinOpen(true)}
                        className="mt-10 rounded-xl bg-black px-6 py-3 text-white shadow-lg hover:bg-black/80"
                    >
                        Get early access
                    </button>
                </div>
            </section>
            {/* KROWN ACCESS */}
            <KrownAccess />
            {/* KROWN ADVANTAGES */}
            <KrownAdvantage />

            {/* PARTNER */}
            <PartnerWithKrown
                ref={partnerSectionRef}
                onBecomePartner={() => setPartnerOpen(true)}
            />
            {/* OVERLAYS */}
            {joinOpen && (
                <JoinOverlay onClose={() => setJoinOpen(false)} />
            )}

            {partnerOpen && (
                <PartnerOverlay
                    open={partnerOpen}
                    onClose={() => setPartnerOpen(false)}
                />
            )}
        </>
    );
}
