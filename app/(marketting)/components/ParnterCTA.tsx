
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";

export default function PartnerCTASection({
    onBecomePartner,
}: {
    onBecomePartner: () => void;
}) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const scrollToFooter = () => {
        document
            .getElementById("footer")
            ?.scrollIntoView({ behavior: "smooth" });
    };
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".cta-reveal",
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
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
            className="relative w-full min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden">
            {/* ================= RESPONSIVE GLOW ================= */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="
                        absolute inset-0
                        bg-[radial-gradient(80%_45%_at_50%_40%,rgba(120,0,0,0.18),transparent_65%)]
                        md:bg-[radial-gradient(60%_40%_at_50%_40%,rgba(120,0,0,0.22),transparent_55%)]
                        lg:bg-[radial-gradient(50%_35%_at_50%_40%,rgba(120,0,0,0.25),transparent_45%)]
                    "
                />
            </div>

            {/* ================= CONTENT ================= */}
            <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 md:py-28 text-center">
                <h2 className="cta-reveal text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                    Ready to explore a
                    <br className="hidden sm:block" />
                    partnership?
                </h2>

                <div className="cta-reveal mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* PRIMARY CTA */}
                    <button onClick={onBecomePartner}
                        className="
                            relative
                            rounded-xl
                            bg-[#8C001A]
                            px-8 py-4
                            text-sm font-medium text-white
                            transition
                            hover:bg-[#a00022]
                            focus:outline-none
                        "

                    >
                        Become a Partner
                    </button>

                    {/* SECONDARY CTA */}
                    <button
                        onClick={scrollToFooter}
                        className="
                            rounded-xl
                            border border-white/20
                            px-8 py-4
                            text-sm font-medium text-white/90
                            transition
                            hover:bg-white/10
                        "
                    >
                        Contact Us
                    </button>
                </div>

            </div>
        </section>
    );
}
