"use client";

import Image from "next/image";
import { IMAGES } from "@/public";
import { forwardRef, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";

const TRANSITION_KEY = "krown:page-transition";
const DIRECTION_KEY = "krown:page-direction"; // forward | back

type Props = {
    onBecomePartner: () => void;
};

const PartnerWithKrown = forwardRef<HTMLDivElement, Props>(
    ({ onBecomePartner }, ref) => {
        const panelRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const router = useRouter();

        /* ================= HARD RESET ================= */
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

        /* ================= ARRIVAL TRANSITION ================= */
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
                    .to(panel, { x: "-100%", duration: 0.6 })
                    .to(
                        content,
                        { opacity: 1, x: 0, duration: 0.45 },
                        "-=0.35"
                    );
            }
        }, []);

        /* ================= FORWARD ================= */
        const handleLearnMore = () => {
            const panel = panelRef.current;
            const content = contentRef.current;
            if (!panel || !content) return;

            sessionStorage.setItem(TRANSITION_KEY, "true");
            sessionStorage.setItem(DIRECTION_KEY, "forward");

            gsap.timeline({ defaults: { ease: "power4.inOut" } })
                .to(content, { opacity: 0.6, x: -20, duration: 0.25 })
                .to(panel, { x: "0%", duration: 0.65 }, "<")
                .add(() => router.push("/partner"));
        };

        return (
            <section
                ref={ref}
                className="relative w-full overflow-hidden bg-black py-36 scroll-mt-32"
            >
                {/* BLACK WIPE PANEL */}
                <div
                    ref={panelRef}
                    className="fixed inset-0 z-[9999] bg-black"
                />

                {/* BACKGROUND IMAGE */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={IMAGES.parterBg}
                        alt="Partner with Krown"
                        fill
                        priority
                        className="object-cover opacity-20"
                    />
                </div>

                {/* OVERLAY */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />

                {/* CONTENT */}
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
                                Krown brings the right customers to the right cafés.
                                No deep discounts. No mass promotions. Just consistent discovery and genuine repeat visits.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                                <button
                                    onClick={onBecomePartner}
                                    className="rounded-xl bg-[#800020] px-6 py-3 text-sm font-medium text-white hover:bg-[#a0003c]"
                                >
                                    Become a Partner
                                </button>

                                <button
                                    onClick={handleLearnMore}
                                    className="rounded-xl border border-white/20 px-6 py-3 text-sm text-white/80 hover:bg-white/10"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <FeatureCard
                                title="Increase Footfall"
                                description="Reach members who actively explore cafés and return often."
                            />
                            <FeatureCard
                                title="Boost Revenue"
                                description="Members tend to stay longer, order more, and come back."
                            />
                            <FeatureCard
                                title="Host Events"
                                description="Open your space to curated gatherings and community-led events."
                            />
                            <FeatureCard
                                title="Zero Commission Model"
                                description="No commissions. No revenue cuts. Your sales stay yours."
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
);

PartnerWithKrown.displayName = "PartnerWithKrown";
export default PartnerWithKrown;

/* ================= SUB COMPONENTS ================= */

function FeatureCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="font-medium text-white">{title}</h3>
            <p className="mt-2 text-sm text-white/60">{description}</p>
        </div>
    );
}
