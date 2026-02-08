"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function IntroOverlay({
    onComplete,
}: {
    onComplete: () => void;
}) {
    const root = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    /* Detect screen size AFTER mount (hydration-safe) */
    useLayoutEffect(() => {
        if (typeof window === "undefined") return;
        setIsMobile(window.innerWidth < 768);
    }, []);

    useLayoutEffect(() => {
        if (!root.current) return;

        const ctx = gsap.context(() => {
            const q = gsap.utils.selector(root);

            const WORD_Y_IN = isMobile ? 30 : 60;
            const WORD_Y_OUT = isMobile ? -24 : -40;
            const LOGO_SCALE_IN = isMobile ? 0.95 : 0.9;
            const LOGO_BURST = isMobile ? 4 : 10;

            gsap.set(root.current, { autoAlpha: 1 });
            gsap.set(q(".word"), { autoAlpha: 0, y: WORD_Y_IN });
            gsap.set(q(".logo"), {
                autoAlpha: 0,
                scale: LOGO_SCALE_IN,
                y: isMobile ? 6 : 12,
                transformOrigin: "50% 50%",
            });

            gsap
                .timeline({
                    defaults: { ease: "power3.out" },
                    onComplete,
                })
                .to(q(".word"), {
                    autoAlpha: 1,
                    y: 0,
                    stagger: isMobile ? 0.1 : 0.12,
                    duration: isMobile ? 0.6 : 0.8,
                })
                .to(q(".word"), {
                    autoAlpha: 0,
                    y: WORD_Y_OUT,
                    stagger: 0.08,
                    duration: isMobile ? 0.45 : 0.6,
                    ease: "power2.in",
                })
                .to({}, { duration: isMobile ? 0.08 : 0.12 })
                .to(q(".logo"), {
                    autoAlpha: 1,
                    scale: 1,
                    duration: isMobile ? 0.55 : 0.7,
                })
                .to(q(".logo"), {
                    scale: LOGO_BURST,
                    autoAlpha: 0,
                    duration: isMobile ? 0.9 : 1.1,
                    ease: "power4.in",
                })
                .to(root.current, {
                    autoAlpha: 0,
                    duration: 0.35,
                });
        }, root);

        return () => ctx.revert();
    }, [isMobile, onComplete]);

    return (
        <div
            ref={root}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black opacity-0 invisible"
        >
            {/* Words */}
            <div className="absolute z-20 flex flex-wrap justify-center gap-x-3 gap-y-2 px-6 text-center font-bold text-white text-[clamp(1.4rem,6vw,3.4rem)]">
                <span className="word">Average is</span>
                <span className="word">everywhere,</span>
                <span className="word">This isn&apos;t.</span>
            </div>

            {/* Logo */}
            <div className="logo absolute z-10 text-[#A00028] font-extrabold tracking-[0.18em] md:tracking-[0.25em] text-[clamp(2.2rem,10vw,6.5rem)]">
                KROWN
            </div>
        </div>
    );
}
