"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Users,
    Calendar,
    Sparkles,
    MapPin,
    ArrowLeft,
} from "lucide-react";
import HowPartnershipWorks from "./BlackCardSection";
import PartnerValuesSection from "./PartnerValueSection";
import WhyCafesChooseKrown from "./WhyChooseKrown";
import PartnerCTASection from "./ParnterCTA";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const TRANSITION_KEY = "krown:page-transition";
const DIRECTION_KEY = "krown:page-direction";

type Props = {
    onBecomePartner: () => void;
};

const FEATURES = [
    {
        title: "Curated Footfall",
        desc: "Quality members, not random walk-ins",
        icon: Users,
    },
    {
        title: "Community Events",
        desc: "Host runs, brunches, meetups & pop-ups",
        icon: Calendar,
    },
    {
        title: "Brand Visibility",
        desc: "Featured across Krown’s platform",
        icon: Sparkles,
    },
    {
        title: "Chennai-First Network",
        desc: "Hyperlocal, culture-led cafés",
        icon: MapPin,
    },
];

export default function PartnerLearnMoreSection({
    onBecomePartner,
}: Props) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const isNavigatingRef = useRef(false);
    const router = useRouter();

    const cardsRef = useRef<HTMLDivElement>(null);
    /* ================= RESET PANEL + SCROLL ON MOUNT ================= */
    useLayoutEffect(() => {
        // Always reset wipe panel (critical for App Router)
        if (panelRef.current) {
            gsap.set(panelRef.current, {
                x: "-100%",
                clearProps: "willChange,transform",
            });
        }

        // Ensure scroll is restored
        document.body.style.overflow = "";

        return () => {
            document.body.style.overflow = "";
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    /* ================= BACK → HOME (GUARDED & STABLE) ================= */
    const handleBack = () => {
        if (isNavigatingRef.current) return;
        isNavigatingRef.current = true;

        const panel = panelRef.current;
        if (!panel) {
            router.push("/");
            return;
        }

        sessionStorage.setItem(TRANSITION_KEY, "true");
        sessionStorage.setItem(DIRECTION_KEY, "back");

        // Freeze scroll
        document.body.style.overflow = "hidden";

        // Kill ALL scroll triggers
        ScrollTrigger.getAll().forEach((st) => st.kill());

        // Prepare wipe panel
        gsap.set(panel, {
            x: "100%",
            force3D: true,
            willChange: "transform",
        });

        // Animate wipe
        gsap.to(panel, {
            x: "0%",
            duration: 0.65,
            ease: "power4.inOut",
            onComplete: () => {
                router.push("/");
            },
        });
    };

    /* ================= SCROLL REVEALS ================= */
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".reveal", {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            gsap.to(".card", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: "top 80%",

                    toggleActions: "play none none reverse",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-[#0A0A0A] overflow-hidden"
        >
            {/* ================= BLACK WIPE PANEL ================= */}
            <div
                ref={panelRef}
                className="fixed inset-0 z-[9999] bg-black -translate-x-full pointer-events-none"
            />

            {/* ================= BACKGROUND GLOW ================= */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(90%_45%_at_50%_0%,rgba(120,0,0,0.14),transparent_65%)] md:bg-[radial-gradient(70%_40%_at_50%_10%,rgba(120,0,0,0.20),transparent_55%)] lg:bg-[radial-gradient(55%_35%_at_50%_15%,rgba(120,0,0,0.25),transparent_45%)] " />
            </div>

            {/* ================= MAIN ================= */}
            <div className="relative z-10 w-full px-6 md:px-24">
                {/* BACK BUTTON */}
                <div className="pt-10">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur transition hover:bg-white/10"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </button>
                </div>

                {/* HERO */}
                <div className="mt-16 max-w-4xl">
                    <p className="reveal opacity-0 translate-y-10 text-xs tracking-widest text-red-600">
                        FOR CAFÉ OWNERS
                    </p>

                    <h1 className="reveal opacity-0 translate-y-10 mt-4 text-4xl md:text-6xl font-semibold">
                        Partner with Krown
                    </h1>

                    <p className="reveal opacity-0 translate-y-10 mt-6 max-w-xl text-lg text-white/70">
                        Join Chennai&apos;s curated café membership network and
                        host community-driven experiences.
                    </p>
                </div>

                {/* CARDS */}

                {/* SECTION HEADING ABOVE CARDS */}
                <div

                    ref={cardsRef}
                    className="mt-20 mb-10 flex flex-col items-center text-center">
                    <h2 className="reveal opacity-0 translate-y-10 text-[26px] sm:text-[30px] md:text-[32px] lg:text-[40px] font-semibold">
                        What It Means to Be a Krown Partner
                    </h2>

                </div>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center sm:justify-items-stretch">

                    {FEATURES.map((f, i) => (
                        <div
                            key={i}
                            className="card opacity-0 translate-y-12 flex h-[320px] w-full max-w-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur text-center ">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-600/10 text-red-600">
                                <f.icon className="h-6 w-6" />
                            </div>

                            <h3 className="text-lg font-semibold">
                                {f.title}
                            </h3>

                            <p className="mt-3 max-w-[220px] text-sm text-white/60">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="h-32" />
            </div>

            <HowPartnershipWorks />
            <PartnerValuesSection />
            <WhyCafesChooseKrown />
            <PartnerCTASection onBecomePartner={onBecomePartner} />
        </section>
    );
}
