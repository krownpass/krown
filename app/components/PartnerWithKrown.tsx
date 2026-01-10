"use client";

import Image from "next/image";
import { IMAGES } from "@/public";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";

const TRANSITION_KEY = "krown:page-transition";
const DIRECTION_KEY = "krown:page-direction"; // forward | back

export default function PartnerWithKrown({
    onBecomePartner,
}: {
    onBecomePartner: () => void;
}) {
    const panelRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    /* ================= HARD RESET (NO FLICKER / BFCache SAFE) ================= */
    useLayoutEffect(() => {
        const panel = panelRef.current;
        const content = contentRef.current;
        if (!panel || !content) return;

        const reset = () => {
            gsap.set(panel, { x: "-100%" });
            gsap.set(content, { opacity: 1, x: 0, y: 0 });
        };

        reset();
        window.addEventListener("pageshow", reset);
        return () => window.removeEventListener("pageshow", reset);
    }, []);

    /* ================= ARRIVAL TRANSITION (BACK TO HOME) ================= */
    useLayoutEffect(() => {
        const panel = panelRef.current;
        const content = contentRef.current;
        if (!panel || !content) return;

        if (sessionStorage.getItem(TRANSITION_KEY) !== "true") return;

        const direction = sessionStorage.getItem(DIRECTION_KEY);
        sessionStorage.removeItem(TRANSITION_KEY);
        sessionStorage.removeItem(DIRECTION_KEY);

        if (direction === "back") {
            gsap.set(panel, { x: "100%" });
            gsap.set(content, { opacity: 0, x: 80 });

            gsap.timeline({ defaults: { ease: "power3.out" } })
                .to(panel, {
                    x: "-100%",
                    duration: 0.6,
                })
                .to(
                    content,
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.45,
                    },
                    "-=0.35"
                );
        }
    }, []);

    /* ================= FORWARD (LEARN MORE) ================= */
    const handleLearnMore = () => {
        const panel = panelRef.current;
        const content = contentRef.current;
        if (!panel || !content) return;

        sessionStorage.setItem(TRANSITION_KEY, "true");
        sessionStorage.setItem(DIRECTION_KEY, "forward");

        gsap.timeline({ defaults: { ease: "power4.inOut" } })
            .to(content, {
                opacity: 0.6,
                x: -20,
                duration: 0.25,
            })
            .to(
                panel,
                {
                    x: "0%",
                    duration: 0.65,
                },
                "<"
            )
            .add(() => router.push("/partner"));
    };

    /* ================= BACK INTENT (SWIPE / KEY / BUTTON) ================= */
    useLayoutEffect(() => {
        let startX = 0;

        const triggerBack = () => {
            const panel = panelRef.current;
            if (!panel) return;

            sessionStorage.setItem(TRANSITION_KEY, "true");
            sessionStorage.setItem(DIRECTION_KEY, "back");

            gsap.set(panel, { x: "100%" });
            gsap.to(panel, {
                x: "0%",
                duration: 0.55,
                ease: "power4.inOut",
            });
        };

        const onPopState = () => triggerBack();

        const onTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].clientX;
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (e.changedTouches[0].clientX - startX > 80) {
                triggerBack();
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "Backspace" ||
                (e.altKey && e.key === "ArrowLeft")
            ) {
                triggerBack();
            }
        };

        window.addEventListener("popstate", onPopState);
        window.addEventListener("touchstart", onTouchStart);
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("popstate", onPopState);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    return (
        <section className="relative w-full overflow-hidden bg-black py-36">
            {/* ================= BLACK WIPE PANEL ================= */}
            <div
                ref={panelRef}
                className="fixed inset-0 z-[9999] bg-black"
            />

            {/* ================= BACKGROUND IMAGE ================= */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={IMAGES.parterBg}
                    alt="Partner with Krown"
                    fill
                    priority
                    className="object-cover opacity-20"
                />
            </div>

            {/* ================= DARK OVERLAY ================= */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />

            {/* ================= CONTENT ================= */}
            <div
                ref={contentRef}
                className="relative z-20 mx-auto max-w-7xl px-6"
            >
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    {/* LEFT */}
                    <div>
                        <p className="mb-4 text-xs uppercase tracking-widest text-[#800020]">
                            For Café Owners
                        </p>

                        <h2 className="text-6xl font-semibold leading-tight text-white md:text-5xl">
                            Partner with{" "}
                            <span className="text-[#800020]">Krown</span>
                        </h2>

                        <p className="mt-6 max-w-lg leading-relaxed text-white/70">
                            Join Chennai’s premier café membership network.
                            Get consistent customers, increase revenue,
                            and become part of an exclusive community.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <button
                                onClick={onBecomePartner}
                                className="w-full sm:w-auto rounded-xl bg-[#800020] px-6 py-4 sm:py-3 text-sm font-medium text-white transition hover:bg-[#a0003c]"
                            >
                                Become a Partner
                            </button>

                            <button
                                onClick={handleLearnMore}
                                className="w-full sm:w-auto rounded-xl border border-white/20 px-6 py-4 sm:py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
                            >
                                Learn More
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 flex gap-10">
                            <Stat value="500+" label="Active Members" />
                            <Stat value="₹50k+" label="Avg Monthly Value" />
                            <Stat value="30+" label="Partner Cafés" />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FeatureCard
                            title="Increase Footfall"
                            description="Attract a consistent flow of quality customers"
                        />
                        <FeatureCard
                            title="Boost Revenue"
                            description="Members spend more"
                        />
                        <FeatureCard
                            title="Host Events"
                            description="Curated community events"
                        />
                        <FeatureCard
                            title="Premium Branding"
                            description="Exclusive café network"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ================= SUB COMPONENTS ================= */

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div>
            <p className="text-xl font-semibold text-[#800020]">{value}</p>
            <p className="text-xs uppercase tracking-wide text-white/60">
                {label}
            </p>
        </div>
    );
}

function FeatureCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#800020]/20">
                <div className="h-4 w-4 rounded-full bg-[#800020]" />
            </div>

            <h3 className="font-medium text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
                {description}
            </p>
        </div>
    );
}
