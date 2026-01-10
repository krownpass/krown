
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
    {
        value: 500,
        suffix: "+",
        label: "Active Members",
    },
    {
        value: 30,
        suffix: "+",
        label: "Partner Cafés",
    },
    {
        value: 50,
        prefix: "₹",
        suffix: "k+",
        label: "Avg Monthly Value",
    },
];

export default function WhyCafesChooseKrown() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Cards reveal
            gsap.to(".stat-card", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
            });

            // Count-up animation
            document.querySelectorAll<HTMLElement>("[data-count]").forEach(el => {
                const endValue = Number(el.dataset.count);
                const prefix = el.dataset.prefix || "";
                const suffix = el.dataset.suffix || "";

                gsap.fromTo(
                    el,
                    { innerText: 0 },
                    {
                        innerText: endValue,
                        duration: 1.4,
                        ease: "power3.out",
                        snap: { innerText: 1 },
                        scrollTrigger: {
                            trigger: el,
                            start: "top 80%",
                        },
                        onUpdate() {
                            el.innerText =
                                prefix +
                                Math.floor(Number(el.innerText)) +
                                suffix;
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black py-32 overflow-hidden"
        >

            <div className="pointer-events-none absolute inset-0">
                <div
                    className="
            absolute inset-0
            bg-[radial-gradient(70%_40%_at_50%_0%,rgba(128,0,32,0.18),transparent_65%)]
            md:bg-[radial-gradient(50%_35%_at_50%_10%,rgba(128,0,32,0.22),transparent_60%)]
            lg:bg-[radial-gradient(40%_30%_at_50%_10%,rgba(128,0,32,0.25),transparent_55%)]
        "
                />
            </div>
            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Heading */}
                <h2 className="text-center text-3xl md:text-4xl font-semibold text-white">
                    Why Cafés Choose Krown
                </h2>

                {/* Cards */}
                <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {STATS.map((stat, i) => (
                        <div
                            key={i}
                            className="stat-card opacity-0 translate-y-8 relative rounded-2xl border border-white/10 bg-black/70 p-10 text-center backdrop-blur-xl
shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_20px_40px_rgba(0,0,0,0.6)] transition hover:-translate-y-1 hover:border-white/20">
                            {/* Soft inner glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

                            <div
                                data-count={stat.value}
                                data-prefix={stat.prefix || ""}
                                data-suffix={stat.suffix || ""}
                                className="relative z-10 text-5xl font-semibold text-[#800020]"
                            >
                                0
                            </div>

                            <p className="relative z-10 mt-4 text-xs uppercase tracking-widest text-white/60">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footnote */}
                <p className="mt-16 text-center text-xs text-white/40">
                    Based on current Chennai partnerships.
                </p>
            </div>
        </section>
    );
}
