"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function PartnerCTASection({
    onBecomePartner,
}: {
    onBecomePartner: () => void;
}) {
    const sectionRef = useRef<HTMLDivElement>(null);

    const scrollToFooter = () => {
        document
            .getElementById("footer")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".cta-reveal",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    stagger: 0.12,
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="bg-[#0A0A0A] relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden ">
            {/* ===== DARK VIGNETTE BACKGROUND ===== */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_40%,rgba(140,0,26,0.25),transparent_60%)]" />
            </div>

            {/* ===== CONTENT ===== */}
            <div className="relative z-10 mx-auto w-full max-w-md px-6 text-center">
                <h2 className="cta-reveal text-white text-3xl sm:text-4xl font-semibold leading-tight">
                    Ready to explore a
                    <br />
                    partnership?
                </h2>

                <div className="cta-reveal mt-10 flex flex-col gap-4">
                    {/* PRIMARY CTA */}
                    <button
                        onClick={onBecomePartner}
                        className="w-full rounded-xl bg-[#800020] py-4 text-sm font-medium text-white transition hover:bg-[#a00022] focus:outline-none ">
                        Become a Partner
                    </button>

                    {/* SECONDARY CTA */}
                    <button
                        onClick={scrollToFooter}
                        className="w-full rounded-xl border border-white/25 py-4 text-sm font-medium text-white transition hover:bg-white/10">
                        Contact Us
                    </button>
                </div>
            </div>
        </section>
    );
}
