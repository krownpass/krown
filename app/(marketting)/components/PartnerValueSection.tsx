
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const POINTS = [
    "Independent cafés",
    "Culture-driven spaces",
    "Community-friendly teams",
    "Chennai-based locations",
];

export default function PartnerValuesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".value-item", {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.18,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-[88vh] md:h-[90vh]  overflow-hidden flex items-center"
        >
            {/* Subtle background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="
            absolute inset-0
            bg-[radial-gradient(80%_50%_at_50%_30%,rgba(120,0,0,0.14),transparent_65%)]
            md:bg-[radial-gradient(60%_45%_at_30%_40%,rgba(120,0,0,0.18),transparent_60%)]
            lg:bg-[radial-gradient(50%_40%_at_20%_40%,rgba(120,0,0,0.22),transparent_55%)]
        "
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                {/* LEFT TEXT */}
                <div>
                    <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight max-w-xl">
                        Krown partners with cafés that believe in community,
                        <span className="text-white/80">
                            {" "}
                            not just footfall.
                        </span>
                    </h2>
                </div>

                {/* RIGHT LIST */}
                <div className="flex flex-col gap-5">
                    {POINTS.map((text, i) => (
                        <div
                            key={i}
                            className="value-item opacity-0 translate-y-6 flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur"
                        >
                            {/* Bullet */}
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#8C001A]">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#8C001A]" />
                            </span>

                            {/* Text */}
                            <p className="text-sm md:text-base text-white">
                                {text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
